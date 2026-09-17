import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const placeholderStoryRoutes = ['projects/krh-design-co', 'projects/vest-first-responder'];
const requiredRoutes = [
  '',
  'about',
  'experience',
  'projects',
  ...placeholderStoryRoutes,
  'services',
  'services/websites',
  'services/automation',
  'contact',
  '404',
];
const navigationRoutes = ['', 'about', 'experience', 'projects', 'services', 'contact'];
const urlAttributes = ['href', 'src', 'component-url', 'renderer-url'];
const errors = new Set();
let checkedReferences = 0;

function report(file, message) {
  errors.add(`${file}: ${message}`);
}

function decodeEntities(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const hex = entity.toLowerCase().startsWith('&#x');
    const codePoint = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
  });
}

function withoutInlineContent(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(?:script|style)\b[^>]*>)[\s\S]*?<\/(?:script|style)\s*>/gi, '$1');
}

// Inspect generated markup only; inline scripts and styles are not HTML links.
function parseTags(html) {
  const markup = withoutInlineContent(html);
  return [...markup.matchAll(/<([a-z][a-z\d:-]*)\b([^>]*?)>/gi)].map((match) => {
    const attributes = new Map();
    for (const attribute of match[2].matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      attributes.set(attribute[1].toLowerCase(), decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? ''));
    }
    return { name: match[1].toLowerCase(), attributes };
  });
}

function textContents(html, tag) {
  return [...withoutInlineContent(html).matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi'))]
    .map((match) => decodeEntities(match[1].replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim());
}

function structuredNodes(value) {
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(structuredNodes)];
}

function schemaTypes(node) {
  return [node['@type']].flat().filter((type) => typeof type === 'string');
}

function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let group;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (key === 'sitemap') sitemaps.push(value);
    if (key === 'user-agent') {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) {
      group.rules.push({ allow: key === 'allow', value });
    }
  }
  return { groups, sitemaps };
}

function blocksPath(rules, pathname) {
  const matches = rules.filter(({ value }) => {
    if (!value) return false;
    const end = value.endsWith('$') ? '$' : '';
    const pattern = value.replace(/\$$/, '').split('*')
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp(`^${pattern}${end}`).test(pathname);
  }).sort((a, b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow));
  return matches.length > 0 && !matches[0].allow;
}

function srcsetUrls(value) {
  const urls = [];
  let remainder = value.trim();
  while (remainder) {
    remainder = remainder.replace(/^[\s,]+/, '');
    if (!remainder) break;
    const match = /^\S+/.exec(remainder);
    const candidate = match[0];
    urls.push(candidate.replace(/,+$/, ''));
    remainder = remainder.slice(candidate.length);
    if (!candidate.endsWith(',')) {
      const separator = remainder.indexOf(',');
      remainder = separator < 0 ? '' : remainder.slice(separator + 1);
    }
  }
  return urls;
}

async function listFiles(directory, relativeDirectory = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const relative = path.posix.join(relativeDirectory, entry.name);
    if (/^\.env(?:\.|$)/i.test(entry.name)) {
      report('Build output', 'contains an environment file or directory.');
      continue;
    }
    if (entry.isSymbolicLink()) {
      report('Build output', 'contains a symbolic link instead of a static file.');
      continue;
    }
    if (entry.isDirectory()) {
      if (/^(?:blog|lapquest|api|family|psyduck-collection|missingcat)$/i.test(relative)) {
        report('Build output', 'contains a route deferred or excluded from this migration.');
      }
      result.push(...await listFiles(path.join(directory, entry.name), relative));
    } else if (entry.isFile()) {
      result.push(relative);
    }
  }
  return result;
}

