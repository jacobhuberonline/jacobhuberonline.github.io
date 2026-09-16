import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://jacobhuberonline.github.io',
  base: '/personal-site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
});
