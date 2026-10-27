import { LOCALES } from './locales';

/**
 * `getStaticPaths` for every `[lang]` route: one build per language.
 *
 * Keeping all three locales on a single page file is the point — the three
 * language versions of a page cannot drift apart, because there is only one
 * template.
 */
export function localePaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}
