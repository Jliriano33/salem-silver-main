'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
  INQUIRY_ROUTE,
  MESSAGE_MAX,
  validateInquiry,
  type BuyerType,
  type InquiryErrorCode,
  type InquiryPayload,
  type InquiryResponse,
} from '@/lib/deals/inquiry';
import type { Locale } from '@/lib/deals/types';
import type { DealUiStrings } from '@/lib/deals/ui-strings';

type Props = { slug: string; locale: Locale; ui: DealUiStrings };

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  buyerType: BuyerType | '';
  pofReady: 'yes' | 'no' | '';
  message: string;
  consent: boolean;
  company: string;
};

const EMPTY: Fields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  buyerType: '',
  pofReady: '',
  message: '',
  consent: false,
  company: '',
};

// Which input each error code belongs to, for aria-invalid and the inline message.
const FIELD_OF: Partial<Record<InquiryErrorCode, keyof Fields>> = {
  first_name: 'firstName',
  last_name: 'lastName',
  email: 'email',
  phone: 'phone',
  buyer_type: 'buyerType',
  pof: 'pofReady',
  consent: 'consent',
  message_too_long: 'message',
};

const inputCls =
  'mt-1 block w-full rounded-lg border border-brand-silver-light bg-white px-3 py-2.5 text-base text-brand-dark ' +
  'focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/40 aria-[invalid=true]:border-red-700';

export default function InvestorForm({ slug, locale, ui }: Props) {
  const f = ui.form;
  const t = (s: { en: string; es: string }) => s[locale];
  const [v, setV] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<InquiryErrorCode[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Fields>(k: K, val: Fields[K]) => setV((p) => ({ ...p, [k]: val }));
  const errFor = (k: keyof Fields) => errors.find((e) => FIELD_OF[e] === k);
  const errId = (k: keyof Fields) => `inv-${k}-err`;

  const showErrors = (codes: InquiryErrorCode[]) => {
    setErrors(codes);
    // Move focus to the summary so screen readers hear what to fix.
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const payload: InquiryPayload = {
      slug,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      buyerType: v.buyerType as BuyerType,
      pofReady: v.pofReady as 'yes' | 'no',
      message: v.message,
      language: locale,
      consent: v.consent,
      consentVersion: f.consentVersion,
      company: v.company,
    };
    const local = validateInquiry(payload);
    if (local.length > 0) return showErrors(local);

    setStatus('sending');
    setErrors([]);
    try {
      const res = await fetch(INQUIRY_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as InquiryResponse | null;
      if (res.ok && data?.ok) {
        setStatus('done');
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      setStatus('idle');
      showErrors(data && !data.ok && data.errors.length ? data.errors : ['delivery_failed']);
    } catch {
      setStatus('idle');
      showErrors(['delivery_failed']);
    }
  }

  if (status === 'done') {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-brand-silver-light bg-slate-50 p-6 focus:outline-none"
        data-testid="inquiry-thanks"
      >
        <h3 className="text-xl font-semibold text-brand-dark">{t(f.thanksHeading)}</h3>
        <p className="mt-2 text-slate-700">{t(f.thanksBody)}</p>
      </div>
    );
  }

  const fieldError = (k: keyof Fields) => {
    const code = errFor(k);
    return code ? (
      <p id={errId(k)} className="mt-1 text-sm font-medium text-red-700">
        {t(f.errors[code])}
      </p>
    ) : null;
  };
  const aria = (k: keyof Fields) =>
    errFor(k) ? { 'aria-invalid': true as const, 'aria-describedby': errId(k) } : {};
  const label = 'block text-sm font-medium text-brand-dark';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" data-testid="investor-form">
      {errors.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-700 bg-red-50 p-4 text-sm text-red-800 focus:outline-none"
          data-testid="inquiry-errors"
        >
          <p className="font-semibold">{t(f.errorSummary)}</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((code) => (
              <li key={code}>{t(f.errors[code])}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inv-firstName" className={label}>{t(f.firstName)}</label>
          <input id="inv-firstName" name="firstName" autoComplete="given-name" className={inputCls}
            value={v.firstName} onChange={(e) => set('firstName', e.target.value)} {...aria('firstName')} />
          {fieldError('firstName')}
        </div>
        <div>
          <label htmlFor="inv-lastName" className={label}>{t(f.lastName)}</label>
          <input id="inv-lastName" name="lastName" autoComplete="family-name" className={inputCls}
            value={v.lastName} onChange={(e) => set('lastName', e.target.value)} {...aria('lastName')} />
          {fieldError('lastName')}
        </div>
        <div>
          <label htmlFor="inv-email" className={label}>{t(f.email)}</label>
          <input id="inv-email" name="email" type="email" autoComplete="email" inputMode="email" className={inputCls}
            value={v.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="inv-phone" className={label}>{t(f.phone)}</label>
          <input id="inv-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputCls}
            value={v.phone} onChange={(e) => set('phone', e.target.value)} {...aria('phone')} />
          {fieldError('phone')}
        </div>
      </div>

      <fieldset {...aria('buyerType')}>
        <legend className={label}>{t(f.buyerType)}</legend>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {(['cash', 'hard_money', 'other'] as const).map((b) => (
            <label key={b} className="flex items-center gap-2 text-base text-brand-dark">
              <input type="radio" name="buyerType" value={b} checked={v.buyerType === b}
                onChange={() => set('buyerType', b)} className="h-4 w-4 accent-brand-blue" />
              {t(f.buyerTypes[b])}
            </label>
          ))}
        </div>
        {fieldError('buyerType')}
      </fieldset>

      <fieldset {...aria('pofReady')}>
        <legend className={label}>{t(f.pofReady)}</legend>
        <div className="mt-2 flex gap-6">
          {(['yes', 'no'] as const).map((o) => (
            <label key={o} className="flex items-center gap-2 text-base text-brand-dark">
              <input type="radio" name="pofReady" value={o} checked={v.pofReady === o}
                onChange={() => set('pofReady', o)} className="h-4 w-4 accent-brand-blue" />
              {t(o === 'yes' ? f.yes : f.no)}
            </label>
          ))}
        </div>
        {fieldError('pofReady')}
      </fieldset>

      <div>
        <label htmlFor="inv-message" className={label}>
          {t(f.message)} <span className="font-normal text-slate-600">({t(f.optional)})</span>
        </label>
        <textarea id="inv-message" name="message" rows={4} maxLength={MESSAGE_MAX} className={inputCls}
          value={v.message} onChange={(e) => set('message', e.target.value)} {...aria('message')} />
        {fieldError('message')}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
          <input type="checkbox" name="consent" checked={v.consent}
            onChange={(e) => set('consent', e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-blue" {...aria('consent')} />
          <span>{t(f.consent)}</span>
        </label>
        {fieldError('consent')}
      </div>

      {/* Spam trap. Last field, meaningless label, hidden from people and autofill. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="ss-hp-field">Leave this blank</label>
        <input id="ss-hp-field" name="ss_hp" tabIndex={-1} autoComplete="off" data-1p-ignore
          data-lpignore="true" data-form-type="other" value={v.company}
          onChange={(e) => set('company', e.target.value)} />
      </div>

      <button type="submit" disabled={status === 'sending'}
        className="w-full rounded-lg bg-brand-navy px-6 py-3.5 text-base font-semibold text-white hover:bg-brand-blue-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto">
        {status === 'sending' ? t(f.sending) : t(f.submit)}
      </button>
    </form>
  );
}
