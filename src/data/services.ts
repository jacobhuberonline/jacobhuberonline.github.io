import type { icons } from './icons';

export type ServiceOffer = {
  id: string;
  title: string;
  description: string;
  fit: string;
  icon: keyof typeof icons;
  included: string[];
  href: string;
};

export const serviceOffers: ServiceOffer[] = [
  {
    id: 'starter-website',
    title: 'Starter website',
    description: 'Introduce your business and give people one clear next step.',
    fit: 'A simple first website or landing page',
    icon: 'website',
    included: [
      'One page with agreed sections',
      'Layout for phones and computers',
      'Search titles, descriptions & sitemap',
      'Contact links, launch & handoff',
    ],
    href: '/services/websites/#starter-website',
  },
  {
    id: 'business-website',
    title: 'Business website or redesign',
    description: 'Give your services and work room to shine, on a new site or a refreshed one.',
    fit: 'A business that needs more than one page',
    icon: 'refresh',
    included: [
      'An agreed set of pages and features',
      'Design around your brand and content',
      'Mobile, browser & search setup checks',
      'Launch, project files & a walkthrough',
    ],
    href: '/services/websites/#business-website',
  },
  {
    id: 'workflow-automation',
    title: 'Workflow automation project',
    description: 'Take a repeated task off your plate and make the result easier to rely on.',
    fit: 'One time-consuming, repeatable process',
    icon: 'automation',
    included: [
      'Map the steps and agree the result',
      'A script, integration or small tool',
      'Testing with agreed sample cases',
      'Setup, source files & operating notes',
    ],
    href: '/services/automation/#workflow-automation',
  },
];
