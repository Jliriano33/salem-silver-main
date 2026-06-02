const steps = [
  {
    n: '01',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Tell Us About Your Property',
    desc: "Fill out our simple form or give us a call. We'll ask a few quick questions about your home and your situation — no obligation, no pressure.",
  },
  {
    n: '02',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Receive Your Cash Offer',
    desc: "We'll evaluate your property and present you with a fair, no-obligation cash offer within 24 hours. No pressure, no games — just a real number.",
  },
  {
    n: '03',
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Close &amp; Get Paid',
    desc: 'Choose your closing date. We handle all the paperwork. You walk away with cash — as fast as 7 days.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label + heading */}
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">Simple Process</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Three steps to get cash in your hands and move on with your life.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-brand-gold/30" aria-hidden="true" />

          {steps.map((step) => (
            <div key={step.n} className="flex flex-col items-center text-center">
              {/* Icon card with number badge */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-gold text-white text-xs font-bold flex items-center justify-center">
                  {step.n}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3"
                dangerouslySetInnerHTML={{ __html: step.title }}
              />
              <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#lead-form"
            onClick={(e) => { e.preventDefault(); document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-base px-8 py-4 rounded-full transition-colors shadow-md"
          >
            Get Your Cash Offer Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
