/** Prefix a local path for GitHub Pages project hosting. Leave external URLs alone. */
export function withBase(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const local = `/${path.replace(/^\/+/, '')}`;
  if (base && (local === base || local.startsWith(`${base}/`))) return local;
  return `${base}${local}`;
}
