'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const goToCashOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.location.href = '/cash-offer';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-blue/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/logo-01.png"
              alt="Salem Silver Capital"
              width={280}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+16177142020"
              className="flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (617) 714-2020
            </a>
            <a
              href="/cash-offer"
              onClick={goToCashOffer}
              className="bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              Get Cash Offer
            </a>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <a href="tel:+16177142020" className="text-brand-blue font-semibold text-sm">
              (617) 714-2020
            </a>
            <button
              className="p-2 text-brand-blue"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-brand-blue/10 px-4 py-4">
          <a href="/cash-offer" onClick={goToCashOffer}
            className="block bg-brand-gold text-white font-semibold text-center py-3 rounded-full mb-2">
            Get My Free Cash Offer
          </a>
        </div>
      )}
    </header>
  );
}
