import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import LeadFormLP from '@/components/LeadFormLP';

export const metadata: Metadata = {
  title: 'Sell Your House Fast for Cash in Massachusetts',
  description:
    'Get a fair cash offer for your home in 24 hours. We buy houses as-is across Massachusetts — no repairs, no fees, no agent commissions. Close in as little as 7 days.',
  alternates: {
    canonical: 'https://www.salemsilver.com/lp/google',
  },
  openGraph: {
    title: 'Sell Your House Fast for Cash | Salem Silver Capital',
    description: 'Fair cash offers in 24 hours. No fees, no repairs, as-is.',
    images: ['/images/logo/logo-03.png'],
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Salem Silver Capital',
  telephone: '+16177142020',
  url: 'https://www.salemsilver.com',
  description:
    'We buy houses for cash in Massachusetts. Fair all-cash offers in 24 hours. No repairs, no fees, any condition.',
  areaServed: { '@type': 'State', name: 'Massachusetts' },
  priceRange: '$$',
};

const faqs = [
  {
    q: 'How do I sell my house fast for cash in Massachusetts?',
    a: 'Fill out our short form, receive a cash offer within 24 hours, and close in as little as 7 days. No listings, no showings, no waiting for bank financing.',
  },
  {
    q: 'Will Salem Silver Capital give me a fair price?',
    a: 'Yes. Our offers are based on current market data and comparable sales. We are transparent about our numbers and never pressure you to accept.',
  },
  {
    q: 'Do I need to repair or clean out the house?',
    a: 'Not at all. We buy homes in any condition — fire damage, mold, hoarder homes, outdated systems. Leave what you don\'t want behind.',
  },
  {
    q: 'Are there any fees or commissions?',
    a: 'Zero. No agent commissions, no closing costs, no hidden fees. What we offer is what you receive.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

const whoWeHelp = [
  { title: 'Pre-Foreclosure', desc: 'Stop foreclosure before it damages your credit.' },
  { title: 'Probate / Inherited', desc: 'No repairs or clean-out needed — we handle it.' },
  { title: 'Divorce', desc: 'Sell fast, split proceeds, and move forward.' },
  { title: 'Tired Landlords', desc: 'Done with tenants? We buy rentals as-is.' },
  { title: 'Behind on Payments', desc: 'We can close fast — even when banks can\'t help.' },
  { title: 'Relocating', desc: 'Moving for work? We close on your schedule.' },
];

export default function GoogleLP() {
  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-brand-dark border-b border-white/10 h-14 flex items-center px-4 sm:px-6">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
          <Image
            src="/images/logo/logo-01.png"
            alt="Salem Silver Capital"
            width={130}
            height={28}
            className="h-6 w-auto brightness-0 invert"
            priority
          />
          <a href="tel:+16177142020" className="text-brand-gold font-semibold text-sm">
            (617) 714-2020
          </a>
        </div>
      </header>

      {/* Hero — H1 must contain "sell your house fast for cash" */}
      <section className="bg-brand-dark px-4 sm:px-6 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-5">
              Sell Your House Fast for Cash in Massachusetts
            </h1>
            <p className="text-brand-silver-light text-lg mb-6 leading-relaxed">
              Salem Silver Capital buys homes in any condition. Get a fair all-cash
              offer in 24 hours — no repairs, no agent fees, no commissions. You
              choose the closing date.
            </p>
            <ul className="space-y-2.5 mb-8">
              {[
                'Licensed & trusted home buyers in MA',
                'Cash in hand — no bank financing delays',
                'Serving Boston, Worcester, Springfield & all of MA',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-brand-silver-light text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#google-form"
              className="inline-block bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors"
            >
              Get My Free Cash Offer
            </a>
          </div>

          {/* Form — right column on desktop */}
          <div
            id="google-form"
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h2 className="font-serif text-xl text-white mb-1">
              Get Your Free Cash Offer
            </h2>
            <p className="text-brand-silver-light text-sm mb-5">
              A specialist will contact you within 24 hours.
            </p>
            <LeadFormLP source="google-lp" />
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-blue text-center mb-10">
            We Help Massachusetts Homeowners In Any Situation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whoWeHelp.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-brand-blue mb-1.5">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 sm:px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-blue text-center mb-10">
            How Our Cash Home Buying Process Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Submit Your Info', d: 'Fill out our short form — takes 60 seconds. No obligation.' },
              { n: '2', t: 'Receive a Fair Offer', d: 'We send you a real cash number within 24 hours, based on market data.' },
              { n: '3', t: 'Close & Get Paid', d: 'Pick your closing date. Sign the papers. Receive your wire transfer.' },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-b-4 border-b-brand-gold">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white font-bold text-xl flex items-center justify-center mb-4">
                  {step.n}
                </div>
                <h3 className="font-bold text-brand-blue mb-2">{step.t}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — SEO-optimized, server-rendered via <details> */}
      <section className="bg-white px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-blue text-center mb-10">
            Frequently Asked Questions About Selling Your House for Cash in Massachusetts
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-gray-50 rounded-xl border border-gray-100 group overflow-hidden"
              >
                <summary className="px-6 py-4 font-semibold text-brand-blue cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="ml-4 flex-shrink-0 text-xl leading-none text-brand-blue">+</span>
                </summary>
                <p className="px-6 pb-5 pt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Mini footer */}
      <footer className="bg-brand-dark py-5 text-center px-4">
        <p className="text-brand-silver text-xs">
          © 2026 Salem Silver Capital · (617) 714-2020 · salemsilver.com ·{' '}
          We are professional home buyers, not real estate agents.
        </p>
      </footer>
    </>
  );
}