async function verify() {
  const { default: config } = await import(new URL('../astro.config.mjs', import.meta.url));
  if (!config.site || config.output !== 'static') {
    throw new Error('Configure a site URL and static output before verifying the build.');
  }
  const site = new URL(config.site);
  const base = `/${(config.base ?? '/').replace(/^\/+|\/+$/g, '')}`.replace(/\/$/, '');
  const deploymentRoot = new URL(`${base}/`, site.origin);
  const dist = config.outDir instanceof URL
    ? fileURLToPath(config.outDir)
    : path.resolve(projectRoot, config.outDir ?? 'dist');
  const files = new Set(await listFiles(dist));
  const documents = new Map();

  for (const route of requiredRoutes) {
    const candidates = route === '404' ? ['404.html', '404/index.html'] : [path.posix.join(route, 'index.html')];
    if (!candidates.some((candidate) => files.has(candidate))) {
      report(route || 'Home', 'required page is missing from the static build.');
    }
  }

  for (const file of files) {
    if (/^(?:blog|lapquest|api|family|psyduck-collection|missingcat)(?:\/|\.html$|$)/i.test(file)) {
      report('Build output', 'contains a route deferred or excluded from this migration.');
    }
    if (!file.endsWith('.html')) continue;
    const html = await readFile(path.join(dist, file), 'utf8');
    const tags = parseTags(html);
    const navigationLinks = [...html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav\s*>/gi)]
      .flatMap((match) => parseTags(match[1]))
      .filter(({ name, attributes }) => name === 'a' && attributes.has('href'))
      .map(({ attributes }) => attributes.get('href'));
    const pagePath = file === '404.html' ? '404/' : file.replace(/index\.html$/, '');
    const noindex = tags.some(({ name, attributes }) => name === 'meta'
      && ['robots', 'googlebot', 'bingbot'].includes(attributes.get('name')?.toLowerCase())
      && /\b(?:noindex|none)\b/i.test(attributes.get('content') ?? ''));
    const jsonLd = [];
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      const attributes = parseTags(`<script${match[1]}>`)[0]?.attributes;
      if (attributes?.get('type')?.toLowerCase() !== 'application/ld+json') continue;
      try {
        const value = JSON.parse(match[2]);
        if (!value || typeof value !== 'object') throw new Error('Expected structured data.');
        jsonLd.push(value);
      } catch {
        report(file, 'contains invalid or empty JSON-LD.');
      }
    }
    documents.set(file, {
      tags,
      navigationLinks,
      noindex,
      titles: textContents(html, 'title'),
      headings: textContents(html, 'h1'),
      descriptions: tags.filter(({ name, attributes }) => name === 'meta'
        && attributes.get('name')?.toLowerCase() === 'description')
        .map(({ attributes }) => (attributes.get('content') ?? '').replace(/\s+/g, ' ').trim()),
      structuredData: jsonLd.flatMap(structuredNodes),
      url: new URL(pagePath, deploymentRoot),
      ids: new Set(tags.flatMap(({ name, attributes }) => [
        attributes.get('id'),
        name === 'a' ? attributes.get('name') : undefined,
      ]).filter(Boolean)),
    });
  }

  function resolveOutputFile(url) {
    const decodedPath = decodeURIComponent(url.pathname);
    if (base && decodedPath !== base && !decodedPath.startsWith(`${base}/`)) return undefined;
    const relative = decodedPath.slice(base.length).replace(/^\/+/, '');
    const candidates = [relative, path.posix.join(relative, 'index.html')];
    // Astro emits its custom 404 page as 404.html even with trailingSlash: always.
    if (relative === '404/') candidates.push('404.html');
    return candidates.find((candidate) => files.has(candidate));
  }

  function checkUrl(value, file, document, attribute, checkFragment = false) {
    let url;
    try {
      url = new URL(value, document.url);
    } catch {
      report(file, `${attribute} contains an invalid URL.`);
      return;
    }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== site.origin) return;
    checkedReferences += 1;
    if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) {
      report(file, `${attribute} escapes the configured GitHub Pages base path.`);
      return;
    }
    let target;
    try {
      target = resolveOutputFile(url);
    } catch {
      report(file, `${attribute} contains invalid URL encoding.`);
      return;
    }
    if (!target) {
      report(file, `${attribute} points to a missing local page or asset.`);
      return;
    }
    if (checkFragment && url.hash.length > 1 && !url.hash.startsWith('#:~:text=') && documents.has(target)) {
      let fragment;
      try {
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch {
        report(file, `${attribute} contains an invalid fragment.`);
        return;
      }
      if (!documents.get(target).ids.has(fragment)) {
        report(file, `${attribute} points to a missing page section.`);
      }
    }
  }

  const uniqueMetadata = { title: new Map(), description: new Map(), H1: new Map() };
  const contactForms = documents.get('contact/index.html')?.tags.filter(({ name }) => name === 'form') ?? [];
  if (contactForms.length !== (process.env.PUBLIC_CONTACT_ENDPOINT?.trim() ? 1 : 0)) {
    report('contact/index.html', 'must render exactly one enquiry form when its endpoint is configured, and use email otherwise.');
  }
  for (const [file, document] of documents) {
    const isNotFound = file === '404.html' || file === '404/index.html';
    const isPlaceholderStory = placeholderStoryRoutes.some((route) => file === `${route}/index.html`);
    if (isNotFound && !document.noindex) report(file, 'the not-found page must use noindex.');
    if (isPlaceholderStory && (!document.noindex || !document.ids.has('placeholder-story-notice'))) {
      report(file, 'placeholder stories must use noindex and include the visible placeholder notice.');
    }
    if (!isNotFound && !isPlaceholderStory && document.noindex) report(file, 'a content page is unexpectedly excluded from indexing.');
    const htmlTag = document.tags.find(({ name }) => name === 'html');
    if (!htmlTag?.attributes.get('lang')?.trim()) report(file, 'must declare the document language.');
    const viewports = document.tags.filter(({ name, attributes }) => name === 'meta' && attributes.get('name') === 'viewport');
    const viewport = viewports[0]?.attributes.get('content') ?? '';
    if (viewports.length !== 1 || !/\bwidth\s*=\s*device-width\b/i.test(viewport)
      || /\b(?:user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=)/i.test(viewport)) {
      report(file, 'must use a device-width viewport without restricting zoom.');
    }
    const mainTags = document.tags.filter(({ name }) => name === 'main');
    if (mainTags.length !== 1 || mainTags[0].attributes.get('id') !== 'main-content'
      || mainTags[0].attributes.get('tabindex') !== '-1'
      || !document.tags.some(({ name, attributes }) => name === 'a' && attributes.get('href') === '#main-content')) {
      report(file, 'must provide one focusable main landmark and a skip link to it.');
    }
    for (const [label, values] of [['title', document.titles], ['description', document.descriptions], ['H1', document.headings]]) {
      if (values.length !== 1 || !values[0]) {
        report(file, `must have exactly one nonempty ${label}.`);
        continue;
      }
      const key = values[0].toLowerCase();
      const previous = uniqueMetadata[label].get(key);
      if (previous) report(file, `${label} duplicates ${previous}.`);
      uniqueMetadata[label].set(key, file);
    }
    const navigationUrls = new Set(document.navigationLinks.map((href) => {
      try {
        const url = new URL(href, document.url);
        return url.origin + url.pathname;
      } catch {
        return undefined;
      }
    }));
    for (const route of navigationRoutes) {
      const expected = new URL(route ? `${route}/` : '', deploymentRoot);
      if (!navigationUrls.has(expected.origin + expected.pathname)) {
        report(file, `Navigation is missing a link to ${expected.pathname}.`);
      }
    }
    const canonicalUrls = [];
    const openGraphUrls = [];
    const seenIds = new Set();
    for (const { name, attributes } of document.tags) {
      if (attributes.has('id')) {
        const id = attributes.get('id');
        if (!id || seenIds.has(id)) report(file, 'contains an empty or duplicate element ID.');
        seenIds.add(id);
      }
      for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls', ...(name === 'label' ? ['for'] : [])]) {
        if (attributes.has(attribute) && attributes.get(attribute).split(/\s+/).some((id) => !document.ids.has(id))) {
          report(file, `${attribute} refers to a missing element.`);
        }
      }
      if (name === 'img') {
        if (!attributes.has('alt')) report(file, 'images must have an alt attribute (empty for decorative images).');
        if (!(Number(attributes.get('width')) > 0 && Number(attributes.get('height')) > 0)) {
          report(file, 'images must reserve space with positive width and height attributes.');
        }
        if (Number(attributes.get('width')) > 320 && (!attributes.get('srcset') || !attributes.get('sizes'))) {
          report(file, 'large images must provide responsive srcset and sizes attributes.');
        }
      }
      if (!document.noindex && name === 'meta'
        && ['robots', 'googlebot', 'bingbot'].includes(attributes.get('name')?.toLowerCase())
        && /\b(?:nosnippet|max-snippet\s*:\s*0)\b/i.test(attributes.get('content') ?? '')) {
        report(file, 'indexable pages must remain eligible for search snippets.');
      }
      if (name === 'form' && (file !== 'contact/index.html'
        || attributes.get('id') !== 'contact-form'
        || attributes.get('method') !== 'post'
        || attributes.get('action') !== process.env.PUBLIC_CONTACT_ENDPOINT?.trim())) {
        report(file, 'contains an unexpected form or an unconfigured contact endpoint.');
      }
      if (name === 'base') report(file, 'contains an HTML base tag that changes local URL resolution.');
      for (const attribute of urlAttributes) {
        if (attributes.has(attribute)) {
          checkUrl(attributes.get(attribute), file, document, attribute, name === 'a' && attribute === 'href');
        }
      }
      if (attributes.has('srcset')) {
        for (const value of srcsetUrls(attributes.get('srcset'))) checkUrl(value, file, document, 'srcset');
      }
      if (name === 'link' && attributes.get('rel')?.split(/\s+/).includes('canonical')) {
        canonicalUrls.push(attributes.get('href'));
      }
      if (name === 'meta' && attributes.get('property') === 'og:url') {
        openGraphUrls.push(attributes.get('content'));
      }
      if (name === 'meta' && ['og:image', 'twitter:image'].includes(attributes.get('property') ?? attributes.get('name'))) {
        checkUrl(attributes.get('content') ?? '', file, document, 'social image');
      }
    }
    for (const [label, urls] of [['Canonical URL', canonicalUrls], ['Open Graph URL', openGraphUrls]]) {
      if (urls.length !== 1 || urls[0] !== document.url.href) {
        report(file, `${label} must match this page at the configured site and base path.`);
      }
    }

    const nodes = document.structuredData;
    const definitions = new Map(nodes.filter((node) => node['@id'] && node['@type']).map((node) => [node['@id'], node]));
    const pageNodes = nodes.filter((node) => schemaTypes(node).includes('WebPage'));
    if (!document.noindex && (pageNodes.length !== 1 || pageNodes[0].url !== document.url.href)) {
      report(file, 'JSON-LD must describe this canonical WebPage.');
    }
    for (const pageNode of pageNodes) {
      if (pageNode.mainEntity && !definitions.has(pageNode.mainEntity['@id'])) {
        report(file, 'JSON-LD WebPage must link to a defined main entity.');
      }
    }
    for (const node of nodes) {
      const types = schemaTypes(node);
      if (types.includes('BreadcrumbList')) {
        const items = node.itemListElement;
        if (!Array.isArray(items) || items.length < 2
          || items.some((item, index) => item.position !== index + 1 || typeof item.name !== 'string' || !item.name.trim())
          || items.at(-1)?.item !== document.url.href) {
          report(file, 'JSON-LD breadcrumbs must have ordered, named steps ending at this page.');
        }
      }
      if (types.includes('WebPage') && node.breadcrumb
        && !schemaTypes(definitions.get(node.breadcrumb['@id']) ?? {}).includes('BreadcrumbList')) {
        report(file, 'JSON-LD WebPage must link to its defined breadcrumb trail.');
      }
      if (types.some((type) => ['WebSite', 'WebPage', 'Person', 'Organization', 'Service'].includes(type))) {
        for (const key of ['@id', 'url']) {
          if (!node[key] && key === 'url' && !types.includes('WebPage')) continue;
          try {
            if (typeof node[key] !== 'string' || new URL(node[key]).origin !== site.origin) throw new Error('Wrong origin.');
            checkUrl(node[key], file, document, `JSON-LD ${key}`);
          } catch {
            report(file, `JSON-LD ${types.join('/')} ${key} must use the configured site origin.`);
          }
        }
      }
      if (types.includes('ListItem') && typeof node.item === 'string') {
        try {
          if (new URL(node.item).origin !== site.origin) throw new Error('Wrong origin.');
          checkUrl(node.item, file, document, 'JSON-LD breadcrumb');
        } catch {
          report(file, 'JSON-LD breadcrumb must use the configured site origin.');
        }
      }
      if (types.includes('Service')) {
        const provider = definitions.get(node.provider?.['@id']);
        if (!provider || !schemaTypes(provider).some((type) => ['Person', 'Organization'].includes(type))
          || typeof provider.name !== 'string' || !provider.name.trim()) {
          report(file, 'JSON-LD Service must link to a named Person or Organization provider in the graph.');
        }
      }
    }
  }

  const indexableUrls = new Set([...documents.values()].filter((document) => !document.noindex).map((document) => document.url.href));
  if (!files.has('sitemap.xml')) {
    report('sitemap.xml', 'is missing from the static build.');
  } else {
    const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
    const locations = [...sitemap.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)]
      .map((match) => decodeEntities(match[1].trim()));
    if (!/<urlset\b[^>]*\bxmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(sitemap)) {
      report('sitemap.xml', 'must be a sitemap URL set with the standard namespace.');
    }
    if (new Set(locations).size !== locations.length) report('sitemap.xml', 'contains duplicate URLs.');
    for (const url of locations) {
      if (!indexableUrls.has(url)) report('sitemap.xml', `contains a noncanonical, missing, or noindex page: ${url}`);
    }
    for (const url of indexableUrls) {
      if (!locations.includes(url)) report('sitemap.xml', `is missing indexable page ${url}`);
    }
  }
  if (!files.has('robots.txt')) {
    report('robots.txt', 'is missing from the static build.');
  } else {
    const robots = parseRobots(await readFile(path.join(dist, 'robots.txt'), 'utf8'));
    const expectedSitemap = new URL('sitemap.xml', deploymentRoot).href;
    if (!robots.sitemaps.includes(expectedSitemap)) report('robots.txt', 'must reference the canonical sitemap URL.');
    if (!robots.groups.some((group) => group.agents.includes('*'))) report('robots.txt', 'must declare public crawler access with User-agent: *.');
    const crawlPaths = [...files].map((file) => new URL(file.replace(/index\.html$/, ''), deploymentRoot).pathname);
    for (const group of robots.groups.filter((group) => group.agents.some((agent) => ['*', 'googlebot', 'bingbot'].includes(agent)))) {
      if (crawlPaths.some((pathname) => blocksPath(group.rules, pathname))) {
        report('robots.txt', `blocks published pages or assets for ${group.agents.join(', ')}.`);
      }
    }
  }

  if (errors.size) {
    console.error(`Static build verification failed (${errors.size} issue${errors.size === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Static build verified: ${documents.size} pages and ${checkedReferences} local links/assets; navigation, sitemap, crawl rules, metadata, JSON-LD, accessible markup, responsive images, excluded routes, and output hygiene checked.`);
}

verify().catch(() => {
  console.error('Static build verification could not finish. Check the Astro configuration and dependencies, then run the build before verification.');
  process.exitCode = 1;
});
