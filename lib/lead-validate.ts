// Checks for POST /api/lead before anything is sent to n8n (F-045). The dialer calls whatever number a lead
// carries, so junk is refused here, at the door.

export const MAX_BODY_BYTES = 16 * 1024;

const PRODUCTION_ORIGINS = ['https://www.salemsilver.com', 'https://salemsilver.com'];

/** Longest value accepted per field. A field not listed here and not in UNCAPPED gets DEFAULT_MAX. */
const MAX_LENGTH: Record<string, number> = {
  name: 120,
  email: 254,
  phone: 30,
  address: 300,
  features: 500,
};
const DEFAULT_MAX = 200;
// Cut to length by the route instead of refused, as since SS-2.
const UNCAPPED = new Set(['consent_version', 'source_page']);

/** Every string field the forms send. */
const STRING_FIELDS = [
  'name', 'phone', 'email', 'address', 'unitNumber', 'condition', 'timeline', 'homeValue', 'sellingReason',
  'features', 'bedrooms', 'bathrooms', 'lotSize', 'finishedSqft', 'garageSize', 'occupancy', 'source',
  'consent_version', 'source_page', 'website',
];

export type Refusal = { status: number; error: string };

/**
 * Same host as the request, or the production site. A request with no Origin (a server, curl) is not refused
 * here. The Host header is compared, not request.url, which the Next server may rebuild as localhost.
 */
export function originRefusal(origin: string | null, host: string | null): Refusal | null {
  if (!origin) return null;
  if (PRODUCTION_ORIGINS.includes(origin)) return null;
  try {
    if (host && new URL(origin).host === host) return null;
  } catch {
    // An Origin that is not a URL is refused below.
  }
  return { status: 403, error: 'Forbidden.' };
}

/** Ten digits, a valid US area code and exchange; a leading country code 1 is allowed. */
export function usPhoneDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? digits : null;
}

export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Types and lengths, then phone and email format. Required fields and consent are checked by the route. */
export function fieldRefusal(body: Record<string, unknown>): Refusal | null {
  for (const key of STRING_FIELDS) {
    const v = body[key];
    if (v === undefined || v === null) continue;
    if (typeof v !== 'string') return { status: 400, error: `Invalid ${key}.` };
    if (!UNCAPPED.has(key) && v.length > (MAX_LENGTH[key] ?? DEFAULT_MAX)) {
      return { status: 400, error: `The ${key} is too long.` };
    }
  }
  if (!usPhoneDigits(String(body.phone))) return { status: 400, error: 'Please enter a valid 10-digit US phone number.' };
  if (!isEmail(String(body.email).trim())) return { status: 400, error: 'Please enter a valid email address.' };
  return null;
}
