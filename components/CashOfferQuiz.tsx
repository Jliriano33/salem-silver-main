'use client';

import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/meta-pixel';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ── Value maps ────────────────────────────────────────────────────────────────
const CONDITION_API: Record<string, string> = {
  needs_nothing: 'Excellent',
  needs_little_work: 'Good',
  needs_significant_work: 'Needs Work',
  tear_down: 'Major Repairs Needed',
};

const TIMELINE_API: Record<string, string> = {
  asap: 'As Soon As Possible',
  '0_3_months': '1-3 Months',
  '4_6_months': '3-6 Months',
  '7_12_months': '3-6 Months',
  '12_plus_months': 'Just Exploring',
};

const VALUE_API: Record<string, string> = {
  under_300k:   '$300K or less',
  '300k_600k':  '$300K - $600K',
  '600k_900k':  '$600K - $900K',
  '900k_1_2m':  '$900K - $1.2M',
  over_1_2m:    '$1.2M or more',
};

const REASON_API: Record<string, string> = {
  buying_another:      'Looking to buy a home',
  investment_property: 'This is an investment property',
  second_home:         'This is a second home',
  inheritance:         'This is an inheritance',
  other:               'Other',
};

const FEATURES = [
  { val: 'prefabricated_home',  label: 'Prefabricated home' },
  { val: 'age_restricted',      label: 'Age restricted community' },
  { val: 'unpermitted_addition',label: 'Unpermitted addition' },
  { val: 'gated_community',     label: 'Gated community' },
  { val: 'foundation_issues',   label: 'Significant foundation issues' },
  { val: 'flood_zone',          label: 'Located in flood zone' },
  { val: 'pool',                label: 'Pool' },
  { val: 'solar_panels',        label: 'Solar panels' },
];

