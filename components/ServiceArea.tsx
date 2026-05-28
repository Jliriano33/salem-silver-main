const cities = [
  'Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford',
  'Brockton', 'Quincy', 'Lynn', 'Fall River', 'Newton', 'Somerville',
  'Lawrence', 'Framingham', 'Haverhill', 'Waltham', 'Malden', 'Taunton',
];

export default function ServiceArea() {
  return (
    <section className="bg-gray-50 py-16 lg:py-20 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          We Buy Houses Across All of Massachusetts
        </h2>
        <p className="text-gray-500 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          We serve homeowners in all 351 cities and towns across all 14 counties in Massachusetts —
          from Boston to the Berkshires, Cape Cod to the Pioneer Valley.
          No matter where your property is located, we can make you a fair cash offer.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {cities.map((city) => (
            <span
              key={city}
              className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-1.5 rounded-full"
            >
              {city}
            </span>
          ))}
          <span className="bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm px-4 py-1.5 rounded-full font-medium">
            + 333 more cities
          </span>
        </div>
      </div>
    </section>
  );
}
