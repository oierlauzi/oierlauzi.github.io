import { LOCALES, type Locale } from './locales';

/**
 * Route key -> URL segment, per locale.
 *
 * The segments are deliberately identical across locales for now, so URLs read
 * the same in every language (`/eu/cv`, `/es/cv`, `/en/cv`). Every link in the
 * site is built through `localePath()` rather than hard-coded, so translating a
 * slug later (`/eu/curriculuma`) is an edit to this table and nothing else.
 */
export const ROUTES = {
  home: { en: '', es: '', eu: '' },
  about: { en: 'about', es: 'about', eu: 'about' },
  cv: { en: 'cv', es: 'cv', eu: 'cv' },
  publications: { en: 'publications', es: 'publications', eu: 'publications' },
  projects: { en: 'projects', es: 'projects', eu: 'projects' },
  contact: { en: 'contact', es: 'contact', eu: 'contact' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

/** Route keys in the order they appear in the main navigation. */
export const NAV_ORDER = ['about', 'cv', 'publications', 'projects', 'contact'] as const satisfies readonly RouteKey[];

/**
 * Builds an absolute-from-root path for a route in a given locale.
 * Always ends in a trailing slash, matching Astro's default `trailingSlash`
 * behaviour, so no link produces a redirect hop on GitHub Pages.
 */
export function localePath(locale: Locale, key: RouteKey, ...rest: string[]): string {
  const parts = [locale, ROUTES[key][locale], ...rest].filter((part) => part !== '');
  return `/${parts.join('/')}/`;
}

/** The same page in every locale — used to emit `hreflang` alternates. */
export function alternates(key: RouteKey, ...rest: string[]): Array<{ locale: Locale; path: string }> {
  return LOCALES.map((locale) => ({ locale, path: localePath(locale, key, ...rest) }));
}
