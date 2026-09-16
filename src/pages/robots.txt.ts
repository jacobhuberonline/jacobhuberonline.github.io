import type { APIRoute } from 'astro';
import { withBase } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set the public site URL before generating crawl rules.');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(withBase('/sitemap.xml'), site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
