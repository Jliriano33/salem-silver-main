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
      condition: body.condition ?? '',
      timeline:  body.timeline ?? '',
      source:    body.source ?? 'website',
    };

    console.log('[lead] Forwarding to n8n:', webhookUrl, JSON.stringify(payload));

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
