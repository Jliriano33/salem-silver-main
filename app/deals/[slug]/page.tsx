import { dealMetadata, dealStaticParams, renderDeal } from '@/components/deals/dealRoute';

export const dynamicParams = false;

export function generateStaticParams() {
  return dealStaticParams();
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return dealMetadata(params.slug, 'en');
}

export default function Page({ params }: { params: { slug: string } }) {
  return renderDeal(params.slug, 'en');
}