// A unit only exists where the building holds more than one property. We can't
// know that from the street address alone, so we go by what the seller typed:
// an apartment, unit, suite or floor marker means there is a unit to confirm.
const UNIT_MARKER = /(?:^|[\s,])(?:#\s*[\w-]+|(?:apartment|apt|unit|suite|ste|floor|fl|room|rm|building|bldg)\.?\s*[\w-]+)\s*(?:,|$)/i;

function detectUnit(address: string): string {
  const m = address.match(UNIT_MARKER);
  if (!m) return '';
  return m[0].replace(/^[\s,]+|[\s,]+$/g, '')
             .replace(/^(?:#|apartment|apt\.?|unit|suite|ste\.?|floor|fl\.?|room|rm\.?|building|bldg\.?)\s*/i, '')
             .trim();
}

const SIDEBAR: Record<number, { h: string; b: string }> = {
  1:  { h: 'Confirm your property',         b: 'We pull current market data and comparable sales in your area to build your offer.' },
  2:  { h: 'Unit or apartment number',      b: 'In a building with more than one property, the unit is what tells us which home we are pricing.' },
  3:  { h: 'Your price expectation',        b: 'Knowing your range up front keeps the conversation honest and saves you time.' },
  4:  { h: 'We buy in any condition',       b: 'From move-in ready to full rehabs — we have cash buyers for every property type.' },
  5:  { h: 'Your timeline, your rules',     b: 'Close in 7 days or take up to 6 months. We work around your schedule, not ours.' },
  6:  { h: 'Your reason matters',           b: 'Buying, investing, or inheriting — each situation gets a different game plan.' },
  7:  { h: 'Every detail counts',           b: 'Accurate home specs mean a more precise offer. You can always adjust before we finalize.' },
  8:  { h: 'We handle every situation',     b: 'Owner-occupied, tenant, or vacant — we have buyers ready for all scenarios.' },
  9:  { h: 'The details other buyers miss', b: 'Pools, solar, flood zones — telling us now avoids surprises later in the process.' },
  10: { h: 'Almost there!',                 b: "Your offer is almost ready. We'll send it the moment a specialist reviews your details." },
  11: { h: 'Last step',                     b: 'A Salem Silver specialist will reach out within 24 hours with your personalized cash offer.' },
};

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 'done';

interface Lead {
  address: string;
  unitNumber: string;
  homeValue: string;
  sellingReason: string;
  features: string[];
  condition: string;
  timeline: string;
  bedrooms: string;
  bathrooms: string;
  lotSize: string;
  finishedSqft: string;
  garageSize: string;
  occupancy: string;
  fullName: string;
  email: string;
  phone: string;
  interestedInAgent: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

// ── Shared input classes ───────────────────────────────────────────────────────
const INPUT = 'w-full border-2 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-blue text-base transition-colors';
const SELECT = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-gray-900 text-sm focus:outline-none focus:border-brand-blue appearance-none bg-white';
const CHOICE = (active: boolean) =>
  `w-full flex items-center gap-3 px-5 py-4 border-2 rounded-xl font-medium text-left transition-all ${
    active
      ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
      : 'border-gray-200 text-gray-700 hover:border-brand-blue hover:bg-brand-blue/5'
  }`;
const BTN_PRIMARY = 'w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-4 rounded-xl transition-colors mt-6';
const BTN_BACK    = 'mt-3 text-sm text-gray-400 hover:text-brand-blue transition-colors block';
const EYEBROW     = 'text-xs font-bold text-brand-gold uppercase tracking-wide mb-3';
const HEADLINE    = 'text-2xl lg:text-3xl font-bold text-gray-900 mb-2';
const SUBHEAD     = 'text-gray-500 mb-6';

export default function CashOfferQuiz() {
  const searchParams = useSearchParams();

  const [step, setStep]             = useState<Step>(1);
  const [showAddrEdit, setShowAddrEdit] = useState(false);
  const [editedAddr, setEditedAddr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState<Partial<Record<string, string>>>({});

  const [lead, setLead] = useState<Lead>({
    address:         searchParams.get('address') || '',
    unitNumber:      '',
    homeValue:       '',
    sellingReason:   '',
    features:        [],
    condition:       '',
    timeline:        '',
    bedrooms:        '3',
    bathrooms:       '2',
    lotSize:         '0.5_acres_or_less',
    finishedSqft:    '',
    garageSize:      'none',
    occupancy:       '',
    fullName:        searchParams.get('n') || '',
    email:           searchParams.get('e') || '',
    phone:           searchParams.get('p') || '',
    interestedInAgent: searchParams.get('interested_in_agent') !== 'false',
    utmSource:       searchParams.get('utm_source')   || '',
    utmMedium:       searchParams.get('utm_medium')   || '',
    utmCampaign:     searchParams.get('utm_campaign') || '',
    utmContent:      searchParams.get('utm_content')  || '',
  });

  useEffect(() => {
    if (!lead.address) setShowAddrEdit(true);
    setEditedAddr(lead.address);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field: keyof Lead, value: string | boolean | string[]) =>
    setLead(prev => ({ ...prev, [field]: value }));

  const toggleFeature = (value: string) =>
    setLead(prev => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter(f => f !== value)
        : [...prev.features, value],
    }));

  const go = (n: Step) => {
    setStep(n);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Step 1: address ──────────────────────────────────────────────────────
  // Step 2 only runs for addresses that carry a unit marker; everywhere else
  // there is a single property at the address and the question is noise.
  const askUnit = (address: string) => {
    const unit = detectUnit(address);
    if (!unit) { go(3); return; }
    set('unitNumber', unit);
    go(2);
  };

  const handleAddrYes = () => { set('address', lead.address); askUnit(lead.address); };

  const handleAddrNo = () => {
    setShowAddrEdit(true);
    setEditedAddr(lead.address);
  };

  const handleAddrConfirm = () => {
    if (!editedAddr.trim()) { setErrors({ address: 'Please enter the address.' }); return; }
    const addr = editedAddr.trim();
    set('address', addr);
    askUnit(addr);
  };

  // ── Auto-advance choice picker ───────────────────────────────────────────
  const pick = (field: keyof Lead, value: string, next: Step) => {
    set(field, value);
    setTimeout(() => go(next), 200);
  };

  // ── Step 10: name + email ────────────────────────────────────────────────
  const submitContact = () => {
    const errs: Record<string, string> = {};
    if (!lead.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errs.email = 'Please enter a valid email.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    go(11);
  };

  // ── Step 11: phone + submit ──────────────────────────────────────────────
  const submitPhone = async () => {
    if (!/^[\d\s\-\+\(\)\.]{7,20}$/.test(lead.phone)) {
      setErrors({ phone: 'Please enter a valid phone number.' }); return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      lead.fullName.trim(),
          phone:     lead.phone.replace(/\D/g, ''),
          email:     lead.email.trim().toLowerCase(),
          address:   lead.address,
          unitNumber: lead.unitNumber.trim(),
          condition: CONDITION_API[lead.condition] ?? 'Good',
          timeline:  TIMELINE_API[lead.timeline]  ?? 'Just Exploring',
          homeValue: VALUE_API[lead.homeValue]    ?? '',
          sellingReason: REASON_API[lead.sellingReason] ?? '',
          features:  lead.features.map(f => FEATURES.find(x => x.val === f)?.label ?? f).join(', '),
          bedrooms:  lead.bedrooms,
          bathrooms: lead.bathrooms,
          lotSize:   lead.lotSize,
          finishedSqft: lead.finishedSqft,
          garageSize: lead.garageSize,
          occupancy: lead.occupancy,
          source:    'cash-offer-quiz',
        }),
      });

      if (res.ok) trackLead({ content_category: 'salem_silver_seller', content_name: 'cash-offer-quiz' });
    } catch {
      // Swallow — don't block the user on a network hiccup
    } finally {
      setSubmitting(false);
    }
    go('done');
  };

  // ── Progress bar ─────────────────────────────────────────────────────────
  // The unit step is skipped for single-property addresses, so the count the
  // seller sees shifts with it.
  const showUnitStep = detectUnit(lead.address) !== '';
  const totalSteps = showUnitStep ? 11 : 10;
  const rawStep    = step === 'done' ? 12 : (step as number);
  const stepNum    = showUnitStep || rawStep <= 2 ? rawStep : rawStep - 1;
  const stepLabel  = `Step ${stepNum} of ${totalSteps}`;

  const progressBar = (
    <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-brand-blue">
            {step === 'done' ? 'Complete!' : stepLabel}
          </span>
          <span className="text-xs text-gray-400">Salem Silver · Cash Offer Quiz</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(i => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i < stepNum ? 'bg-brand-blue' : i === stepNum ? 'bg-brand-gold' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── Thank-you screen ─────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50">
        {progressBar}
        <div className="flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-serif text-4xl text-brand-blue mb-4">You&apos;re all set!</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We&apos;ve received your home details and are preparing your cash offer.
              A Salem Silver specialist will be in touch within <strong>24 hours</strong>.
            </p>
            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-5 text-left mb-8">
              <p className="text-xs font-bold text-brand-blue uppercase tracking-wide mb-3">What happens next</p>
              <ul className="space-y-2.5">
                {[
                  'We review your home details and local market data',
                  'A specialist calls you within 24 hours',
                  'We present your no-obligation cash offer',
                  'You decide — zero pressure, zero fees',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-brand-gold/20 border border-brand-gold flex-shrink-0 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-brand-gold" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Need to reach us sooner?{' '}
              <a href="tel:+16177142020" className="text-brand-blue font-semibold hover:underline">(617) 714-2020</a>
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-brand-blue text-sm hover:underline">
              ← Back to Salem Silver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const side = SIDEBAR[rawStep];

  return (
    <div className="min-h-screen bg-gray-50">
      {progressBar}

      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8 items-start">

          {/* ── Left: question panes ── */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">

            {/* STEP 1 — Address */}
            {step === 1 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Is this the correct address?</h1>
                <p className={SUBHEAD}>We&apos;ll use this to pull your home&apos;s market data and prepare your offer.</p>

                {lead.address && !showAddrEdit && (
                  <>
                    <div className="flex items-center gap-3 bg-brand-blue/5 border-2 border-brand-blue rounded-xl px-4 py-3 mb-3">
                      <svg className="w-5 h-5 text-brand-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold text-brand-blue">{lead.address}</span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 mb-6">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(lead.address)}&output=embed&z=17`}
                        className="w-full h-52"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Property location on Google Maps"
                      />
                    </div>
                  </>
                )}

                {showAddrEdit && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Property address
                    </label>
                    <input
                      type="text"
                      value={editedAddr}
                      onChange={e => setEditedAddr(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddrConfirm(); }}
                      placeholder="123 Main St, Salem, MA 01970"
                      autoFocus
                      autoComplete="street-address"
                      className={`${INPUT} ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                )}

                {!showAddrEdit ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleAddrNo}  className={CHOICE(false)}>
                      <span className="text-xl">✏️</span> No, edit it
                    </button>
                    <button onClick={handleAddrYes} className={CHOICE(false)}>
                      <span className="text-xl">✅</span> Yes, that&apos;s correct
                    </button>
                  </div>
                ) : (
                  <button onClick={handleAddrConfirm} className={BTN_PRIMARY} style={{ marginTop: '0' }}>
                    Confirm address →
                  </button>
                )}
              </div>
            )}

            {/* STEP 2 — Unit number */}
            {step === 2 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Unit number</h1>
                <p className={SUBHEAD}>
                  This address appears to have a unit number. Confirm it below so we compare your
                  home to similar units, not to the whole building.
                </p>

                <div className="mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    {lead.address}
                  </label>
                  <input
                    type="text"
                    value={lead.unitNumber}
                    onChange={e => set('unitNumber', e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') go(3); }}
                    placeholder="Enter unit number"
                    className={`${INPUT} border-gray-200`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button onClick={() => { set('unitNumber', ''); go(3); }} className={CHOICE(false)}>
                    <span className="text-xl">⏭️</span> Skip
                  </button>
                  <button onClick={() => go(3)} className={CHOICE(false)}>
                    <span className="text-xl">➡️</span> Continue
                  </button>
                </div>

                <button onClick={() => go(1)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 3 — Home value */}
            {step === 3 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>How much is your home worth?</h1>
                <p className={SUBHEAD}>Your best estimate is fine. This keeps the offer range realistic from the start.</p>
                <div className="space-y-3">
                  {[
                    { val: 'under_300k',  icon: '💵', label: '$300K or less' },
                    { val: '300k_600k',   icon: '💵', label: '$300K - $600K' },
                    { val: '600k_900k',   icon: '💵', label: '$600K - $900K' },
                    { val: '900k_1_2m',   icon: '💵', label: '$900K - $1.2M' },
                    { val: 'over_1_2m',   icon: '💵', label: '$1.2M or more' },
                  ].map(({ val, icon, label }) => (
                    <button key={val} onClick={() => pick('homeValue', val, 4)} className={CHOICE(lead.homeValue === val)}>
                      <span className="text-xl">{icon}</span> {label}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(showUnitStep ? 2 : 1)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 4 — Condition */}
            {step === 4 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>What is the condition of your property?</h1>
                <p className={SUBHEAD}>This helps us calculate the most accurate offer range for your home.</p>
                <div className="space-y-3">
                  {[
                    { val: 'needs_nothing',          icon: '⭐', label: 'Needs nothing — move-in ready' },
                    { val: 'needs_little_work',      icon: '🔧', label: 'Needs a little work' },
                    { val: 'needs_significant_work', icon: '🏗️', label: 'Needs significant work' },
                    { val: 'tear_down',              icon: '🔨', label: 'Tear down' },
                  ].map(({ val, icon, label }) => (
                    <button key={val} onClick={() => pick('condition', val, 5)} className={CHOICE(lead.condition === val)}>
                      <span className="text-xl">{icon}</span> {label}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(3)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 5 — Timeline */}
            {step === 5 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>If we have an offer you like, how fast would you move?</h1>
                <p className={SUBHEAD}>We match you with offers that fit your timeline — no pressure.</p>
                <div className="space-y-3">
                  {[
                    { val: 'asap',            icon: '🔥', label: "ASAP — I'm ready now" },
                    { val: '0_3_months',      icon: '📅', label: '0–3 months' },
                    { val: '4_6_months',      icon: '📅', label: '4–6 months' },
                    { val: '7_12_months',     icon: '📅', label: '7–12 months' },
                    { val: '12_plus_months',  icon: '📅', label: '12+ months' },
                  ].map(({ val, icon, label }) => (
                    <button key={val} onClick={() => pick('timeline', val, 6)} className={CHOICE(lead.timeline === val)}>
                      <span className="text-xl">{icon}</span> {label}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(4)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 6 — Reason for selling */}
            {step === 6 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Why are you thinking of selling?</h1>
                <p className={SUBHEAD}>There is no wrong answer. It just tells us how to structure the offer.</p>
                <div className="space-y-3">
                  {[
                    { val: 'buying_another',      icon: '🏡', label: 'Looking to buy a home' },
                    { val: 'investment_property', icon: '📈', label: 'This is an investment property' },
                    { val: 'second_home',         icon: '🌴', label: 'This is a second home' },
                    { val: 'inheritance',         icon: '📜', label: 'This is an inheritance' },
                    { val: 'other',               icon: '💬', label: 'Other' },
                  ].map(({ val, icon, label }) => (
                    <button key={val} onClick={() => pick('sellingReason', val, 7)} className={CHOICE(lead.sellingReason === val)}>
                      <span className="text-xl">{icon}</span> {label}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(5)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 7 — Home details */}
            {step === 7 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Confirm your home details</h1>
                <p className={SUBHEAD}>Accurate details mean a more precise offer. You can always adjust before we finalize.</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bedrooms</label>
                    <select value={lead.bedrooms} onChange={e => set('bedrooms', e.target.value)} className={SELECT}>
                      {['1','2','3','4','5','6+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  {/* Bathrooms */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Bathrooms</label>
                    <select value={lead.bathrooms} onChange={e => set('bathrooms', e.target.value)} className={SELECT}>
                      {['1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  {/* Lot size */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Lot Size</label>
                    <select value={lead.lotSize} onChange={e => set('lotSize', e.target.value)} className={SELECT}>
                      <option value="0.5_acres_or_less">0.5 Acres or Less</option>
                      <option value="0.5_to_1_acre">0.5–1.0 Acres</option>
                      <option value="1_acre_or_more">1 Acre or More</option>
                    </select>
                  </div>
                  {/* Garage */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Garage</label>
                    <select value={lead.garageSize} onChange={e => set('garageSize', e.target.value)} className={SELECT}>
                      <option value="none">None</option>
                      <option value="carport">Carport</option>
                      <option value="1_car">1 car</option>
                      <option value="2_cars">2 cars</option>
                      <option value="3_plus_cars">3+ cars</option>
                    </select>
                  </div>
                  {/* Sq ft — full width */}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Finished Sq Ft</label>
                    <input
                      type="number"
                      value={lead.finishedSqft}
                      onChange={e => set('finishedSqft', e.target.value)}
                      placeholder="e.g. 1,800"
                      min="100" max="25000"
                      className={`${SELECT} text-base`}
                    />
                  </div>
                </div>

                <button onClick={() => go(8)} className={BTN_PRIMARY}>Continue →</button>
                <button onClick={() => go(6)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 8 — Occupancy */}
            {step === 8 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Who lives in the home?</h1>
                <p className={SUBHEAD}>We need this to understand your situation and coordinate next steps.</p>
                <div className="space-y-3">
                  {[
                    { val: 'owner_occupied',  icon: '🏠', label: 'Owner occupied — I live there' },
                    { val: 'tenant_occupied', icon: '👤', label: 'Tenant occupied' },
                    { val: 'vacant',          icon: '🔑', label: 'Vacant' },
                  ].map(({ val, icon, label }) => (
                    <button key={val} onClick={() => pick('occupancy', val, 9)} className={CHOICE(lead.occupancy === val)}>
                      <span className="text-xl">{icon}</span> {label}
                    </button>
                  ))}
                </div>
                <button onClick={() => go(7)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 9 — Property features */}
            {step === 9 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Does the property have any of the following?</h1>
                <p className={SUBHEAD}>Select all that apply. If none apply, just continue.</p>
                <div className="space-y-3">
                  {FEATURES.map(({ val, label }) => {
                    const active = lead.features.includes(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleFeature(val)}
                        className={CHOICE(active)}
                      >
                        <span
                          className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center ${
                            active ? 'bg-brand-blue border-brand-blue' : 'border-gray-300'
                          }`}
                          aria-hidden="true"
                        >
                          {active && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => go(10)} className={BTN_PRIMARY}>Continue →</button>
                <button onClick={() => go(8)} className={BTN_BACK}>← Back</button>
              </div>
            )}

            {/* STEP 10 — Name + Email */}
            {step === 10 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Let&apos;s get your contact details</h1>
                <p className={SUBHEAD}>Our service is 100% free. No strings attached.</p>

                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-brand-blue text-white text-xs font-bold px-2.5 py-1 rounded">BBB A+</span>
                  <span className="text-sm text-gray-500">Trusted by thousands of homeowners</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Full name</label>
                    <input
                      type="text"
                      value={lead.fullName}
                      onChange={e => { set('fullName', e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className={`${INPUT} ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email address</label>
                    <input
                      type="email"
                      value={lead.email}
                      onChange={e => { set('email', e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`${INPUT} ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <button onClick={submitContact} className={BTN_PRIMARY}>Continue →</button>
                <button onClick={() => go(9)} className={BTN_BACK}>← Back</button>

                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  By continuing, you agree to Salem Silver&apos;s{' '}
                  <Link href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</Link>{' '}
                  and{' '}
                  <Link href="/terms" className="text-brand-blue hover:underline">Terms of Service</Link>.
                </p>
              </div>
            )}

            {/* STEP 11 — Phone */}
            {step === 11 && (
              <div>
                <p className={EYEBROW}>{stepLabel}</p>
                <h1 className={HEADLINE}>Enter your phone number</h1>
                <p className={SUBHEAD}>A specialist will call or text with your cash offer — usually within 24 hours.</p>

                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-brand-blue text-white text-xs font-bold px-2.5 py-1 rounded">BBB A+</span>
                  <span className="text-sm text-gray-500">Trusted by thousands of homeowners</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone number</label>
                  <input
                    type="tel"
                    value={lead.phone}
                    onChange={e => { set('phone', e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                    placeholder="(617) 555-0100"
                    autoComplete="tel"
                    className={`${INPUT} ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                  onClick={submitPhone}
                  disabled={submitting}
                  className={`${BTN_PRIMARY} flex items-center justify-center gap-2 disabled:opacity-60`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : 'Get My Cash Offer →'}
                </button>
                <button onClick={() => go(10)} className={BTN_BACK}>← Back</button>

                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  By submitting, you consent to receive calls and texts from Salem Silver. Reply STOP to opt out.{' '}
                  <Link href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</Link>{' '}·{' '}
                  <Link href="/terms" className="text-brand-blue hover:underline">Terms</Link>
                </p>
              </div>
            )}

          </div>

          {/* ── Right: sidebar (desktop only) ── */}
          {side && (
            <aside className="hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
                <div className="text-center mb-5">
                  <svg width="88" height="74" viewBox="0 0 110 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="12" y="48" width="86" height="44" rx="3" fill="#dbeafe"/>
                    <polygon points="55,8 4,52 106,52" fill="#2D6BA1"/>
                    <rect x="38" y="62" width="34" height="30" rx="2" fill="#bfdbfe"/>
                    <rect x="15" y="55" width="22" height="22" rx="2" fill="#93c5fd"/>
                    <rect x="73" y="55" width="22" height="22" rx="2" fill="#93c5fd"/>
                    <rect x="51" y="79" width="8" height="13" rx="1" fill="#2D6BA1"/>
                    <rect x="18" y="58" width="16" height="14" rx="1" fill="#F4A225" opacity="0.4"/>
                    <rect x="76" y="58" width="16" height="14" rx="1" fill="#F4A225" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-2 text-gray-900">{side.h}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{side.b}</p>
                <div className="bg-brand-gold rounded-lg px-4 py-3 text-center text-sm font-bold text-white">
                  Close in as little as 7 days
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Questions?{' '}
                    <a href="tel:+16177142020" className="text-brand-blue font-semibold hover:underline">(617) 714-2020</a>
                  </p>
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}
