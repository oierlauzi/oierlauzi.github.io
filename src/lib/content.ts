import { getEntry } from 'astro:content';
import { LOCALES, type Locale } from '../i18n/locales';

/**
 * Fetches a prose page, failing the build when a language is missing.
 *
 * `localized()` makes a missing translation a *type* error for YAML data, but
 * prose lives in one Markdown file per language, where an absent file is simply
 * an absent collection entry and `getEntry()` quietly returns `undefined`. That
 * would render an empty page rather than failing. This restores the same
 * guarantee for prose, and names the exact missing path.
 */
export async function getPage(locale: Locale, slug: string) {
  const id = `${locale}/${slug}`;
  const entry = await getEntry('pages', id);

  if (!entry) {
    throw new Error(
      `Missing src/content/pages/${id}.md — every prose page must exist in all ` +
        `${LOCALES.length} languages (${LOCALES.join(', ')}).`
    );
  }

  return entry;
}
