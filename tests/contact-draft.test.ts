import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONTACT_EMAIL,
  CONTACT_SERVICE_IDS,
  contactServiceFromSearch,
  createContactDraft,
} from '../src/lib/contact-draft.ts';

test('recognizes only the four intended service query values', () => {
  for (const id of CONTACT_SERVICE_IDS) {
    assert.equal(contactServiceFromSearch(`?utm_source=linkedin&service=${encodeURIComponent(id)}`), id);
  }
  for (const search of [undefined, null, '', '?service=', '?service=unknown', '?service=Starter-Website', '?service=constructor', '?service=__proto__']) {
    assert.equal(contactServiceFromSearch(search), null);
  }
  assert.equal(contactServiceFromSearch('?service=starter-website&service=workflow-automation'), null);
  assert.equal(contactServiceFromSearch('?service=starter-website&service=starter-website'), null);
});

test('builds useful offer-specific email subjects and short relevant prompts', () => {
  const starter = createContactDraft('starter-website');
  const business = createContactDraft('business-website');
  const automation = createContactDraft('workflow-automation');
  const care = createContactDraft('website-care');

  assert.match(starter.subject, /Starter website/);
  assert.match(starter.body, /What the site should help with:/);
  assert.match(business.subject, /Business website or redesign/);
  assert.match(business.body, /What I’d like to improve:/);
  assert.match(automation.subject, /Workflow automation project/);
  assert.match(automation.body, /The task I repeat:/);
  assert.doesNotMatch(automation.body, /Current site/);
  assert.match(care.subject, /Website care/);
  assert.match(care.body, /What I’d like help maintaining:/);
});

test('mailto URLs preserve newlines and punctuation in a draft addressed only to Jacob', () => {
  for (const id of [null, ...CONTACT_SERVICE_IDS]) {
    const draft = createContactDraft(id);
    const url = new URL(draft.mailto);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.pathname, CONTACT_EMAIL);
    assert.equal(url.searchParams.get('subject'), draft.subject);
    assert.equal(url.searchParams.get('body'), draft.body);
    assert.match(draft.body, /^Hi Jacob,\n\n/);
    assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  }
});

test('unknown values cannot inject email recipients, headers, or visible context', () => {
  const general = createContactDraft(null);
  const values = [
    '', undefined, 3, {}, '__proto__', '<img src=x onerror=alert(1)>',
    'starter-website\r\nBcc: stranger@example.com',
    'website-care&bcc=stranger@example.com',
  ];
  for (const value of values) assert.deepEqual(createContactDraft(value), general);

  const id = contactServiceFromSearch('?service=website-care%0D%0ABcc%3Astranger%40example.com');
  assert.equal(id, null);
  assert.deepEqual(createContactDraft(id), general);
  assert.equal(general.label, 'General enquiry');
  assert.equal(general.subject, 'Project enquiry');
});
