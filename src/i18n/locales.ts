/**
 * The three languages the site is published in.
 *
 * Codes are BCP-47. The previous version of this site used `eus` for Basque;
 * `eu` is the correct two-letter code and is what browsers and search engines
 * expect in `lang` and `hreflang` attributes.
 */
export const LOCALES = ['en', 'es', 'eu'] as const;

export type Locale = (typeof LOCALES)[number];

/** Used for `hreflang="x-default"` and as the fallback when detection fails. */
export const DEFAULT_LOCALE: Locale = 'en';

interface LocaleMeta {
  /** Language name written in that language, for the switcher. */
  readonly label: string;
  /** Language name in English, for `title`/`aria-label` on the switcher. */
  readonly englishName: string;
  /** Passed to `Intl` for date formatting. */
  readonly intlTag: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { label: 'English', englishName: 'English', intlTag: 'en-GB' },
  es: { label: 'Castellano', englishName: 'Spanish', intlTag: 'es-ES' },
  eu: { label: 'Euskara', englishName: 'Basque', intlTag: 'eu-ES' },
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

/**
 * Narrows `Astro.params.lang` to a `Locale`, throwing on anything else.
 * Every `[lang]` route builds only the paths returned by `getStaticPaths`, so
 * reaching the throw means a route was added without wiring up its paths.
 */
export function assertLocale(value: string | undefined): Locale {
  if (!isLocale(value)) {
    throw new Error(`Unknown locale "${value}". Expected one of: ${LOCALES.join(', ')}`);
  }
  return value;
}
