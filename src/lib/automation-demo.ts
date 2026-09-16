export type EnquiryStatus = 'ready' | 'duplicate' | 'needs-review';
export type ReviewIssue = 'missing-email' | 'invalid-email';

export interface NormalizedEnquiry {
  sourceRow: number;
  name: string;
  email: string;
  status: EnquiryStatus;
  issue: ReviewIssue | null;
  duplicateOf: number | null;
}

export interface EnquiryResult {
  rows: NormalizedEnquiry[];
  counts: {
    total: number;
    ready: number;
    duplicate: number;
    needsReview: number;
  };
}

export const SAMPLE_ENQUIRIES = [
  { name: '  Alex   Rivera ', email: ' ALEX.RIVERA@example.com ' },
  { name: 'Rowan  Kim', email: 'rowan.kim@EXAMPLE.COM' },
  { name: ' Sam Taylor ', email: 'sam.taylor@example.com ' },
  { name: 'Alex Rivera', email: 'alex.rivera@EXAMPLE.COM' },
  { name: 'Parker Jordan', email: '' },
  { name: 'Casey   Morgan', email: ' CASEY.MORGAN@example.com' },
] as const;

const localPartPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const domainLabelPattern = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

// A conservative format check, not a mailbox or delivery check.
function hasEmailShape(email: string): boolean {
  if (email.length > 254) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (
    !local || local.length > 64 ||
    !localPartPattern.test(local) ||
    local.startsWith('.') || local.endsWith('.') || local.includes('..')
  ) return false;

  const labels = domain.split('.');
  return labels.length >= 2 && labels.every((label) =>
    label.length <= 63 && domainLabelPattern.test(label)
  );
}

/** Normalize formatting, keeping the first valid occurrence of each exact normalized email. */
export function normalizeEnquiries(input: unknown): EnquiryResult {
  const values = Array.isArray(input) ? Array.from(input) : [];
  const seenEmails = new Map<string, number>();
  const rows: NormalizedEnquiry[] = values.map((value, index) => {
    const record = value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
    const name = typeof record.name === 'string' ? record.name.trim().replace(/\s+/g, ' ') : '';
    const email = typeof record.email === 'string' ? record.email.trim().toLowerCase() : '';
    const sourceRow = index + 1;
    let issue: ReviewIssue | null = null;

    if (record.email != null && typeof record.email !== 'string') issue = 'invalid-email';
    else if (!email) issue = 'missing-email';
    else if (!hasEmailShape(email)) issue = 'invalid-email';

    if (issue) {
      return { sourceRow, name, email, status: 'needs-review', issue, duplicateOf: null };
    }

    const duplicateOf = seenEmails.get(email);
    if (duplicateOf !== undefined) {
      return { sourceRow, name, email, status: 'duplicate', issue: null, duplicateOf };
    }

    seenEmails.set(email, sourceRow);
    return { sourceRow, name, email, status: 'ready', issue: null, duplicateOf: null };
  });

  return {
    rows,
    counts: {
      total: rows.length,
      ready: rows.filter((row) => row.status === 'ready').length,
      duplicate: rows.filter((row) => row.status === 'duplicate').length,
      needsReview: rows.filter((row) => row.status === 'needs-review').length,
    },
  };
}
