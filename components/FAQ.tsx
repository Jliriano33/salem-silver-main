'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Will you buy my house in any condition?',
    a: 'Yes — absolutely any condition. Fire damage, water damage, mold, hoarder situations, major structural issues, outdated systems, code violations. We have purchased homes in every imaginable condition across Massachusetts, New Hampshire, and Rhode Island. You don\'t need to clean, repair, or stage anything.',
  },
  {
    q: 'How fast can you close?',
    a: 'We can close in as little as 7 days when needed. We also work on your timeline — if you need 30, 60, or 90 days to make arrangements, that\'s perfectly fine. You set the date, we make it happen.',
  },
  {
    q: 'Are there any fees or commissions?',
    a: 'None. Zero agent commissions, zero closing costs, zero hidden fees. Our offer is the amount you walk away with at closing. We even cover the title and escrow fees on our end.',
  },
  {
    q: 'How do you determine your cash offer?',
    a: 'We evaluate the property\'s current condition, recent comparable sales in your area, and the local market across Massachusetts, New Hampshire, and Rhode Island. Our offers are based on real data — we don\'t lowball to fish for desperate sellers. We aim to make a fair offer that works for both parties.',
  },
  {
    q: 'What situations do you help with?',
    a: 'We work with homeowners facing foreclosure, probate, divorce, inherited properties, tax liens, bankruptcy, code violations, problem tenants, job relocation, behind on payments, and more. If you\'re in a tough spot with a property, we can likely help.',
  },
  {
    q: 'Is there any obligation after I submit my information?',
    a: 'None whatsoever. Requesting a cash offer is 100% free and carries zero obligation. Review our offer at your own pace, ask as many questions as you want, and walk away at any time. No pressure, no hard sell — ever.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">Got Questions?</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.q}</span>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center transition-transform ${open === i ? 'rotate-180 border-brand-gold bg-brand-gold/10' : ''}`}>
                  <svg className={`w-3.5 h-3.5 ${open === i ? 'text-brand-blue' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <a
            href="tel:+16177142020"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Us: (617) 714-2020
          </a>
        </div>
      </div>
    </section>
  );
}
