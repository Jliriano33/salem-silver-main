import Image from 'next/image';
import Link from 'next/link';

const cities = [
  'Boston, MA', 'Worcester, MA', 'Springfield, MA', 'Lowell, MA',
  'Manchester, NH', 'Nashua, NH', 'Concord, NH', 'Portsmouth, NH',
  'Providence, RI', 'Warwick, RI', 'Cranston, RI', 'Pawtucket, RI',
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
  { href: '/cash-offer', label: 'Get Cash Offer' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo/logo-02.png"
                alt="Salem Silver Capital"
                width={180}
                height={80}
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-brand-silver-light text-sm leading-relaxed mb-4">
              We Buy Homes for Cash — Fast, Fair, As-Is
            </p>
            <a
              href="tel:+16177142020"
              className="text-brand-gold font-semibold hover:underline text-lg"
            >
              (617) 714-2020
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-brand-silver-light hover:text-brand-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serving MA, NH & RI</h3>
            <ul className="grid grid-cols-2 gap-1.5">
              {cities.map((city) => (
                <li key={city} className="text-brand-silver-light text-sm">
                  {city}
                </li>
              ))}
            </ul>
            <p className="text-brand-silver text-xs mt-3 italic">and surrounding areas</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-brand-silver text-xs text-center">
            © 2026 Salem Silver Capital. All rights reserved.{' '}
            <span className="text-white/40">|</span> We are not real estate agents.
            We are professional home buyers.
          </p>
        </div>
      </div>
    </footer>
  );
}
