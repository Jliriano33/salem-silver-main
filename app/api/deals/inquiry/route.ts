import { NextRequest, NextResponse } from 'next/server';
import { deliverInquiry, ghlConfigFromEnv, GhlError } from '@/lib/deals/ghl';
import {
  normalizePhone,
  validateInquiry,
  type InquiryPayload,
  type InquiryResponse,
} from '@/lib/deals/inquiry';
import { getDeal } from '@/lib/deals/registry';

export const runtime = 'edge';

const reply = (body: InquiryResponse, status: number) => NextResponse.json(body, { status });

export async function POST(request: NextRequest) {
  let body: Partial<InquiryPayload>;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, errors: ['bad_request'] }, 400);
  }
  if (!body || typeof body !== 'object') return reply({ ok: false, errors: ['bad_request'] }, 400);

  // Honeypot: answer like a success so a bot learns nothing, and deliver nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    console.log('[deals] honeypot filled, dropped');
    return reply({ ok: true }, 200);
  }

  const deal = typeof body.slug === 'string' ? getDeal(body.slug) : undefined;
  if (!deal) return reply({ ok: false, errors: ['unknown_deal'] }, 400);

  const errors = validateInquiry(body);
  if (errors.length > 0) return reply({ ok: false, errors }, 400);

  const cfg = ghlConfigFromEnv();
  if (!cfg) {
    console.error('[deals] GHL_DEALS_TOKEN or GHL_DEALS_LOCATION_ID is not set');
    return reply({ ok: false, errors: ['delivery_failed'] }, 500);
  }

  const payload = {
    slug: deal.slug,
    firstName: String(body.firstName),
    lastName: String(body.lastName),
    email: String(body.email),
    phone: String(body.phone),
    phoneE164: normalizePhone(String(body.phone)) as string,
    buyerType: body.buyerType!,
    pofReady: body.pofReady!,
    message: typeof body.message === 'string' ? body.message : '',
    language: body.language === 'es' ? 'es' : 'en',
    consent: true,
    consentVersion: String(body.consentVersion ?? '').slice(0, 64),
    company: '',
  } as const;

  try {
    const id = await deliverInquiry(cfg, { ...payload }, deal);
    // The contact id only: no names, email, phone or message in the function log.
    console.log('[deals] delivered', deal.slug, id);
    return reply({ ok: true }, 200);
  } catch (err) {
    if (err instanceof GhlError) console.error('[deals] delivery failed at', err.step, err.status);
    else console.error('[deals] delivery error:', err instanceof Error ? err.name : typeof err);
    return reply({ ok: false, errors: ['delivery_failed'] }, 502);
  }
}
