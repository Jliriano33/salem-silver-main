interface SituationsProps {
  onCTAClick: () => void;
}

const situations = [
  'Facing Foreclosure', 'Inherited Property', 'Behind on Payments', 'Going Through Divorce',
  'Relocating for Work', 'Tired Landlord', 'Major Repairs Needed', 'Vacant Property',
  'Probate', 'Tax Liens', 'Bankruptcy', 'Code Violations',
];

export default function Situations({ onCTAClick }: SituationsProps) {
  return (
    <section className="bg-brand-dark py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-4">We Understand</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          We Help Homeowners<br className="hidden sm:block" /> in Every Situation
        </h2>
        <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
          Life doesn&apos;t always go as planned. Whatever you&apos;re facing, we&apos;re here to help.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
          {situations.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-brand-gold/40 hover:bg-white/10 transition-colors cursor-default"
            >
              <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/80 text-sm font-medium text-left">{s}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onCTAClick}
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-base px-8 py-4 rounded-full transition-colors shadow-lg"
        >
          Get My Free Cash Offer
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
