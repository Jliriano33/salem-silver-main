export const runtime = 'edge';

const ALLOWED_SOURCES = ['website', 'facebook-lp', 'google-lp'] as const;
type AllowedSource = (typeof ALLOWED_SOURCES)[number];

const CONDITION_VALUES = ['Excellent', 'Good', 'Fair', 'Needs Work', 'Major Repairs Needed'];
const TIMELINE_VALUES = ['As Soon As Possible', '1-3 Months', '3-6 Months', 'Just Exploring'];

export async function POST(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const referer = request.headers.get('referer') ?? '';
  const allowedOrigins = ['https://www.salemsilver.com', 'https://cash-offer.salemsilver.com'];
  const isAllowed =
    process.env.NODE_ENV !== 'production' ||
    allowedOrigins.some((o) => origin.startsWith(o) || referer.startsWith(o));

  if (!isAllowed) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const required = ['name', 'phone', 'email', 'address', 'condition', 'timeline'];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === '') {
      return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const source = String(body.source || 'website').trim();
  if (!ALLOWED_SOURCES.includes(source as AllowedSource)) {
    return Response.json({ error: 'Invalid source' }, { status: 400 });
  }

  const condition = String(body.condition).trim();
  if (!CONDITION_VALUES.includes(condition)) {
    return Response.json({ error: 'Invalid condition value' }, { status: 400 });
  }

  const timeline = String(body.timeline).trim();
  if (!TIMELINE_VALUES.includes(timeline)) {
    return Response.json({ error: 'Invalid timeline value' }, { status: 400 });
  }

  const payload = {
    name: String(body.name).trim().slice(0, 200),
    phone: String(body.phone).replace(/\D/g, '').slice(0, 15),
    email: String(body.email).trim().toLowerCase().slice(0, 254),
    address: String(body.address).trim().slice(0, 500),
    condition,
    timeline,
    source,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return Response.json({ error: 'Webhook delivery failed' }, { status: 502 });
    }
  } catch {
    return Response.json({ error: 'Webhook unreachable' }, { status: 502 });
  }

  return Response.json({ success: true });
}
