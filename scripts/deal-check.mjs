#!/usr/bin/env node
// Deal readiness check (goal NN). Plain Node ESM; the only dependency is the repo's
// devDependency "typescript", used to transpile content/deals/<slug>.ts. Works on
// Node 18+ and never relies on Node's native type stripping.
//
//   node scripts/deal-check.mjs <slug>   check one deal
//   node scripts/deal-check.mjs --all    check every deal
//   node scripts/deal-check.mjs --build  what `npm run build` runs (see docs/deals/README.md)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEALS_DIR = path.join(ROOT, 'content', 'deals');
const PUBLIC_DIR = path.join(ROOT, 'public', 'deals');
const PRIVACY_WORDS = ['seller', 'vendedor', 'divorce', 'divorcio', 'probate', 'foreclosure', 'contract date', 'paid'];

function listSlugs() {
  return fs
    .readdirSync(DEALS_DIR)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
    .map((f) => f.slice(0, -3))
    .sort();
}

/** Transpile the TypeScript content file and import it. Returns { deal, raw }. */
async function loadDeal(slug) {
  const file = path.join(DEALS_DIR, `${slug}.ts`);
  if (!fs.existsSync(file)) throw new Error(`content/deals/${slug}.ts does not exist`);
  const raw = fs.readFileSync(file, 'utf8');
  const out = ts.transpileModule(raw, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const url = 'data:text/javascript;base64,' + Buffer.from(out, 'utf8').toString('base64');
  const mod = await import(url);
  if (!mod.default || typeof mod.default !== 'object') throw new Error(`content/deals/${slug}.ts has no default export`);
  return { deal: mod.default, raw };
}

/** Visit every value in the deal, calling fn(value, pathString). */
function walk(value, p, fn) {
  fn(value, p);
  if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${p}[${i}]`, fn));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, p ? `${p}.${k}` : k, fn);
}

function checkDeal(slug, deal) {
  const problems = [];
  // Infinity and NaN are not figures (audit C-04).
  walk(deal, '', (v, p) => {
    if (typeof v === 'number' && !Number.isFinite(v)) problems.push(`not a real number: ${p} = ${v}`);
  });
  if (deal.slug !== slug) problems.push(`slug mismatch: file is ${slug}.ts but slug is "${deal.slug}"`);
  if (!Array.isArray(deal.photos) || deal.photos.length === 0) problems.push('photos is empty');

  walk(deal, '', (v, p) => {
    if (typeof v === 'string' && v.includes('PLACEHOLDER_')) problems.push(`placeholder: ${p} = ${v}`);
    if (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'es' in v) {
      for (const lang of ['en', 'es']) {
        if (typeof v[lang] !== 'string' || v[lang].trim() === '') problems.push(`empty text: ${p}.${lang}`);
      }
    }
  });

  (deal.documents || []).forEach((doc, i) => {
    const f = path.join(PUBLIC_DIR, slug, 'docs', String(doc && doc.file));
    if (!doc || !doc.file || !fs.existsSync(f)) problems.push(`missing document: documents[${i}].file = ${doc && doc.file} (public/deals/${slug}/docs/)`);
    // Files in public/ can be downloaded by anyone with the URL, published or not (audit C-02).
    if (!doc || doc.reviewed !== true) problems.push(`document not reviewed: documents[${i}] needs reviewed: true after a person checked it for names, signatures, contacts and file metadata`);
  });

  (deal.photos || []).forEach((ph, i) => {
    const f = path.join(PUBLIC_DIR, slug, String(ph && ph.file));
    if (!ph || !ph.file || !fs.existsSync(f)) problems.push(`missing photo: photos[${i}].file = ${ph && ph.file} (public/deals/${slug}/)`);
    else if (!fs.existsSync(f.replace(/\.jpg$/i, '-800.jpg'))) console.log(`WARN no 800px copy for ${ph.file}: phones will load the full photo (see README, photo prep)`);
  });
  return problems;
}

function privacyWarnings(slug, raw) {
  const warns = [];
  const lines = raw.split('\n');
  for (const word of PRIVACY_WORDS) {
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes(word)) warns.push(`WARN ${slug}.ts:${i + 1} contains "${word}": check it is not about the sale or a person`);
    });
  }
  return warns;
}

function report(slug, problems, warns) {
  for (const w of warns) console.log(w);
  if (problems.length === 0) {
    console.log(`READY: ${slug}`);
    return;
  }
  console.log(`NOT READY: ${slug} (${problems.length} item${problems.length === 1 ? '' : 's'})`);
  for (const p of problems) console.log(`  - ${p}`);
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/deal-check.mjs <slug> | --all | --build');
    process.exit(2);
  }

  if (arg === '--all' || arg === '--build') {
    const build = arg === '--build';
    const production = build && process.env.CF_PAGES_BRANCH === 'main';
    if (build) console.log(`deal:check build mode: ${production ? 'production (branch main)' : 'non-production (drafts and previews)'}`);
    let failed = false;
    for (const slug of listSlugs()) {
      let loaded;
      try {
        loaded = await loadDeal(slug);
      } catch (e) {
        console.log(`ERROR ${slug}: ${e.message}`);
        failed = true;
        continue;
      }
      const { deal, raw } = loaded;
      const problems = checkDeal(slug, deal);
      const warns = privacyWarnings(slug, raw);
      const mismatch = problems.some((p) => p.startsWith('slug mismatch'));
      if (!build) {
        report(slug, problems, warns);
        if (problems.length) failed = true;
        continue;
      }
      if (production && !deal.published) {
        warns.forEach((w) => console.log(w));
        console.log(`${slug}: skipped (draft, not built in production)`);
        if (mismatch) failed = true;
        continue;
      }
      report(slug, problems, warns);
      if (mismatch) failed = true;
      else if (production && problems.length) failed = true;
    }
    if (failed) console.log(build ? 'deal:check --build FAILED' : 'deal:check --all FAILED');
    process.exit(failed ? 1 : 0);
  }

  const slug = arg.replace(/\.ts$/, '');
  let loaded;
  try {
    loaded = await loadDeal(slug);
  } catch (e) {
    console.error(`ERROR ${slug}: ${e.message}`);
    process.exit(1);
  }
  const problems = checkDeal(slug, loaded.deal);
  report(slug, problems, privacyWarnings(slug, loaded.raw));
  process.exit(problems.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
