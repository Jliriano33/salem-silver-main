import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    console.log('[lead] Forwarding to n8n:', JSON.stringify(payload));

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('[lead] n8n response:', res.status, text);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Submission failed. Please call +1 617-714-2020.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[lead] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Unexpected error. Please call +1 617-714-2020.' },
      { status: 500 }
    );
  }
}
