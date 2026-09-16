import { CONTACT_EMAIL, createContactDraft } from '../../src/lib/contact-draft.ts';
import { isEmail, validateContactSubmission } from '../../src/lib/contact-form.ts';

export type ContactEnv = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  ALLOWED_ORIGINS: string;
  CONTACT_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
};

const MAX_BODY_BYTES = 24_000;

// Bound the actual stream, including requests without a Content-Length header.
async function readBody(request: Request): Promise<string> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError('Contact request too large.');
      }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function handleContact(request: Request, env: ContactEnv, send: typeof fetch = fetch): Promise<Response> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const headers = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff' });
  const reply = (status: number, body: object) => Response.json(body, { status, headers });

  if (!['/contact', '/contact/'].includes(new URL(request.url).pathname)) return reply(404, { ok: false });
  if (!origin || !allowed.includes(origin)) return reply(403, { ok: false, message: 'Please send your enquiry from huberbuilds.com.' });
  headers.set('Access-Control-Allow-Origin', origin);
  if (request.method === 'OPTIONS') {
    headers.set('Access-Control-Allow-Methods', 'POST');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '600');
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') {
    headers.set('Allow', 'POST, OPTIONS');
    return reply(405, { ok: false });
  }
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return reply(415, { ok: false, message: 'Please use the enquiry form to send your message.' });
  }
  if (!env.RESEND_API_KEY || !isEmail(env.RESEND_FROM_EMAIL ?? '') || !env.CONTACT_RATE_LIMITER) {
    console.error('Contact email is not configured. Check RESEND_API_KEY, RESEND_FROM_EMAIL, and CONTACT_RATE_LIMITER.');
    return reply(503, { ok: false, message: 'The form is temporarily unavailable. Please email me instead.' });
  }

  try {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' });
    if (!success) {
      headers.set('Retry-After', '60');
      return reply(429, { ok: false, message: 'Please wait a minute before trying again, or email me directly.' });
    }
  } catch {
    console.error('Contact rate limiter unavailable. Check the Worker binding.');
    return reply(503, { ok: false, message: 'The form is temporarily unavailable. Please email me instead.' });
  }

  let input: unknown;
  try {
    input = JSON.parse(await readBody(request));
  } catch (error) {
    return reply(error instanceof RangeError ? 413 : 400, { ok: false, message: 'Your message could not be read. Check its length and try again.' });
  }
  // This field is hidden from people and left empty by the real form.
  if (input && typeof input === 'object' && 'website' in input && input.website !== '') {
    return reply(400, { ok: false, message: 'Your message could not be sent. Please email me directly.' });
  }
  const result = validateContactSubmission(input);
  if (!result.ok) return reply(400, { ok: false, message: 'Please check the highlighted fields.', errors: result.errors });
  const { name, email, service, message, requestId } = result.data;
  const draft = createContactDraft(service);

  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact/${requestId}`,
      },
      body: JSON.stringify({
        from: `Huber Builds <${env.RESEND_FROM_EMAIL}>`,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: draft.subject,
        text: `New enquiry from huberbuilds.com\n\nName: ${name}\nEmail: ${email}\nProject: ${draft.label}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      // Provider responses can include addresses or request details. Log only the status.
      console.error(`Contact email rejected by Resend (HTTP ${response.status}). Check sender verification, API permissions, and provider status.`);
      return reply(502, { ok: false, message: 'Your message could not be sent. Please try again or email me directly.' });
    }
    const confirmation = await response.json() as { id?: unknown };
    if (typeof confirmation.id !== 'string' || !confirmation.id) throw new Error('Missing provider confirmation.');
    return reply(200, { ok: true });
  } catch {
    console.error('Contact email delivery could not be confirmed. Check Resend availability and Worker connectivity.');
    return reply(502, { ok: false, message: 'Sending could not be confirmed. Please try again or email me directly.' });
  }
}

export default { fetch: (request: Request, env: ContactEnv) => handleContact(request, env) };
