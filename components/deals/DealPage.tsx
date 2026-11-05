import Image from 'next/image';
import Link from 'next/link';
import type { Deal, L10n, Locale } from '@/lib/deals/types';
import type { DealUiStrings } from '@/lib/deals/ui-strings';
import { photoExists } from '@/lib/deals/photos';
import InvestorForm from '@/components/deals/InvestorForm';
import Gallery, { type GalleryPhoto } from '@/components/deals/Gallery';
import SetHtmlLang from '@/components/deals/SetHtmlLang';

// Anywhere in the string, not only at the start (audit A-01): a half-filled sentence counts as unfilled.
const isPlaceholder = (v: unknown): boolean => typeof v === 'string' && v.includes('PLACEHOLDER_');

function fmt(v: number | string, locale: Locale, pending: string, kind: 'money' | 'num' | 'year'): string {
  if (typeof v !== 'number') return pending;
  if (kind === 'year') return String(v);
  const s = new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', { maximumFractionDigits: kind === 'money' ? 0 : 2 }).format(v);
  return kind === 'money' ? `$${s}` : s;
}

function text(v: L10n | string, locale: Locale, pending: string): string {
  const s = typeof v === 'string' ? v : v[locale];
  return isPlaceholder(s) ? pending : s;
}

function Stat({ label, value, isPending, big }: { label: string; value: string; isPending: boolean; big?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-600">{label}</dt>
      <dd
        className={`mt-1 break-words ${
          isPending
            ? 'text-base font-medium text-gray-600'
            : big
              ? 'text-3xl font-bold tabular-nums text-brand-dark sm:text-4xl'
              : 'text-xl font-semibold tabular-nums text-brand-dark'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

const h2 = 'text-xl font-bold text-brand-dark sm:text-2xl';

export default function DealPage({ deal, locale, ui }: { deal: Deal; locale: Locale; ui: DealUiStrings }) {
  const pending = ui.pending[locale];
  const other: Locale = locale === 'en' ? 'es' : 'en';
  const otherHref = other === 'es' ? `/es/deals/${deal.slug}` : `/deals/${deal.slug}`;
  const toggleLabel = other === 'es' ? ui.langToggle.toEs[locale] : ui.langToggle.toEn[locale];

  const photos: GalleryPhoto[] = deal.photos.map((p) => ({
    src: photoExists(deal.slug, p.file) ? `/deals/${deal.slug}/${p.file}` : null,
    alt: p.alt[locale],
  }));

  const { address: a, price, details: d, numbers: n } = deal;
  const fee = price.assignmentFee;
  const rows: { label: string; value: string; isPending: boolean }[] = [
    { label: ui.details.beds[locale], value: fmt(d.beds, locale, pending, 'num'), isPending: typeof d.beds !== 'number' },
    { label: ui.details.baths[locale], value: fmt(d.baths, locale, pending, 'num'), isPending: typeof d.baths !== 'number' },
    { label: ui.details.sqft[locale], value: fmt(d.sqft, locale, pending, 'num'), isPending: typeof d.sqft !== 'number' },
    {
      label: ui.details.lotSize[locale],
      value: text(d.lotSize, locale, pending),
      isPending: isPlaceholder(typeof d.lotSize === 'string' ? d.lotSize : d.lotSize[locale]),
    },
    { label: ui.details.yearBuilt[locale], value: fmt(d.yearBuilt, locale, pending, 'year'), isPending: typeof d.yearBuilt !== 'number' },
    {
      label: ui.details.propertyType[locale],
      value: text(d.propertyType, locale, pending),
      isPending: isPlaceholder(typeof d.propertyType === 'string' ? d.propertyType : d.propertyType[locale]),
    },
  ];

  return (
    <div lang={locale} className="min-h-screen bg-white text-brand-dark">
      {locale === 'es' && <SetHtmlLang lang="es" />}
      <header className="border-b border-brand-silver-light/60 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex-shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
            <Image src="/deals/_logo.png" alt="Salem Silver Capital" width={680} height={425} className="h-14 w-auto sm:h-16" priority />
          </Link>
          <Link
            href={otherHref}
            hrefLang={other}
            lang={other}
            className="inline-flex min-h-[44px] items-center rounded-full border border-brand-blue px-4 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            {toggleLabel}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 pb-16 pt-6 sm:px-6">
        <Gallery
          photos={photos}
          labels={{
            comingSoon: ui.gallery.comingSoon[locale],
            open: ui.gallery.open[locale],
            close: ui.gallery.close[locale],
            next: ui.gallery.next[locale],
            prev: ui.gallery.prev[locale],
            counter: ui.gallery.counter[locale],
          }}
        />

        <section aria-labelledby="deal-address">
          <h1 id="deal-address" className="break-words font-serif text-3xl font-bold leading-tight text-brand-dark sm:text-4xl">
            {a.street}
          </h1>
          <p className="mt-1 text-lg text-gray-700">
            {a.city}, {a.state} {a.zip}
          </p>
        </section>

        <section aria-labelledby="deal-price" className="rounded-xl border border-brand-silver-light/70 bg-white p-5 shadow-sm sm:p-6">
          <h2 id="deal-price" className="sr-only">{ui.price.heading[locale]}</h2>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Stat label={ui.price.asking[locale]} value={fmt(price.asking, locale, pending, 'money')} isPending={typeof price.asking !== 'number'} big />
            {fee !== null && (
              <Stat label={ui.price.assignmentFee[locale]} value={fmt(fee, locale, pending, 'money')} isPending={typeof fee !== 'number'} />
            )}
          </dl>
          <p className="mt-4 text-sm leading-snug text-gray-700">{ui.notice.short[locale]}</p>
        </section>

        <section aria-labelledby="deal-details">
          <h2 id="deal-details" className={h2}>{ui.details.heading[locale]}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
            {rows.map((r) => (
              <Stat key={r.label} {...r} />
            ))}
          </dl>
        </section>

        <section aria-labelledby="deal-numbers">
          <h2 id="deal-numbers" className={h2}>{ui.numbers.heading[locale]}</h2>
          <dl className="mt-4 grid grid-cols-1 gap-5 rounded-xl border border-brand-silver-light/70 bg-gray-50 p-5 sm:grid-cols-2">
            <Stat
              label={ui.numbers.estimatedRepairs[locale]}
              value={fmt(n.estimatedRepairs, locale, pending, 'money')}
              isPending={typeof n.estimatedRepairs !== 'number'}
              big
            />
            <Stat label={ui.numbers.arv[locale]} value={fmt(n.arv, locale, pending, 'money')} isPending={typeof n.arv !== 'number'} big />
          </dl>
          <p className="mt-3 text-sm text-gray-600">{ui.numbers.estimateNote[locale]}</p>
        </section>

        <section aria-labelledby="deal-description">
          <h2 id="deal-description" className={h2}>{ui.description.heading[locale]}</h2>
          <p className="mt-3 whitespace-pre-line break-words leading-relaxed text-gray-800">{text(deal.description, locale, pending)}</p>
        </section>

        <section aria-labelledby="deal-notice" className="rounded-xl border border-brand-gold/50 bg-amber-50 p-5">
          <h2 id="deal-notice" className="text-lg font-bold text-brand-dark">{ui.notice.heading[locale]}</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-800">{ui.notice.body[locale]}</p>
        </section>

        <section aria-labelledby="deal-form" className="rounded-xl border border-brand-silver-light/70 bg-white p-5 shadow-sm sm:p-8">
          <h2 id="deal-form" className={h2}>{ui.form.heading[locale]}</h2>
          <div className="mt-4">
            <InvestorForm slug={deal.slug} locale={locale} ui={ui} />
          </div>
        </section>
      </main>

      <footer className="bg-brand-dark">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
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
          <p className="mx-auto max-w-4xl px-4 py-4 text-center text-xs text-brand-silver sm:px-6">{ui.footer.rights[locale]}</p>
        </div>
      </footer>
    </div>
  );
}
