import type { APIRoute } from 'astro';
import { publicPages } from '../lib/seo';
import { withBase } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set the public site URL before generating the sitemap.');
  const entries = publicPages.map(({ path }) => {
    const location = new URL(withBase(path), site).href.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `  <url><loc>${location}</loc></url>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
