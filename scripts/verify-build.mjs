import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const requiredRoutes = [
  '',
  'about',
  'projects',
  'contact',
  'family/baby',
  'family/schedule',
  'psyduck-collection',
  'missingcat',
  '404',
];
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

// Inspect generated markup only; inline scripts and styles are not HTML links.
function parseTags(html) {
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(?:script|style)\b[^>]*>)[\s\S]*?<\/(?:script|style)\s*>/gi, '$1');
  return [...markup.matchAll(/<([a-z][a-z\d:-]*)\b([^>]*?)>/gi)].map((match) => {
    const attributes = new Map();
    for (const attribute of match[2].matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      attributes.set(attribute[1].toLowerCase(), decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4] ?? ''));
    }
    return { name: match[1].toLowerCase(), attributes };
  });
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
      if (/^(?:blog|lapquest|api)$/i.test(relative)) {
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
    if (/^(?:blog|lapquest|api)(?:\/|\.html$|$)/i.test(file)) {
      report('Build output', 'contains a route deferred or excluded from this migration.');
    }
    if (!file.endsWith('.html')) continue;
    const tags = parseTags(await readFile(path.join(dist, file), 'utf8'));
    const pagePath = file === '404.html' ? '404/' : file.replace(/index\.html$/, '');
    documents.set(file, {
      tags,
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

  for (const [file, document] of documents) {
    const redirect = file === 'family/schedule/index.html';
    const canonicalUrls = [];
    const openGraphUrls = [];
    let redirectUrl;
    for (const { name, attributes } of document.tags) {
      if (name === 'form') report(file, 'contains a form before form handling is implemented.');
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
      if (name === 'meta' && attributes.get('http-equiv')?.toLowerCase() === 'refresh') {
        redirectUrl = /(?:^|;)\s*url\s*=\s*["']?([^"']+)/i.exec(attributes.get('content') ?? '')?.[1]?.trim();
      }
    }
    if (redirect) {
      const expected = new URL('family/baby/', deploymentRoot).href;
      if (!redirectUrl || new URL(redirectUrl, document.url).href !== expected) {
        report(file, 'redirect does not point to the baby schedule under the configured base path.');
      } else {
        checkUrl(redirectUrl, file, document, 'redirect');
      }
    } else {
      for (const [label, urls] of [['Canonical URL', canonicalUrls], ['Open Graph URL', openGraphUrls]]) {
        if (urls.length !== 1 || urls[0] !== document.url.href) {
          report(file, `${label} must match this page at the configured site and base path.`);
        }
      }
    }
  }

  if (errors.size) {
    console.error(`Static build verification failed (${errors.size} issue${errors.size === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Static build verified: ${documents.size} pages and ${checkedReferences} local links/assets; excluded routes, metadata, redirect, and output hygiene checked.`);
}

verify().catch(() => {
  console.error('Static build verification could not finish. Check the Astro configuration and dependencies, then run the build before verification.');
  process.exitCode = 1;
});
