// GoHighLevel delivery for deal-page investor inquiries (goal NN). Edge-safe
// (fetch only). Three calls, in order:
//   1. POST /contacts/upsert without tags: upsert replaces a contact's whole tag
//      list (SS-1 F-056), which would wipe tags an existing contact already has.
//   2. POST /contacts/{id}/tags: adds the investor, deal and language tags.
//   3. POST /contacts/{id}/notes: buyer type, proof of funds, message, consent.
// Never log the token, the request bodies or GHL's replies (they carry PII).

import type { InquiryPayload } from './inquiry';
import type { Deal } from './types';

const DEFAULT_BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';

export const INVESTOR_TAG = 'salem-silver-investor';
export const LANGUAGE_TAGS = { en: 'investor-english', es: 'investor-spanish' } as const;

export type GhlConfig = { token: string; locationId: string; baseUrl: string };

export function ghlConfigFromEnv(): GhlConfig | null {
  const token = process.env.GHL_DEALS_TOKEN;
  const locationId = process.env.GHL_DEALS_LOCATION_ID;
  if (!token || !locationId) return null;
  return { token, locationId, baseUrl: process.env.GHL_DEALS_BASE_URL || DEFAULT_BASE };
}

export class GhlError extends Error {
  constructor(public step: 'upsert' | 'tags' | 'notes', public status: number) {
    super(`ghl ${step} failed (${status})`);
  }
}

const BUYER_LABEL = { cash: 'Cash', hard_money: 'Hard money', other: 'Other financing' } as const;

export function noteBody(p: InquiryPayload, deal: Deal): string {
  const a = deal.address;
  return [
    `Investor inquiry: ${a.street}, ${a.city}, ${a.state} ${a.zip} (${deal.slug})`,
    `Buyer type: ${BUYER_LABEL[p.buyerType]}`,
    `Proof of funds ready: ${p.pofReady === 'yes' ? 'Yes' : 'No'}`,
    `Language: ${p.language === 'es' ? 'Spanish' : 'English'}`,
    `Consent: yes (${p.consentVersion})`,
    `Message: ${p.message.trim() || '(none)'}`,
  ].join('\n');
}

/** Delivers one inquiry. Returns the GHL contact id. Throws GhlError on any failed step. */
export async function deliverInquiry(
  cfg: GhlConfig,
  p: InquiryPayload & { phoneE164: string },
  deal: Deal,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${cfg.token}`,
    Version: VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const post = (path: string, body: unknown) =>
    fetch(`${cfg.baseUrl}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });

  const up = await post('/contacts/upsert', {
    locationId: cfg.locationId,
    firstName: p.firstName.trim(),
    lastName: p.lastName.trim(),
    email: p.email.trim(),
    phone: p.phoneE164,
    source: deal.ghl.source,
  });
  if (!up.ok) throw new GhlError('upsert', up.status);
  const upJson = (await up.json()) as { contact?: { id?: string } };
  const id = upJson.contact?.id;
  if (!id) throw new GhlError('upsert', 502);

  const tags = await post(`/contacts/${encodeURIComponent(id)}/tags`, {
    tags: [INVESTOR_TAG, deal.ghl.dealTag, LANGUAGE_TAGS[p.language]],
  });
  if (!tags.ok) throw new GhlError('tags', tags.status);

  const notes = await post(`/contacts/${encodeURIComponent(id)}/notes`, { body: noteBody(p, deal) });
  if (!notes.ok) throw new GhlError('notes', notes.status);

  return id;
}
