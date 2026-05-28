const checks = [
  '500+ Homes Purchased',
  'Local Massachusetts Team',
  'Direct Decision-Maker — No Middlemen',
  'Every offer reviewed personally',
];

export default function SocialProof() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — photo placeholders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400 p-4">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Add closing photo</p>
              </div>
            </div>
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200 mt-6">
              <div className="text-center text-gray-400 p-4">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Add closing photo</p>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Real People.{' '}
              <span className="text-brand-gold">Real Closings.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Hi, I&apos;m Jefri Liriano, Broker and founder of Salem Silver Capital.
              We&apos;re not a faceless corporation — we&apos;re a local Massachusetts
              team that has worked with hundreds of homeowners. When you work with us,
              you work directly with me and my team — no call centers, no runaround.
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
