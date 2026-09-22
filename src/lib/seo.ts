import { socialLinks } from '../data/socials';

// Keep discovery and structured data aligned with the public pages.
export const publicPages = [
  { path: '/', name: 'Home' },
  { path: '/services/', name: 'Services' },
  { path: '/services/websites/', name: 'Business websites' },
  { path: '/services/automation/', name: 'Workflow automation' },
  { path: '/projects/', name: 'My work' },
  { path: '/projects/krh-design-co/', name: 'KRH Design Co. project story' },
  { path: '/projects/vest-first-responder/', name: 'VEST First Responder project story' },
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
  const businessId = url('/#huber-builds');
  const websiteId = url('/#website');
  const service = services[canonical.pathname];
  const page = publicPages.find((entry) => entry.path === canonical.pathname);
  const pageType = canonical.pathname === '/about/' ? 'AboutPage'
    : canonical.pathname === '/contact/' ? 'ContactPage' : undefined;
  const mainEntityId = service ? `${canonical.href}#service`
    : pageType === 'AboutPage' ? personId
    : pageType === 'ContactPage' || canonical.pathname === '/' ? businessId : undefined;
  const areaServed = [
    { '@type': 'City', name: 'Edwardsville, Illinois' },
    { '@type': 'Place', name: 'St. Louis area' },
    { '@type': 'Country', name: 'United States' },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': websiteId,
        url: url('/'), name: 'Huber Builds', alternateName: 'Jacob Huber',
        inLanguage: 'en-US', publisher: { '@id': businessId },
      },
      {
        '@type': 'Organization', '@id': businessId,
        name: 'Huber Builds', url: url('/'),
        description: 'Business website design, redesign, optional website care, and workflow automation by Jacob Huber. Based in Edwardsville, Illinois, serving the St. Louis area and clients across the United States.',
        email: 'jhuber.mail@icloud.com',
        founder: { '@id': personId },
        areaServed,
      },
      {
        '@type': 'Person', '@id': personId, name: 'Jacob Huber',
        url: url('/about/'), image: url('/images/portrait.jpeg'),
        jobTitle: 'Software engineer and website builder',
        sameAs: socialLinks.map((social) => social.href),
      },
      {
        '@type': pageType ? ['WebPage', pageType] : 'WebPage', '@id': `${canonical.href}#webpage`,
        url: canonical.href, name: title, description, inLanguage: 'en-US',
        isPartOf: { '@id': websiteId }, author: { '@id': personId },
        ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
        ...(service ? {
          breadcrumb: { '@id': `${canonical.href}#breadcrumb` },
        } : {}),
      },
      ...(service ? [{
        '@type': 'Service', '@id': `${canonical.href}#service`,
        url: canonical.href, ...service, description,
        provider: { '@id': businessId },
        areaServed,
      }, {
        '@type': 'BreadcrumbList', '@id': `${canonical.href}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: url('/') },
          { '@type': 'ListItem', position: 2, name: 'Services', item: url('/services/') },
          { '@type': 'ListItem', position: 3, name: page?.name ?? service.name, item: canonical.href },
        ],
      }] : []),
    ],
  };
}
