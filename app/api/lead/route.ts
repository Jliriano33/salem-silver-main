import { NextRequest, NextResponse } from 'next/server';
import { MAX_BODY_BYTES, fieldRefusal, originRefusal, readBodyLimited } from '@/lib/lead-validate';

export const runtime = 'edge';

// n8n answers in about a second. Past this the seller is told to call, instead of waiting on a spinner (F-017).
const WEBHOOK_TIMEOUT_MS = 15_000;
// Sent when N8N_WEBHOOK_SECRET is set; the n8n webhook checks it (F-044b). Never logged.
const INTAKE_HEADER = 'X-Salem-Intake-Key';

const refuse = (status: number, error: string) => NextResponse.json({ success: false, error }, { status });

export async function POST(request: NextRequest) {
  try {
    // Refused before the body is read (F-045): other sites' pages, and cross-site form posts, which
    // cannot send JSON without the browser asking first.
    const blocked = originRefusal(request.headers.get('origin'), request.headers.get('host'));
    if (blocked) return refuse(blocked.status, blocked.error);
    if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
      return refuse(415, 'Unsupported content type.');
    }
    if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return refuse(413, 'Request too large.');
    const raw = await readBodyLimited(request.body, MAX_BODY_BYTES);
    if (raw === null) return refuse(413, 'Request too large.');

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return refuse(400, 'Invalid request.');
      body = parsed as Record<string, unknown>;
    } catch {
      return refuse(400, 'Invalid request.');
    }

    const required = ['name', 'phone', 'email', 'address'];
    const missing = required.filter((f) => !body[f]?.toString().trim());
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.consent !== true) {
      return NextResponse.json(
        { success: false, error: 'Consent to be contacted is required.' },
        { status: 400 }
      );
    }

    const invalid = fieldRefusal(body);
    if (invalid) return refuse(invalid.status, invalid.error);

    // Honeypot (F-045): the forms hide this field from people. A bot that fills it is told it worked, so
    // it does not try again, and nothing is sent on.
    if (typeof body.website === 'string' && body.website.trim()) {
      console.log('[lead] Dropped: honeypot filled');
      return NextResponse.json({ success: true });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('[lead] N8N_WEBHOOK_URL is not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please call +1 617-714-2020.' },
        { status: 500 }
      );
    }

    const payload = {
      name:      body.name,
      phone:     body.phone,
      email:     body.email,
      address:   body.address,
      unitNumber: body.unitNumber ?? '',
      condition: body.condition ?? '',
      timeline:  body.timeline ?? '',
      homeValue: body.homeValue ?? '',
      sellingReason: body.sellingReason ?? '',
      features:  body.features ?? '',
      bedrooms:  body.bedrooms ?? '',
      bathrooms: body.bathrooms ?? '',
      lotSize:   body.lotSize ?? '',
      finishedSqft: body.finishedSqft ?? '',
      garageSize: body.garageSize ?? '',
      occupancy: body.occupancy ?? '',
      source:    body.source ?? 'website',
      consent:   true,
      consent_version: String(body.consent_version ?? '').slice(0, 64),
      consent_at: new Date().toISOString(),
      source_page: String(body.source_page ?? '').slice(0, 200),
    };

    // Never log webhookUrl: it is the intake's only secret, and this log is Cloudflare's function log (F-050).
    // The lead's details are logged only if forwarding fails (below), as the record to recover it from;
    // a lead that n8n took is logged without them (audit A1-05).
    console.log('[lead] Forwarding to n8n:', payload.source, `phone ***${String(payload.phone).replace(/\D/g, '').slice(-4)}`);
    const logForRecovery = (why: string) => console.log(`[lead] ${why}, kept for recovery:`, JSON.stringify(payload));

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (secret) headers[INTAKE_HEADER] = secret;

    let res: Response;
    let text: string;
    try {
      res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });
      text = await res.text();
    } catch (err) {
      const name = err instanceof Error ? err.name : typeof err;
      if (name === 'TimeoutError' || name === 'AbortError') {
        console.error('[lead] n8n timed out after', WEBHOOK_TIMEOUT_MS, 'ms');
        // n8n may still have taken it; the record is for checking by hand, not proof it was lost (A3-01).
        logForRecovery('Delivery uncertain (timed out)');
        return refuse(504, 'Submission timed out. Please call +1 617-714-2020.');
      }
      // The connection can fail after n8n has the request, so this is uncertain too (A5-03).
      logForRecovery('Delivery uncertain (request failed)');
      throw err;
    }

    // Log the status and size only: n8n's error replies repeat the webhook path (F-050).
    console.log('[lead] n8n response:', res.status, `(${text.length} bytes)`);

    if (!res.ok) {
      logForRecovery(`Not delivered (n8n answered ${res.status})`);
      return NextResponse.json(
        { success: false, error: 'Submission failed. Please call +1 617-714-2020.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    // The error's name only: a fetch error's message can carry the webhook URL (F-050).
    console.error('[lead] Unexpected error:', err instanceof Error ? err.name : typeof err);
    return NextResponse.json(
      { success: false, error: 'Unexpected error. Please call +1 617-714-2020.' },
      { status: 500 }
    );
  }
}
