const testimonials = [
  {
    initials: 'M', bg: 'bg-brand-blue',
    quote: "I really could not thank Salem Silver enough. I had it in my head that selling would be so stressful and honestly it's been a dream. We are truly grateful.",
    name: 'Maria S.', location: 'Lynn, MA', tag: 'Inherited Home',
  },
  {
    initials: 'R', bg: 'bg-brand-gold',
    quote: "They called back within an hour, gave us a cash offer the next day, and we closed before the foreclosure date. They saved my credit and my sanity.",
    name: 'Robert & Lisa T.', location: 'Boston, MA', tag: 'Facing Foreclosure',
  },
  {
    initials: 'J', bg: 'bg-green-700',
    quote: "After 15 years as a landlord I was done. The property needed $40k in repairs. Got a fair cash offer, no repairs needed, closed in 2 weeks.",
    name: 'James K.', location: 'Worcester, MA', tag: 'Tired Landlord',
  },
  {
    initials: 'S', bg: 'bg-purple-700',
    quote: "We were 3 months behind on our mortgage and terrified. Salem Silver got us an offer within hours and we were out of our situation within two weeks.",
    name: 'Sandra M.', location: 'Springfield, MA', tag: 'Behind on Payments',
  },
  {
    initials: 'C', bg: 'bg-rose-700',
    quote: "After losing my job I had to sell fast. Traditional listing would have taken months. These guys had an offer the same day — we closed before I started my new job.",
    name: 'Carlos D.', location: 'Lowell, MA', tag: 'Job Relocation',
  },
  {
    initials: 'A', bg: 'bg-teal-700',
    quote: "The house was a hoarder situation — I was embarrassed to show anyone. Salem Silver didn't judge, gave a fair offer, and handled everything. Couldn't ask for more.",
    name: 'Angela P.', location: 'Brockton, MA', tag: 'Probate',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-yellow-400 mb-3" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">Real Stories</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Homeowners Love Working With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <Stars />
              <blockquote className="text-gray-600 italic text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.location} · {t.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
