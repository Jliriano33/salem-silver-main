import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/deals/types';
import { getDeal, routableDeals } from '@/lib/deals/registry';
import { photoExists } from '@/lib/deals/photos';
import ui from '@/content/deals/_ui';
import DealPage from '@/components/deals/DealPage';

export function dealStaticParams() {
  return routableDeals().map((d) => ({ slug: d.slug }));
}

export function dealMetadata(slug: string, locale: Locale): Metadata {
  const deal = getDeal(slug);
  if (!deal) return {};
  const first = deal.photos[0];
  const image =
    first && photoExists(deal.slug, first.file) ? `/deals/${deal.slug}/${first.file}` : '/deals/_placeholder-og.png';
  const title = deal.seo.title[locale];
  const description = deal.seo.description[locale];
  const url = locale === 'es' ? `/es/deals/${deal.slug}` : `/deals/${deal.slug}`;
  return {
    title: { absolute: title },
    description,
    robots: { index: deal.indexable, follow: deal.indexable },
    alternates: {
      canonical: url,
      languages: { en: `/deals/${deal.slug}`, es: `/es/deals/${deal.slug}` },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: locale === 'es' ? 'es_US' : 'en_US',
      images: [{ url: image }],
    },
  };
}

export function renderDeal(slug: string, locale: Locale) {
  const deal = getDeal(slug);
  if (!deal) notFound();
  return <DealPage deal={deal} locale={locale} ui={ui} />;
}
