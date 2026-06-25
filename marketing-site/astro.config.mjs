import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jbdigitalsystem.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Inclui a homepage do apex na sitemap (para Search Console)
      customPages: ['https://jbdigitalsystem.com/'],
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
