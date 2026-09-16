import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeEnquiries, SAMPLE_ENQUIRIES } from '../src/lib/automation-demo.ts';

test('normalizes names and email formatting without changing the source records', () => {
  const input = Object.freeze([
    Object.freeze({ name: '  Ada\t Lovelace\n', email: ' ADA@Example.com ' }),
    Object.freeze({ name: 42, email: 'second@example.com' }),
  ]);
  const result = normalizeEnquiries(input);

  assert.equal(result.rows[0].name, 'Ada Lovelace');
  assert.equal(result.rows[0].email, 'ada@example.com');
  assert.equal(result.rows[0].status, 'ready');
  assert.equal(result.rows[1].name, '');
  assert.equal(input[0].email, ' ADA@Example.com ');
});

test('duplicates refer to the first valid input row, even after rows needing review', () => {
  const result = normalizeEnquiries([
    { email: 'broken@' },
    { email: ' Alex@EXAMPLE.com ' },
    { email: 'alex@example.com' },
    { email: ' ALEX@example.com ' },
    { email: 'broken@' },
  ]);

  assert.deepEqual(result.rows.map((row) => row.status), [
    'needs-review', 'ready', 'duplicate', 'duplicate', 'needs-review',
  ]);
  assert.equal(result.rows[2].duplicateOf, 2);
  assert.equal(result.rows[3].duplicateOf, 2);
  assert.deepEqual(result.counts, { total: 5, ready: 1, duplicate: 2, needsReview: 2 });
});

test('handles empty or invalid top-level input and missing row fields', () => {
  for (const input of [undefined, null, '', 'a@example.com', 4, {}, []]) {
    assert.deepEqual(normalizeEnquiries(input), {
      rows: [], counts: { total: 0, ready: 0, duplicate: 0, needsReview: 0 },
    });
  }

  const result = normalizeEnquiries([null, undefined, 'text', 3, [], {}, { email: null }, { email: '  ' }, { email: 123 }]);
  assert.equal(result.counts.needsReview, 9);
  assert.ok(result.rows.every((row) => row.status === 'needs-review' && row.email === '' && row.name === ''));
  assert.equal(result.rows[7].issue, 'missing-email');
  assert.equal(result.rows[8].issue, 'invalid-email');
  assert.deepEqual(normalizeEnquiries(Array(2)).counts, {
    total: 2, ready: 0, duplicate: 0, needsReview: 2,
  });
});

test('flags malformed emails without silently repairing them', () => {
  const emails = [
    'person', 'person@', '@example.com', 'a@b@c.com', 'a b@example.com',
    'a@example .com', 'a@-example.com', 'a@example..com', '.a@example.com',
    'a..b@example.com', 'a@example', `${'a'.repeat(65)}@example.com`,
  ];
  const result = normalizeEnquiries(emails.map((email) => ({ email })));

  assert.equal(result.counts.needsReview, emails.length);
  assert.ok(result.rows.every((row) => row.issue === 'invalid-email'));
  assert.equal(result.rows[4].email, 'a b@example.com');
});

test('keeps distinct plus aliases and dotted addresses separate', () => {
  const emails = ['first.last@example.com', 'firstlast@example.com', 'first.last+tag@example.com'];
  const result = normalizeEnquiries(emails.map((email) => ({ email })));

  assert.equal(result.counts.ready, 3);
  assert.equal(result.counts.duplicate, 0);
  assert.deepEqual(result.rows.map((row) => row.email), emails);
});

test('fictional sample consistently produces four ready, one duplicate, and one review', () => {
  const before = JSON.stringify(SAMPLE_ENQUIRIES);
  const result = normalizeEnquiries(SAMPLE_ENQUIRIES);

  assert.deepEqual(result.counts, { total: 6, ready: 4, duplicate: 1, needsReview: 1 });
  assert.deepEqual(result.rows.map((row) => row.sourceRow), [1, 2, 3, 4, 5, 6]);
  assert.equal(result.rows[3].duplicateOf, 1);
  assert.equal(result.rows[4].issue, 'missing-email');
  assert.equal(result.rows[4].email, '');
  assert.deepEqual(normalizeEnquiries(SAMPLE_ENQUIRIES), result);
  assert.equal(JSON.stringify(SAMPLE_ENQUIRIES), before);
});
