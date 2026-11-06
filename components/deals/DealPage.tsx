import Image from 'next/image';
import Link from 'next/link';
import type { Deal, Locale, Money, Num, Opt, Text } from '@/lib/deals/types';
import type { DealUiStrings } from '@/lib/deals/ui-strings';
import { photoExists } from '@/lib/deals/photos';
import InvestorForm from '@/components/deals/InvestorForm';
import Gallery, { type GalleryPhoto } from '@/components/deals/Gallery';
import SetHtmlLang from '@/components/deals/SetHtmlLang';

// Laid out like a residential listing page (photo mosaic, status line, price and
// counts, key facts, description, grouped facts and features, a sticky side card),
// with the investor facts a deal page needs: ARV, repairs, condition and systems.

// Anywhere in the string, not only at the start (audit A-01): a half-filled sentence counts as unfilled.
const isPlaceholder = (v: unknown): boolean => typeof v === 'string' && v.includes('PLACEHOLDER_');

type Fmt = 'money' | 'num' | 'year';

// A real figure: Infinity or NaN never reaches the page (audit C-04).
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function fmt(v: number | string, locale: Locale, pending: string, kind: Fmt): string {
  if (!isNum(v)) return pending;
  if (kind === 'year') return String(v);
  const s = new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', { maximumFractionDigits: kind === 'money' ? 0 : 2 }).format(v);
  return kind === 'money' ? `$${s}` : s;
}

function text(v: Text | string, locale: Locale, pending: string): string {
  const s = typeof v === 'string' ? v : v[locale];
  return isPlaceholder(s) ? pending : s;
}

const pendingText = (v: Text | string, locale: Locale) => isPlaceholder(typeof v === 'string' ? v : v[locale]);

type Row = { label: string; value: string; isPending: boolean };

/** Builds rows, dropping any field set to null. */
function rowsOf(
  locale: Locale,
  pending: string,
  items: [string, Opt<Text> | Opt<Num> | Opt<Money>, Fmt | 'text'][],
): Row[] {
  return items.flatMap(([label, v, kind]) => {
    if (v === null) return [];
    if (kind === 'text') return [{ label, value: text(v as Text, locale, pending), isPending: pendingText(v as Text, locale) }];
    return [{ label, value: fmt(v as number | string, locale, pending, kind), isPending: !isNum(v) }];
  });
}

const valueCls = (p: boolean) => (p ? 'font-medium text-gray-500' : 'font-semibold text-brand-navy');

