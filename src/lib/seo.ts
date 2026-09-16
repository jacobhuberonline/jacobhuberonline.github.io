import { socialLinks } from '../data/socials';

// Keep discovery and structured data aligned with the public pages.
export const publicPages = [
  { path: '/', name: 'Home' },
  { path: '/services/', name: 'Services' },
  { path: '/services/websites/', name: 'Business websites' },
  { path: '/services/automation/', name: 'Workflow automation' },
  { path: '/projects/', name: 'My work' },
  { path: '/about/', name: 'About Jacob' },
  { path: '/experience/', name: 'Experience' },
  { path: '/contact/', name: 'Start a project' },
] as const;

const services: Record<string, { name: string; serviceType: string[] }> = {
  '/services/websites/': {
    name: 'Business website design and redesign',
    serviceType: ['Website development', 'Website redesign', 'Landing page development'],
  },
  '/services/automation/': {
    name: 'Workflow and business process automation',
    serviceType: ['Workflow automation', 'Business process automation', 'API integration', 'Data processing automation'],
  },
};

export function pageSchema(site: URL, canonical: URL, title: string, description: string) {
  const url = (path: string) => new URL(path, site).href;
  const personId = url('/#jacob-huber');
  const websiteId = url('/#website');
  const service = services[canonical.pathname];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': websiteId,
        url: url('/'), name: 'Huber Builds', alternateName: 'Jacob Huber',
        inLanguage: 'en-US', publisher: { '@id': personId },
      },
      {
        '@type': 'Person', '@id': personId, name: 'Jacob Huber',
        url: url('/about/'), image: url('/images/portrait.jpeg'),
        jobTitle: 'Software engineer and website builder',
        sameAs: socialLinks.map((social) => social.href),
      },
      {
        '@type': 'WebPage', '@id': `${canonical.href}#webpage`,
        url: canonical.href, name: title, description, inLanguage: 'en-US',
        isPartOf: { '@id': websiteId }, author: { '@id': personId },
        ...(service ? { mainEntity: { '@id': `${canonical.href}#service` } } : {}),
      },
      ...(service ? [{
        '@type': 'Service', '@id': `${canonical.href}#service`,
        url: canonical.href, ...service, description,
        provider: { '@id': personId },
        areaServed: { '@type': 'Country', name: 'United States' },
      }] : []),
    ],
  };
}
