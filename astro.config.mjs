import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://huberbuilds.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
});
