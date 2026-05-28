const stats = [
  { number: '500+', label: 'Homes Purchased' },
  { number: '7 Days', label: 'Days to Close' },
  { number: '$0', label: 'Fees or Commissions' },
  { number: '10+', label: 'Years Experience' },
];

export default function Stats() {
  return (
    <section className="bg-brand-dark border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.number}</div>
              <div className="text-brand-gold text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
