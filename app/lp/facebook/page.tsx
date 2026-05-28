import type { Metadata } from 'next';
import Image from 'next/image';
import LeadFormLP from '@/components/LeadFormLP';

export const metadata: Metadata = {
  title: 'Get a Cash Offer for Your Home',
  robots: { index: false, follow: false },
};

const stats = [
  { icon: '🏠', label: '500+ Homes Bought' },
  { icon: '⚡', label: '24-Hour Cash Offers' },
  { icon: '$', label: 'Zero Fees or Commissions' },
];

export default function FacebookLP() {
  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header — logo + phone only, no nav distractions */}
      <header className="bg-brand-dark border-b border-white/10 h-14 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          <div className="bg-white/10 rounded-lg px-3 py-1.5">
            <Image
              src="/images/logo/logo-01.png"
              alt="Salem Silver Capital"
              width={120}
              height={26}
              className="h-6 w-auto brightness-0 invert"
              priority
            />
          </div>
          <a
            href="tel:+16177142020"
            className="text-brand-gold font-semibold text-sm"
          >
            (617) 714-2020
          </a>
        </div>
      </header>

      {/* Above the fold: headline + form */}
      <section className="px-4 pt-8 pb-10 max-w-lg mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center bg-brand-gold/15 border border-brand-gold/30 rounded-full px-3 py-1 mb-5">
          <span className="text-brand-gold text-xs font-bold tracking-wider">
            CASH OFFERS · ANY CONDITION · FAST CLOSE
          </span>
        </div>

        <h1 className="font-serif text-3xl text-white leading-tight mb-3">
          Need to Sell Your House Fast?
        </h1>

        <p className="text-brand-silver-light text-base mb-6 leading-relaxed">
          We buy homes as-is — no repairs, no fees, no waiting. Cash offer in{' '}
          <strong className="text-white">24 hours</strong>.
        </p>

        {/* Trust bullets */}
        <ul className="space-y-2 mb-7">
          {[
            'Close in as little as 7 days',
            'Zero commissions or fees — ever',
            'We handle all the paperwork',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-brand-silver-light text-sm">{item}</span>
            </li>
          ))}
        </ul>

        {/* Lead form — above the fold is the CTA */}
        <div id="lp-form" className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white font-semibold text-center mb-4">
            Get My Free Cash Offer — Takes 60 Seconds
          </p>
          <LeadFormLP source="facebook-lp" />
        </div>
      </section>

      {/* Below fold: micro trust signals */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-gray-600 text-xs font-medium leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini footer */}
      <footer className="bg-brand-dark border-t border-white/10 py-4 text-center">
        <p className="text-brand-silver text-xs px-4">
          © 2026 Salem Silver Capital · We are professional home buyers, not real estate agents.
        </p>
      </footer>
    </div>
  );
}
