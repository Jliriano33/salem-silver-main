import Image from 'next/image';

const checks = [
  '500+ Homes Purchased',
  'Local MA, NH & RI Team',
  'Direct Decision-Maker — No Middlemen',
  'Every offer reviewed personally',
];

export default function SocialProof() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — closing photos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/images/closing-photo-1.png"
                alt="Closing photo"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md mt-6">
              <Image
                src="/images/closing-photo-2.png"
                alt="Closing photo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Real People.{' '}
              <span className="text-brand-gold">Real Closings.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We&apos;re not a faceless corporation — we&apos;re a local team of professional home buyers
              serving Massachusetts, New Hampshire, and Rhode Island. We&apos;ve worked with hundreds of homeowners
              and when you reach out, you work directly with our team — no call centers, no runaround.
            </p>
            <ul className="space-y-3">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/15 border border-brand-gold flex-shrink-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-brand-gold" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-gray-700 font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
