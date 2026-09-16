import { isContactService, type ContactServiceId } from './contact-draft.ts';

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;
export type ContactField = 'name' | 'email' | 'service' | 'message';
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactSubmission = {
  name: string;
  email: string;
  service: ContactServiceId | '';
  message: string;
  requestId: string;
};

export function isEmail(value: string): boolean {
  return value.length <= CONTACT_LIMITS.email
    && /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+$/i.test(value);
}

export function validateContactSubmission(input: unknown):
  | { ok: true; data: ContactSubmission }
  | { ok: false; errors: ContactErrors } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, errors: {} };
  const values = input as Record<string, unknown>;
  const read = (key: string) => typeof values[key] === 'string' ? values[key].trim() : '';
  const name = read('name');
  const email = read('email');
  const message = read('message');
  const service = values.service;
  const requestId = read('requestId');
  const errors: ContactErrors = {};

  if (!name || name.length > CONTACT_LIMITS.name || /[\r\n\x00-\x1f\x7f]/.test(name)) {
    errors.name = 'Enter your name (up to 100 characters).';
  }
  if (!isEmail(email)) errors.email = 'Enter a valid email address so I can reply.';
  if (service !== '' && !isContactService(service)) errors.service = 'Choose a project type from the list.';
  if (message.length < 10 || message.length > CONTACT_LIMITS.message || /\x00/.test(message)) {
    errors.message = 'Tell me a little about your project (10–5,000 characters).';
  }
  if (Object.keys(errors).length || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(requestId)) {
    return { ok: false, errors };
  }
  return { ok: true, data: { name, email, service: service as ContactSubmission['service'], message, requestId } };
}
