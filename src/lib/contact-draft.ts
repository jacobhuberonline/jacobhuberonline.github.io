import { serviceOffers } from '../data/services.ts';

export const CONTACT_EMAIL = 'jhuber.mail@icloud.com';
export const CONTACT_SERVICE_IDS = [
  'starter-website', 'business-website', 'workflow-automation', 'website-care',
] as const;

export type ContactServiceId = typeof CONTACT_SERVICE_IDS[number];

type ContactTemplate = {
  label: string;
  hint: string;
  introduction: string;
  prompts: string[];
};

const offerLabel = (id: string, fallback: string) =>
  serviceOffers.find((offer) => offer.id === id)?.title ?? fallback;

const templates: Record<ContactServiceId, ContactTemplate> = {
  'starter-website': {
    label: offerLabel('starter-website', 'Starter website'),
    hint: 'A simple first website or landing page.',
    introduction: 'I’m interested in a starter website.',
    prompts: ['My business:', 'What the site should help with:', 'Current site (if any):'],
  },
  'business-website': {
    label: offerLabel('business-website', 'Business website or redesign'),
    hint: 'A new business site or a refresh of the one you have.',
    introduction: 'I’m interested in a business website or redesign.',
    prompts: ['My business:', 'What I’d like to improve:', 'Current site (if any):'],
  },
  'workflow-automation': {
    label: offerLabel('workflow-automation', 'Workflow automation project'),
    hint: 'One repeated task you’d like to make easier.',
    introduction: 'I’m interested in a workflow automation project.',
    prompts: ['The task I repeat:', 'Tools or files involved:', 'The result I need:'],
  },
  'website-care': {
    label: 'Website care',
    hint: 'Help managing and updating your website.',
    introduction: 'I’d like to ask about website care.',
    prompts: ['My website:', 'What I’d like help maintaining:'],
  },
};

const generalTemplate: ContactTemplate = {
  label: 'General enquiry',
  hint: 'A website, automation, or another idea.',
  introduction: 'I’d like to discuss a project.',
  prompts: ['What I need help with:', 'My website or current tools (if relevant):'],
};

export const CONTACT_SERVICE_OPTIONS = CONTACT_SERVICE_IDS.map((id) => ({
  id,
  label: templates[id].label,
}));

export function isContactService(value: unknown): value is ContactServiceId {
  return typeof value === 'string' && CONTACT_SERVICE_IDS.some((id) => id === value);
}

/** Reject unknown or repeated service parameters rather than using arbitrary query text. */
export function contactServiceFromSearch(search: unknown): ContactServiceId | null {
  if (typeof search !== 'string') return null;
  const values = new URLSearchParams(search).getAll('service');
  return values.length === 1 && isContactService(values[0]) ? values[0] : null;
}

export function createContactDraft(value: unknown) {
  const service = isContactService(value) ? value : null;
  const template = service ? templates[service] : generalTemplate;
  const subject = service ? `Project enquiry: ${template.label}` : 'Project enquiry';
  const body = `Hi Jacob,\n\n${template.introduction}\n\n${template.prompts.join('\n')}\n\nThanks!`;
  return {
    service,
    label: template.label,
    hint: template.hint,
    subject,
    body,
    mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
