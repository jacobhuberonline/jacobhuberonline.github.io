import { readFile } from 'node:fs/promises';

const site = new URL('https://huberbuilds.com');
const keyFilename = 'c082c2729ebfb4e80368a0f58f3542d2.txt';
const sitemapUrl = new URL('/sitemap.xml', site);
const keyUrl = new URL(`/${keyFilename}`, site);
const endpoint = 'https://api.indexnow.org/indexnow';
const timeoutMs = 15_000;

async function readLiveText(url, label) {
  try {
    const response = await fetch(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    throw new Error(`Could not read ${label} at ${url}: ${error.message}. Deploy the site and confirm this URL is reachable without redirects.`);
  }
}

function decodeXml(value) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (!entity.startsWith('#')) return entities[entity.toLowerCase()];
    const hex = entity.toLowerCase().startsWith('#x');
    return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
  });
}

function sitemapUrls(xml) {
  const markup = xml.replace(/<!--[\s\S]*?-->/g, '');
  if (!/<urlset\b[^>]*>/.test(markup) || !/<\/urlset\s*>/.test(markup) || /<sitemapindex\b/.test(markup)) {
    throw new Error('Expected sitemap.xml to contain a simple <urlset>, not a sitemap index.');
  }
  const entries = [...markup.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url\s*>/g)];
  if (!entries.length || entries.length !== (markup.match(/<url\b/g) ?? []).length) {
    throw new Error('The live sitemap has no URLs or contains incomplete <url> entries.');
  }
  const urls = entries.map((entry) => {
    const locations = [...entry[1].matchAll(/<loc\b[^>]*>([^<]*)<\/loc\s*>/g)];
    if (locations.length !== 1) throw new Error('Each sitemap entry must contain exactly one <loc> URL.');
    const value = decodeXml(locations[0][1].trim());
    let url;
    try {
      url = new URL(value);
    } catch {
      throw new Error(`Invalid absolute URL in sitemap: ${value}`);
    }
    if (url.origin !== site.origin || url.username || url.password || url.hash) {
      throw new Error(`Sitemap URL must use ${site.origin} with no credentials or fragment: ${value}`);
    }
    return url.href;
  });
  const uniqueUrls = [...new Set(urls)];
  if (uniqueUrls.length > 10_000) throw new Error('IndexNow accepts at most 10,000 URLs per submission. Split this sitemap before submitting.');
  return uniqueUrls;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--dry-run')) {
    throw new Error('Usage: node scripts/submit-indexnow.mjs [--dry-run]');
  }
  const key = (await readFile(new URL(`../public/${keyFilename}`, import.meta.url), 'utf8')).trim();
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key) || keyFilename !== `${key}.txt`) {
    throw new Error('The local IndexNow key must match its filename and contain 8–128 letters, numbers, or hyphens.');
  }
  const [xml, liveKey] = await Promise.all([
    readLiveText(sitemapUrl, 'sitemap'),
    readLiveText(keyUrl, 'IndexNow key'),
  ]);
  if (liveKey.trim() !== key) throw new Error('The live IndexNow key does not match the local key. Deploy the key file before submitting.');
  const urlList = sitemapUrls(xml);
  if (args.includes('--dry-run')) {
    console.log(`Dry run: validated the live key and ${urlList.length} sitemap URLs. No IndexNow submission sent.`);
    for (const url of urlList) console.log(url);
    return;
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      redirect: 'error',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: site.host, key, keyLocation: keyUrl.href, urlList }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new Error(`IndexNow submission could not be confirmed: ${error.message}. Check connectivity before retrying; the request may have been received.`);
  }
  if (response.status === 200 || response.status === 202) {
    const status = response.status === 202 ? 'Key validation is pending.' : 'Submission received.';
    console.log(`IndexNow accepted ${urlList.length} URLs. ${status} Acceptance does not guarantee indexing.`);
    return;
  }
  const explanations = {
    400: 'Check the request format.',
    403: 'Confirm the deployed key file is public and contains the expected key.',
    422: 'Check that all submitted URLs and the key belong to the configured host.',
    429: 'Rate limited. Wait before retrying; avoid repeated submissions.',
  };
  throw new Error(`IndexNow returned HTTP ${response.status}. ${explanations[response.status] ?? 'Check the IndexNow service status before retrying.'}`);
}

main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
