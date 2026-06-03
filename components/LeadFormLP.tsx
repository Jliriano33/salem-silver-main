'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import AddressAutocomplete from '@/components/AddressAutocomplete';

interface LeadFormLPProps {
  source: 'facebook-lp' | 'google-lp';
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  condition: string;
  timeline: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  address: '',
  condition: '',
  timeline: '',
};

export default function LeadFormLP({ source }: LeadFormLPProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
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
        body: JSON.stringify({ ...form, source }),
      });

      if (!res.ok) throw new Error('failed');

      setSuccess(true);
      const encoded = encodeURIComponent(form.address);
      setTimeout(() => router.push(`/thank-you?address=${encoded}`), 1500);
    } catch {
      setError('Something went wrong. Please call us at +1 617-714-2020.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = clsx(
    'w-full bg-white border border-brand-silver-light rounded-lg px-4 py-3',
    'text-gray-800 placeholder-gray-400 text-sm',
    'focus:outline-none focus:ring-2 focus:ring-brand-blue'
  );
  const labelClass = 'block text-white font-medium text-sm mb-1.5';

  if (success) {
    return (
      <div className="text-center py-6" role="status" aria-live="polite">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white font-semibold">
          Thank you! We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label htmlFor={`lp-name-${source}`} className={labelClass}>
          Full Name *
        </label>
        <input
          id={`lp-name-${source}`}
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
        <label htmlFor={`lp-phone-${source}`} className={labelClass}>
          Phone Number *
        </label>
        <input
          id={`lp-phone-${source}`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`lp-email-${source}`} className={labelClass}>
          Email Address *
        </label>
        <input
          id={`lp-email-${source}`}
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
        <label htmlFor={`lp-address-${source}`} className={labelClass}>
          Property Address *
        </label>
        <AddressAutocomplete
          id={`lp-address-${source}`}
          name="address"
          value={form.address}
          onChange={(val) => { setForm((prev) => ({ ...prev, address: val })); setError(''); }}
          placeholder="123 Main St, Boston, MA"
          inputClassName={inputClass}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`lp-condition-${source}`} className={labelClass}>
            Condition *
          </label>
          <select
            id={`lp-condition-${source}`}
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select...</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Needs Work">Needs Work</option>
            <option value="Major Repairs Needed">Major Repairs</option>
          </select>
        </div>
        <div>
          <label htmlFor={`lp-timeline-${source}`} className={labelClass}>
            Timeline *
          </label>
          <select
            id={`lp-timeline-${source}`}
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select...</option>
            <option value="As Soon As Possible">ASAP</option>
            <option value="1-3 Months">1–3 Months</option>
            <option value="3-6 Months">3–6 Months</option>
            <option value="Just Exploring">Just Exploring</option>
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
        className="w-full bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-70 text-white font-bold text-base py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
  );
}
