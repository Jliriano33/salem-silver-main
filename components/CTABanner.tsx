interface CTABannerProps {
  onCTAClick: () => void;
}

export default function CTABanner({ onCTAClick }: CTABannerProps) {
  return (
    <section
      className="py-24 lg:py-32 flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-brand-blue/80" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Ready to Get Your{' '}
          <span className="text-brand-gold">Cash Offer?</span>
        </h2>
        <p className="text-white/80 text-lg mb-10">
          It takes 60 seconds. No obligation. No pressure. Just a fair cash offer for your home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={onCTAClick}
            className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-base px-8 py-4 rounded-full transition-colors shadow-lg"
          >
            Get My Cash Offer
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <a
            href="tel:+16177142020"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-base px-8 py-4 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call (617) 714-2020
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {['Free, No-Obligation Offer', 'Close in 7 Days', 'No Repairs Needed', 'We Cover All Costs'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
