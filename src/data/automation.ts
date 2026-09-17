// Workflow details supplied by Jacob. The certificate template app, file format,
// trigger configuration, and measured savings have not been confirmed.
export const vestCertificateWorkflow = {
  client: 'VEST First Responder',
  href: '/services/automation/#vest-certificates',
  summary: 'A form, a Google Sheet, and a script turn training details into personalized certificates, delivered by email.',
  steps: [
    {
      title: 'Complete a form',
      detail: 'Name, email, and training level.',
    },
    {
      title: 'Collect the details',
      detail: 'Responses arrive in a Google Sheet.',
    },
    {
      title: 'Create the certificate',
      detail: 'A script personalizes it for the participant’s level.',
    },
    {
      title: 'Send it by email',
      detail: 'The participant receives their certificate.',
    },
  ],
} as const;
