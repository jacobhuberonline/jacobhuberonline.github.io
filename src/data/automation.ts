// Workflow details supplied by Jacob. The certificate template app, file format,
// trigger configuration, and measured savings have not been confirmed.
export const vestCertificateWorkflow = {
  client: 'VEST First Responder',
  href: '/services/automation/#vest-certificates',
  summary: 'After training, a form feeds participant details into a Google Sheet. A script creates a certificate for the participant’s training level and emails it to them.',
  steps: [
    {
      title: 'Complete a form',
      detail: 'The participant’s name, email, and training details enter the workflow after the class.',
    },
    {
      title: 'Collect the details',
      detail: 'The form response goes into a Google Sheet, ready for the script to use.',
    },
    {
      title: 'Create the certificate',
      detail: 'The script uses the participant’s details and training level to produce a personalized certificate.',
    },
    {
      title: 'Send it by email',
      detail: 'The system emails the customized certificate to the participant.',
    },
  ],
} as const;
