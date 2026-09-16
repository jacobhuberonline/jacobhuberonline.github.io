import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTACT_EMAIL } from '../src/lib/contact-draft.ts';
import { validateContactSubmission } from '../src/lib/contact-form.ts';
import { handleContact, type ContactEnv } from '../workers/contact/index.ts';

const submission = {
  name: 'Alex Visitor', email: 'alex@example.com', service: 'business-website',
  message: 'I would like a website for my local business.', website: '',
  requestId: '22c0513c-e8cf-422d-9f83-dc6fa8fa0205',
};
const env: ContactEnv = {
  RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'enquiries@huberbuilds.com',
  ALLOWED_ORIGINS: 'https://huberbuilds.com,https://www.huberbuilds.com',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
};
const request = (body: unknown = submission, headers: Record<string, string> = {}) => new Request('https://contact.huberbuilds.com/contact', {
  method: 'POST', headers: { Origin: 'https://huberbuilds.com', 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body),
});
const noSend: typeof fetch = async () => { assert.fail('Invalid requests must never reach Resend.'); };

test('validates and trims visitor input while preserving the message layout', () => {
  const result = validateContactSubmission({ ...submission, name: '  Alex Visitor ', email: ' alex@example.com ', message: ' First paragraph.\n\nSecond paragraph. ' });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.name, 'Alex Visitor');
  assert.equal(result.data.email, 'alex@example.com');
  assert.equal(result.data.message, 'First paragraph.\n\nSecond paragraph.');
  assert.equal(validateContactSubmission({ ...submission, service: '' }).ok, true);
});

test('rejects empty, malformed, oversized, and header-injection input', () => {
  for (const input of [null, [], '', {},
    { ...submission, name: '  ' }, { ...submission, name: 'a'.repeat(101) },
    { ...submission, name: 'Alex\r\nBcc: stranger@example.com' },
    { ...submission, email: 'no-email' }, { ...submission, email: 'a@example.com,b@example.com' },
    { ...submission, email: 'a@example.com\r\nBcc: b@example.com' },
    { ...submission, email: 'a'.repeat(250) + '@example.com' },
    { ...submission, service: '__proto__' }, { ...submission, service: null },
    { ...submission, message: '  short ' }, { ...submission, message: 'a'.repeat(5001) },
    { ...submission, requestId: 'not-a-uuid' },
  ]) assert.equal(validateContactSubmission(input).ok, false);
});

test('sends only to the owner, sets visitor reply-to, and confirms acceptance', async () => {
  let calls = 0;
  const response = await handleContact(request({ ...submission, to: 'stranger@example.com', from: 'stranger@example.com', message: '<script>alert(1)</script> is plain text.' }), env, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.resend.com/emails');
    const headers = new Headers(options?.headers);
    assert.equal(headers.get('Authorization'), 'Bearer test-key');
    assert.equal(headers.get('Idempotency-Key'), `contact/${submission.requestId}`);
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(body.to, [CONTACT_EMAIL]);
    assert.equal(body.from, 'Huber Builds <enquiries@huberbuilds.com>');
    assert.equal(body.reply_to, submission.email);
    assert.match(body.subject, /Business website or redesign/);
    assert.match(body.text, /Alex Visitor/);
    assert.match(body.text, /<script>/);
    assert.equal(body.html, undefined);
    return Response.json({ id: 'email-id' });
  });
  assert.equal(calls, 1);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://huberbuilds.com');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('a retried request retains the same Resend idempotency key', async () => {
  const keys: string[] = [];
  const send: typeof fetch = async (_url, options) => {
    keys.push(new Headers(options?.headers).get('Idempotency-Key')!);
    return Response.json({ id: 'same-email-id' });
  };
  await handleContact(request(), env, send);
  await handleContact(request(), env, send);
  assert.deepEqual(keys, [`contact/${submission.requestId}`, `contact/${submission.requestId}`]);
});

test('restricts CORS to exact allowed origins, including preflights', async () => {
  for (const origin of ['', 'null', 'https://huberbuilds.com.evil.test', 'http://localhost:4321']) {
    const response = await handleContact(request(submission, { Origin: origin }), env, noSend);
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  const response = await handleContact(new Request('https://contact.huberbuilds.com/contact', {
    method: 'OPTIONS', headers: { Origin: 'https://huberbuilds.com' },
  }), env, noSend);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Methods'), 'POST');
});

test('rejects unsupported methods, routes, and content types', async () => {
  assert.equal((await handleContact(new Request('https://contact.huberbuilds.com/contact', { headers: { Origin: 'https://huberbuilds.com' } }), env, noSend)).status, 405);
  assert.equal((await handleContact(new Request('https://contact.huberbuilds.com/other'), env, noSend)).status, 404);
  assert.equal((await handleContact(request(submission, { 'Content-Type': 'text/plain' }), env, noSend)).status, 415);
});

test('returns useful field errors and rejects the honeypot without sending', async () => {
  const invalid = await handleContact(request({ ...submission, email: 'invalid' }), env, noSend);
  assert.equal(invalid.status, 400);
  assert.match((await invalid.json() as { errors: { email: string } }).errors.email, /valid email/);
  assert.equal((await handleContact(request({ ...submission, website: 'spam' }), env, noSend)).status, 400);
});

test('enforces actual byte limits and rejects malformed JSON', async () => {
  assert.equal((await handleContact(request({ ...submission, message: 'a'.repeat(24_001) }), env, noSend)).status, 413);
  const malformed = new Request('https://contact.huberbuilds.com/contact', {
    method: 'POST', headers: { Origin: 'https://huberbuilds.com', 'Content-Type': 'application/json' }, body: '{',
  });
  assert.equal((await handleContact(malformed, env, noSend)).status, 400);
});

test('rate-limits requests using the edge-provided address before sending', async () => {
  const response = await handleContact(request(submission, { 'CF-Connecting-IP': '192.0.2.1' }), {
    ...env, CONTACT_RATE_LIMITER: { limit: async ({ key }) => { assert.equal(key, '192.0.2.1'); return { success: false }; } },
  }, noSend);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
});

test('fails safely when server configuration or the rate limiter is unavailable', async (t) => {
  t.mock.method(console, 'error', () => {});
  assert.equal((await handleContact(request(), { ...env, RESEND_API_KEY: '' }, noSend)).status, 503);
  assert.equal((await handleContact(request(), { ...env, RESEND_FROM_EMAIL: 'invalid' }, noSend)).status, 503);
  assert.equal((await handleContact(request(), { ...env, CONTACT_RATE_LIMITER: { limit: async () => { throw new Error('offline'); } } }, noSend)).status, 503);
});

test('never claims success on provider errors, network failures, or invalid confirmations', async (t) => {
  const logs: string[] = [];
  t.mock.method(console, 'error', (message: string) => { logs.push(message); });
  for (const send of [
    async () => Response.json({ message: 'private provider details' }, { status: 403 }),
    async () => { throw new Error('private network details'); },
    async () => Response.json({}),
    async () => new Response('not json'),
  ]) {
    const response = await handleContact(request(), env, send);
    assert.equal(response.status, 502);
    assert.equal((await response.json() as { ok: boolean }).ok, false);
  }
  assert.doesNotMatch(logs.join('\n'), /private|alex@example.com|test-key/);
});
