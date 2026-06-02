import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import CashOfferQuiz from '@/components/CashOfferQuiz';

export const runtime = 'edge';

export const metadata = {
  title: 'Get Your Cash Offer | Salem Silver Capital',
  description: 'Answer a few quick questions to get your fast, no-obligation cash offer for your Massachusetts home.',
  robots: { index: false },
};

export default function CashOfferPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Suspense>
          <CashOfferQuiz />
        </Suspense>
      </main>
    </>
  );
}
