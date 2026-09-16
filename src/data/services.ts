import type { icons } from './icons';

export type ServiceOffer = {
  id: string;
  title: string;
  description: string;
  fit: string;
  startingPrice: number;
  icon: keyof typeof icons;
  included: string[];
  href: string;
};

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number): string => priceFormatter.format(amount);

export const websiteCare = {
  monthlyPrice: 99,
  editMinutes: 30,
};

export const serviceOffers: ServiceOffer[] = [
  {
    id: 'starter-website',
    title: 'Starter website',
    description: 'Introduce your business and give people one clear next step.',
    fit: 'A simple first website or landing page',
    startingPrice: 1000,
    icon: 'website',
    included: [
      'One page with agreed sections',
      'Layout for phones and computers',
      'Search titles, descriptions & sitemap',
      'Contact links & launch setup',
    ],
    href: '/services/websites/#starter-website',
  },
  {
    id: 'business-website',
    title: 'Business website or redesign',
    description: 'Give your services and work room to shine, on a new site or a refreshed one.',
    fit: 'A business that needs more than one page',
    startingPrice: 2500,
    icon: 'refresh',
    included: [
      'Up to five standard content pages',
      'Design around your brand and content',
      'Mobile, browser & search setup checks',
      'Launch setup & your website files',
    ],
    href: '/services/websites/#business-website',
  },
  {
    id: 'workflow-automation',
    title: 'Workflow automation project',
    description: 'Take a repeated task off your plate and make the result easier to rely on.',
    fit: 'One time-consuming, repeatable process',
    startingPrice: 1500,
    icon: 'automation',
    included: [
      'One workflow with agreed inputs & outputs',
      'A script or integration with failure checks',
      'Testing with agreed sample cases',
      'Setup, source files & operating notes',
    ],
    href: '/services/automation/#workflow-automation',
  },
];
