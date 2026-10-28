// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Repo is `oierlauzi.github.io`, so GitHub Pages serves it from the domain
  // root. No `base` is needed (and setting one would break every link).
  site: 'https://oierlauzi.github.io',

  // Every internal link is generated with a trailing slash, so this avoids a
  // redirect hop on GitHub Pages.
  trailingSlash: 'always',

  i18n: {
    locales: ['en', 'es', 'eu'],
    defaultLocale: 'en',
    routing: {
      // All three languages are prefixed; no language is privileged in the URL.
      prefixDefaultLocale: true,
      // `/` is our own language splash, not an automatic redirect to /en/.
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es', eu: 'eu' },
      },
      // The root splash is noindex; keep it out of the sitemap too.
      filter: (page) => page !== 'https://oierlauzi.github.io/',
    }),
  ],
});
