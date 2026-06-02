const rows = [
  { label: 'Closing Time', us: 'As Little As 7 Days', them: '60–90+ Days' },
  { label: 'Repairs Required', us: 'None', them: 'Often Required' },
  { label: 'Agent Commission', us: '$0', them: '5–6% of Sale Price' },
  { label: 'Closing Costs', us: '$0', them: '2–3% of Sale Price' },
  { label: 'Financing Contingency', us: 'No', them: 'Yes — Can Fall Through' },
  { label: 'Certainty of Sale', us: '100% Guaranteed', them: 'Not Guaranteed' },
];

export default function Comparison() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">The Difference</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Us vs. Traditional Listing
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 bg-brand-blue">
            <div className="px-5 py-4 text-sm font-semibold text-white/50 uppercase tracking-wide" />
            <div className="px-5 py-4 text-center">
              <span className="text-brand-gold font-bold text-sm sm:text-base">Salem Silver Capital</span>
            </div>
            <div className="px-5 py-4 text-center">
              <span className="text-white/75 text-sm sm:text-base">Traditional Agent</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="px-5 py-4 text-sm font-medium text-gray-600">{row.label}</div>
              <div className="px-5 py-4 text-center font-bold text-brand-gold text-sm sm:text-base">{row.us}</div>
              <div className="px-5 py-4 text-center text-gray-400 text-sm">{row.them}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