/** Two-column label/value list, the "facts and features" style. */
function FactList({ title, rows, twoCol }: { title?: string; rows: Row[]; twoCol?: boolean }) {
  if (rows.length === 0) return null;
  return (
    <div className="min-w-0">
      {title && <h3 className="border-b-2 border-brand-navy pb-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">{title}</h3>}
      <dl className={twoCol ? 'grid border-t-2 border-brand-navy md:grid-cols-2 md:gap-x-10 [&>div]:border-b [&>div]:border-brand-silver-light/60' : 'divide-y divide-brand-silver-light/60'}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
            <dt className="text-gray-600">{r.label}</dt>
            <dd className={`break-words text-right ${valueCls(r.isPending)}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const h2 = 'text-xl font-bold text-brand-navy sm:text-2xl';

export default function DealPage({ deal, locale, ui }: { deal: Deal; locale: Locale; ui: DealUiStrings }) {
  const pending = ui.pending[locale];
  const L = ui.listing;
  const t = (s: { en: string; es: string }) => s[locale];
  const other: Locale = locale === 'en' ? 'es' : 'en';
  const otherHref = other === 'es' ? `/es/deals/${deal.slug}` : `/deals/${deal.slug}`;
  const toggleLabel = other === 'es' ? ui.langToggle.toEs[locale] : ui.langToggle.toEn[locale];

  const photos: GalleryPhoto[] = deal.photos.map((p) => ({
    src: photoExists(deal.slug, p.file) ? `/deals/${deal.slug}/${p.file}` : null,
    // An 800px copy next to the photo (01-800.jpg) is served to phones; see docs/deals/README.md.
    small: photoExists(deal.slug, p.file.replace(/\.jpg$/i, '-800.jpg')) ? `/deals/${deal.slug}/${p.file.replace(/\.jpg$/i, '-800.jpg')}` : null,
    alt: text(p.alt, locale, pending),
  }));
  const docs = deal.documents.filter((d) => photoExists(deal.slug, `docs/${d.file}`));

  const { address: a, price, details: d, numbers: n, condition: c } = deal;
  const street = text(a.street, locale, pending);
  const cityLine = `${text(a.city, locale, pending)}, ${text(a.state, locale, pending)} ${text(a.zip, locale, pending)}`;
  const askingStr = fmt(price.asking, locale, pending, 'money');
  const askingPending = !isNum(price.asking);
  const perSqft =
    isNum(price.asking) && isNum(d.sqft) && d.sqft > 0
      ? `${fmt(Math.round(price.asking / d.sqft), locale, pending, 'money')} ${t(L.perSqft)}`
      : null;
  const typeStr = pendingText(d.propertyType, locale) ? null : text(d.propertyType, locale, pending);

  // A range with either end unknown is pending as a whole, never shown as one figure (audit C-03).
  const repairsPending =
    !isNum(n.estimatedRepairs) || (n.estimatedRepairsHigh !== null && !isNum(n.estimatedRepairsHigh));
  const repairs = repairsPending
    ? pending
    : n.estimatedRepairsHigh !== null
      ? `${fmt(n.estimatedRepairs, locale, pending, 'money')} – ${fmt(n.estimatedRepairsHigh, locale, pending, 'money')}`
      : fmt(n.estimatedRepairs, locale, pending, 'money');

  const counts = rowsOf(locale, pending, [
    [ui.details.beds[locale], d.beds, 'num'],
    [ui.details.baths[locale], d.baths, 'num'],
    [ui.details.sqft[locale], d.sqft, 'num'],
  ]);

  const keyFacts = rowsOf(locale, pending, [
    [ui.details.lotSize[locale], d.lotSize, 'text'],
    [ui.details.yearBuilt[locale], d.yearBuilt, 'year'],
    [ui.details.propertyType[locale], d.propertyType, 'text'],
    [t(L.units), d.units, 'num'],
    [t(L.condition.occupancy), c.occupancy, 'text'],
    [t(L.condition.overall), c.overall, 'text'],
    [t(L.annualTaxes), d.annualTaxes, 'money'],
    [t(L.assessedValue), d.assessedValue, 'money'],
  ]);

  const conditionRows = rowsOf(locale, pending, [
    [t(L.condition.overall), c.overall, 'text'],
    [t(L.condition.roofAge), c.roofAge, 'text'],
    [t(L.condition.heatingSystem), c.heatingSystem, 'text'],
    [t(L.condition.heatingAge), c.heatingAge, 'text'],
    [t(L.condition.airConditioning), c.airConditioning, 'text'],
    [t(L.condition.foundationType), c.foundationType, 'text'],
    [t(L.condition.foundationCondition), c.foundationCondition, 'text'],
    [t(L.condition.electrical), c.electrical, 'text'],
    [t(L.condition.plumbing), c.plumbing, 'text'],
    [t(L.condition.waterHeater), c.waterHeater, 'text'],
    [t(L.condition.occupancy), c.occupancy, 'text'],
  ]);
  const interiorRows = rowsOf(locale, pending, [
    [ui.details.beds[locale], d.beds, 'num'],
    [ui.details.baths[locale], d.baths, 'num'],
    [t(L.halfBaths), d.halfBaths, 'num'],
    [ui.details.sqft[locale], d.sqft, 'num'],
    [t(L.basement), d.basement, 'text'],
  ]);
  const exteriorRows = rowsOf(locale, pending, [
    [ui.details.lotSize[locale], d.lotSize, 'text'],
    [t(L.parking), d.parking, 'text'],
  ]);
  const constructionRows = rowsOf(locale, pending, [
    [ui.details.propertyType[locale], d.propertyType, 'text'],
    [t(L.units), d.units, 'num'],
    [ui.details.yearBuilt[locale], d.yearBuilt, 'year'],
  ]);

  // Side card buttons sit on navy; the main one keeps the brand light blue (Jefri).
  const primaryBtn =
    'inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-brand-blue px-5 text-base font-semibold text-white hover:bg-brand-blue-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy';
  const secondaryBtn =
    'inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-white/70 px-5 text-base font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy';

  return (
    <div lang={locale} className="min-h-screen bg-white text-brand-dark">
      {locale === 'es' && <SetHtmlLang lang="es" />}
      <header className="border-b border-brand-silver-light/60 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex-shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <Image src="/deals/_logo.png" alt="Salem Silver Capital" width={680} height={425} className="h-14 w-auto sm:h-16" priority />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="tel:+16177142020"
              className="hidden text-sm font-semibold text-brand-navy hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue sm:inline"
            >
              (617) 714-2020
            </a>
            <Link
              href={otherHref}
              hrefLang={other}
              lang={other}
              className="inline-flex min-h-[44px] items-center rounded-full border border-brand-blue px-4 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              {toggleLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>{t(L.crumbRoot)}</li>
            <li aria-hidden="true">›</li>
            <li>{text(a.city, locale, pending)}</li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-semibold text-brand-navy">{street}</li>
          </ol>
        </nav>

        <Gallery
          photos={photos}
          labels={{
            comingSoon: ui.gallery.comingSoon[locale],
            open: ui.gallery.open[locale],
            close: ui.gallery.close[locale],
            next: ui.gallery.next[locale],
            prev: ui.gallery.prev[locale],
            counter: ui.gallery.counter[locale],
            seeAll: t(L.seeAll),
          }}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-10">
            <section aria-labelledby="deal-address">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">
                {t(L.status)}
                {typeStr && ` · ${typeStr}`}
              </p>
              <div className="mt-3 flex flex-col gap-4">
                <div className="min-w-0">
                  <h1 id="deal-address" className="break-words font-serif text-4xl font-bold leading-[1.1] text-brand-navy sm:text-5xl lg:text-6xl">
                    {street}
                  </h1>
                  <p className="mt-2 text-xl text-gray-700 sm:text-2xl">{cityLine}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
                    <span className="sr-only">{ui.price.asking[locale]}: </span>
                    <span className={askingPending ? 'text-2xl font-semibold text-gray-500' : 'text-4xl font-bold tabular-nums text-brand-blue sm:text-5xl'}>
                      {askingStr}
                    </span>
                    {perSqft && <span className="text-sm text-gray-600">{perSqft}</span>}
                  </p>
                </div>
                <dl className="flex gap-6 md:gap-8">
                  {counts.map((r) => (
                    <div key={r.label} className="flex min-w-0 flex-col-reverse">
                      <dt className="text-xs text-gray-600">{r.label}</dt>
                      <dd className={`tabular-nums ${r.isPending ? 'text-base font-medium text-gray-500' : 'text-2xl font-bold text-brand-navy'}`}>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-4 text-sm leading-snug text-gray-700">{ui.notice.short[locale]}</p>
            </section>

            <section aria-labelledby="deal-key-facts">
              <h2 id="deal-key-facts" className="sr-only">{t(L.keyFacts)}</h2>
              <dl className="grid grid-cols-2 border-l border-t border-brand-silver-light sm:grid-cols-4">
                {keyFacts.map((r) => (
                  <div key={r.label} className="min-w-0 border-b border-r border-brand-silver-light p-3 sm:p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">{r.label}</dt>
                    <dd className={`mt-1 break-words text-base ${valueCls(r.isPending)}`}>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="deal-numbers">
              <h2 id="deal-numbers" className={h2}>{ui.numbers.heading[locale]}</h2>
              <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-brand-navy bg-white/20 sm:grid-cols-2">
                {[
                  { label: ui.price.asking[locale], value: askingStr, p: askingPending },
                  { label: ui.numbers.arv[locale], value: fmt(n.arv, locale, pending, 'money'), p: !isNum(n.arv) },
                  { label: ui.numbers.estimatedRepairs[locale], value: repairs, p: repairsPending },
                  ...(price.assignmentFee !== null
                    ? [{ label: ui.price.assignmentFee[locale], value: fmt(price.assignmentFee, locale, pending, 'money'), p: !isNum(price.assignmentFee) }]
                    : []),
                ].map((r) => (
                  <div key={r.label} className="min-w-0 bg-brand-navy p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-brand-silver-light">{r.label}</dt>
                    <dd className={`mt-1 break-words ${r.p ? 'text-base font-medium text-brand-silver-light' : 'text-3xl font-bold tabular-nums text-white'}`}>{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-gray-600">{ui.numbers.estimateNote[locale]}</p>
            </section>

            <section aria-labelledby="deal-description">
              <h2 id="deal-description" className={h2}>{ui.description.heading[locale]}</h2>
              <p className="mt-3 whitespace-pre-line break-words leading-relaxed text-gray-800">{text(deal.description, locale, pending)}</p>
            </section>

            <section aria-labelledby="deal-condition">
              <h2 id="deal-condition" className={h2}>{t(L.conditionHeading)}</h2>
              <div className="mt-4">
                <FactList rows={conditionRows} twoCol />
              </div>
            </section>

            <section aria-labelledby="deal-facts">
              <h2 id="deal-facts" className={h2}>{t(L.factsHeading)}</h2>
              <div className="mt-4 grid gap-x-10 gap-y-8 md:grid-cols-2">
                <FactList title={t(L.interior)} rows={interiorRows} />
                <FactList title={t(L.exterior)} rows={exteriorRows} />
                <FactList title={t(L.construction)} rows={constructionRows} />
              </div>
            </section>

            {docs.length > 0 && (
              <section aria-labelledby="deal-docs">
                <h2 id="deal-docs" className={h2}>{t(L.documents)}</h2>
                <ul className="mt-3 space-y-2">
                  {docs.map((doc) => (
                    <li key={doc.file}>
                      <a href={`/deals/${deal.slug}/docs/${doc.file}`} className="font-medium text-brand-blue underline hover:text-brand-blue-dark">
                        {text(doc.label, locale, pending)}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="deal-notice" className="rounded-xl border border-brand-gold/50 bg-amber-50 p-5">
              <h2 id="deal-notice" className="text-lg font-bold text-brand-navy">{ui.notice.heading[locale]}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-800">{ui.notice.body[locale]}</p>
            </section>

            <section id="inquiry" aria-labelledby="deal-form" className="scroll-mt-6 rounded-xl border border-brand-silver-light/70 bg-white p-5 shadow-sm sm:p-8">
              <h2 id="deal-form" className={h2}>{ui.form.heading[locale]}</h2>
              <div className="mt-4">
                <InvestorForm slug={deal.slug} locale={locale} ui={ui} />
              </div>
            </section>
          </div>

          <aside aria-label={t(L.requestDetails)} className="hidden lg:block">
            <div className="space-y-4 rounded-xl bg-brand-navy p-5 text-white shadow-sm lg:sticky lg:top-6">
              <div>
                <p className={askingPending ? 'text-xl font-semibold text-brand-silver-light' : 'text-3xl font-bold tabular-nums'}>{askingStr}</p>
                <p className="mt-1 text-sm text-brand-silver-light">{street}, {cityLine}</p>
              </div>
              <a href="#inquiry" className={primaryBtn}>{t(L.requestDetails)}</a>
              <a href="tel:+16177142020" className={secondaryBtn}>
                {t(L.call)} (617) 714-2020
              </a>
              <p className="text-sm text-brand-silver-light">{t(L.pofLine)}</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-brand-navy">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/deals/_logo-footer.png" alt="Salem Silver Capital" width={400} height={250} className="h-14 w-auto brightness-0 invert" />
            <p className="text-sm text-brand-silver-light">{ui.footer.tagline[locale]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="tel:+16177142020" className="text-lg font-semibold text-brand-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
              <span className="sr-only">{ui.footer.phoneLabel[locale]} </span>(617) 714-2020
            </a>
            <Link href="/privacy-policy" className="text-sm text-brand-silver-light underline hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
              {ui.footer.privacy[locale]}
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-brand-silver sm:px-6">{ui.footer.rights[locale]}</p>
        </div>
      </footer>
    </div>
  );
}
