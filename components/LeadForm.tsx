'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LeadFormProps {
  initialAddress?: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  condition: string;
  timeline: string;
}

export default function LeadForm({ initialAddress = '' }: LeadFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', address: initialAddress, condition: '', timeline: '',
  });

  useEffect(() => {
    if (initialAddress) {
      setForm((prev) => ({ ...prev, address: initialAddress }));
    }
  }, [initialAddress]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = (): string => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (form.phone.replace(/\D/g, '').length < 10)
      return 'Please enter a valid 10-digit phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Please enter a valid email address.';
    if (!form.address.trim()) return 'Please enter the property address.';
    if (!form.condition) return 'Please select the property condition.';
    if (!form.timeline) return 'Please select your timeline.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'website' }),
      });

      if (!res.ok) throw new Error('failed');

      setSuccess(true);
      const encoded = encodeURIComponent(form.address);
      setTimeout(() => router.push(`/thank-you?address=${encoded}`), 1500);
    } catch {
      setError('Something went wrong. Please call us at (617) 714-2020.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-brand-silver-light rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm';
  const labelClass = 'block text-white font-medium text-sm mb-1.5';

  return (
    <section id="lead-form" className="bg-brand-dark py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Get Your Free Cash Offer Today
          </h2>
          <p className="text-brand-silver-light text-lg">
            Fill out the short form below — takes less than 60 seconds. We&apos;ll
            contact you within 24 hours.
          </p>
        </div>

        {success ? (
          <div className="text-center py-10" role="status" aria-live="polite">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-white text-xl font-semibold">
              Thank you! We&apos;ll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(555) 555-5555"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>
                Property Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                placeholder="123 Main St, Boston, MA"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="condition" className={labelClass}>
                  Property Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select condition...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Work">Needs Work</option>
                  <option value="Major Repairs Needed">Major Repairs Needed</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className={labelClass}>
                  Timeline to Sell *
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select timeline...</option>
                  <option value="As Soon As Possible">As Soon As Possible</option>
                  <option value="1-3 Months">1–3 Months</option>
                  <option value="3-6 Months">3–6 Months</option>
                  <option value="Just Exploring">Just Exploring My Options</option>
                </select>
              </div>
            </div>

            <div
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className={error ? '' : 'sr-only'}
            >
              {error && (
                <div className="bg-red-500/10 border border-red-400 rounded-lg px-4 py-3 text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-70 text-white font-bold text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                'Get My Free Cash Offer →'
              )}
            </button>

            <p className="text-brand-silver text-xs text-center">
              No obligation. No spam. We respect your privacy.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
