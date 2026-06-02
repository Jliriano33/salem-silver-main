'use client';

import { useState } from 'react';

interface HeroProps {
  onAddressSubmit: (address: string) => void;
}

export default function Hero({ onAddressSubmit }: HeroProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) onAddressSubmit(address.trim());
    else window.location.href = '/cash-offer';
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 bg-gradient-to-br from-white via-white to-brand-blue/5">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-brand-blue/5 border border-brand-blue/20 rounded-full px-4 py-2 mb-8">
          <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
            <path d="M9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <span className="text-brand-blue text-sm font-semibold">500+ Homes Purchased · Licensed &amp; Trusted in MA, NH &amp; RI</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
          Get a Cash Offer Today
        </h1>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-gold leading-tight mb-6">
          Fast, Fair, As-Is
        </p>

        {/* Subheadline */}
        <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Receive a no-obligation cash offer for your Massachusetts home.
          Close in as little as 7 days — no repairs, no agents, no fees.
        </p>

        {/* Address form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your property address..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-lg"
                aria-label="Property address"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Get My Cash Offer
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="text-white/50 text-xs mt-2 text-left pl-1">
            🔒 100% private and secure
          </p>
        </form>

        {/* Social proof badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-4 py-2">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-gray-900 text-sm font-semibold">5.0</span>
            <span className="text-gray-500 text-xs">Google</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-4 py-2">
            <span className="text-brand-gold text-sm font-bold">A+</span>
            <span className="text-gray-500 text-xs">BBB Rated</span>
          </div>
        </div>

        {/* Trust bullets — 2 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          {[
            'Fair, competitive cash offer — no lowballing',
            'Close in as little as 7 days',
            'No repairs, no cleaning, no staging',
            'We cover all closing costs',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-left">
              <span className="w-5 h-5 rounded-full bg-brand-gold/20 border border-brand-gold flex-shrink-0 flex items-center justify-center">
                <svg className="w-3 h-3 text-brand-gold" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
