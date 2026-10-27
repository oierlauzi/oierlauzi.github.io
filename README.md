# oierlauzi.github.io

Personal site and CV of Oier Lauzirika Zarrabeitia, published in Basque,
Spanish and English at <https://oierlauzi.github.io>.

Built with [Astro](https://astro.build). Static output, no client-side
framework, no CSS framework.

## Running it

Requires Node 22.23.4 or newer (`.nvmrc` pins 24).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve the built site
npm run check    # type-check, including translation completeness
```

## How the three languages work

Every page lives in `src/pages/[lang]/` and is generated once per locale by
`getStaticPaths`, so the three language versions of a page cannot drift apart —
there is only one template.

- `src/i18n/locales.ts` — the locale list (`en`, `es`, `eu`) and their metadata.
- `src/i18n/ui.ts` — every string that is not content. The table is typed as
  `Record<Locale, UIStrings>`, so **omitting a translation is a type error**,
  not a silently-English page. `npm run check` is what catches it.
- `src/i18n/routes.ts` — route key to URL segment, per locale. Links are never
  hard-coded; they go through `localePath()`. Segments are identical across
  locales today, so translating a slug later is an edit to that one table.

`/` is not a page in any language. It is a chooser that redirects using the
visitor's browser languages (remembering the choice in `localStorage`), and
falls back to three visible links when JavaScript is unavailable. It is
`noindex` and excluded from the sitemap; `hreflang="x-default"` points at `/en/`.

`404.astro` builds to `/404.html`, which GitHub Pages serves for every unmatched
path in every language. It renders all three languages and keeps only the one
matching the attempted URL.

## Styling

`src/styles/tokens.css` holds every colour, type step and spacing value; nothing
downstream hard-codes them. Dark mode re-declares the same token names. Fonts
are self-hosted variable `woff2` files in `public/fonts/`, committed rather than
pulled from npm or a CDN — they never need upgrading, and nothing is fetched
from a third party at page load.
