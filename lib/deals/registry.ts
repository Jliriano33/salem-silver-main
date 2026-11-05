// Finds every deal content file at build time, so adding a deal is adding a file.
// Files in content/deals/ whose names start with "_" are not deals (_ui.ts holds
// the page text). No Node APIs here: the edge API route imports this file too.

import type { Deal } from './types';

declare const require: {
  context(dir: string, deep: boolean, re: RegExp): {
    keys(): string[];
    (key: string): { default: Deal };
  };
};

const ctx = require.context('../../content/deals', false, /^\.\/(?!_)[a-z0-9-]+\.ts$/);

/**
 * Cloudflare Pages sets CF_PAGES_BRANCH at build time; main is production.
 * next.config.mjs inlines the answer as DEALS_PRODUCTION_BUILD, because the edge
 * runtime does not see build-time variables.
 */
export function isProductionBuild(): boolean {
  return process.env.DEALS_PRODUCTION_BUILD === '1';
}

export function allDeals(): Deal[] {
  return ctx.keys().map((k) => ctx(k).default);
}

/** Deals that get a page in this build: all of them on previews, published only on production. */
export function routableDeals(): Deal[] {
  const prod = isProductionBuild();
  return allDeals().filter((d) => d.published || !prod);
}

export function getDeal(slug: string): Deal | undefined {
  return routableDeals().find((d) => d.slug === slug);
}

/** Lookup for the API route, which must also accept drafts on previews only. */
export function dealExists(slug: string): boolean {
  return routableDeals().some((d) => d.slug === slug);
}
