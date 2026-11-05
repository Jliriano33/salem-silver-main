// The investor inquiry payload (goal NN). The form posts this JSON to
// POST /api/deals/inquiry; the route validates it again on the server and
// delivers it to GoHighLevel. Field names here are the contract between the form
// (components/deals/InvestorForm.tsx) and the route (app/api/deals/inquiry/route.ts).

import type { Locale } from './types';

export const INQUIRY_ROUTE = '/api/deals/inquiry';

export type BuyerType = 'cash' | 'hard_money' | 'other';
export const BUYER_TYPES: readonly BuyerType[] = ['cash', 'hard_money', 'other'];

export type InquiryPayload = {
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  buyerType: BuyerType;
  /** Proof of funds ready: yes or no. */
  pofReady: 'yes' | 'no';
  message: string;
  /** Taken from the page locale, never asked. */
  language: Locale;
  consent: boolean;
  consentVersion: string;
  /** Honeypot. Real people leave it empty; the route drops the submission silently when it is filled. */
  company: string;
};

/** Error codes the route returns; the form maps each to an EN or ES message. */
export type InquiryErrorCode =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'buyer_type'
  | 'pof'
  | 'consent'
  | 'message_too_long'
  | 'unknown_deal'
  | 'stale_page'
  | 'delivery_failed'
  | 'bad_request';

export type InquiryResponse =
  | { ok: true }
  | { ok: false; errors: InquiryErrorCode[] };

export const MESSAGE_MAX = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** US phone: 10 digits, or 11 starting with 1, after stripping formatting. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

/** Shared by the form (before sending) and the route (authoritative). */
export function validateInquiry(p: Partial<InquiryPayload>): InquiryErrorCode[] {
  const errors: InquiryErrorCode[] = [];
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  if (!s(p.firstName) || s(p.firstName).length > 80) errors.push('first_name');
  if (!s(p.lastName) || s(p.lastName).length > 80) errors.push('last_name');
  if (!EMAIL_RE.test(s(p.email)) || s(p.email).length > 200) errors.push('email');
  if (!normalizePhone(s(p.phone))) errors.push('phone');
  if (!BUYER_TYPES.includes(p.buyerType as BuyerType)) errors.push('buyer_type');
  if (p.pofReady !== 'yes' && p.pofReady !== 'no') errors.push('pof');
  if (typeof p.message === 'string' && p.message.length > MESSAGE_MAX) errors.push('message_too_long');
  if (p.consent !== true) errors.push('consent');
  return errors;
}
