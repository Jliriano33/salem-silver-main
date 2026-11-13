import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ThankYouAddress from '@/components/ThankYouAddress';

export const runtime = 'edge';

export const metadata = {
  title: 'Thank You | Salem Silver Capital',
  robots: { index: false },
};

export default function ThankYou() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="max-w-lg w-full text-center px-4 py-16">
          {/* Checkmark */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="font-serif text-4xl text-brand-blue mb-4">
            We Received Your Info!
          </h1>

          <ThankYouAddress />

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            A member of our team will call you within{' '}
            <strong>24 hours</strong> to discuss your cash offer and answer any
            questions you have.
          </p>

          <p className="text-gray-500 mb-8">
            Need to reach us sooner?{' '}
            <a
              href="tel:+16177142020"
              className="text-brand-blue font-semibold hover:underline"
            >
              Call (617) 714-2020
            </a>
          </p>

          {/* Meta Pixel: Lead fires at submit time (see lib/meta-pixel.ts),
              NOT here. This page is also reachable directly, and the LP form
              lands here after submitting, so firing here would double-count. */}
          {/* Google Ads conversion tag placeholder — add gtag('event', 'conversion') here */}

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
