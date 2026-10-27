import type { Locale } from './locales';

/**
 * Every user-facing string that is not content.
 *
 * Declaring the shape as an interface and typing the table as
 * `Record<Locale, UIStrings>` means omitting a single Basque or Spanish string
 * is a type error, not a silently-English page. This is the main thing the
 * trilingual setup is meant to prevent.
 *
 * Seeded from the previous site's `src/locales/{en,es,eus}.json`.
 */
export interface UIStrings {
  'nav.home': string;
  'nav.about': string;
  'nav.cv': string;
  'nav.publications': string;
  'nav.projects': string;
  'nav.contact': string;

  'site.role': string;

  'a11y.skipToContent': string;
  'a11y.languageSwitcher': string;
  'a11y.currentLanguage': string;

  'action.download': string;
  'action.share': string;
  'action.copy': string;

  'notFound.title': string;
  'notFound.message': string;
  'notFound.home': string;

  'footer.source': string;

  /** Temporary, until each section has real content. */
  'placeholder.note': string;
}

export const UI: Record<Locale, UIStrings> = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About me',
    'nav.cv': 'CV',
    'nav.publications': 'Publications',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',

    'site.role': 'PhD candidate, Biocomputing Unit, CNB-CSIC',

    'a11y.skipToContent': 'Skip to content',
    'a11y.languageSwitcher': 'Language',
    'a11y.currentLanguage': 'Current language',

    'action.download': 'Download',
    'action.share': 'Share',
    'action.copy': 'Copy',

    'notFound.title': 'Not found',
    'notFound.message':
      'Ensure that you correctly typed the address. It is also possible that the page may be under construction.',
    'notFound.home': 'Go to the homepage',

    'footer.source': 'Source on GitHub',

    'placeholder.note': 'This section is still being written.',
  },

  es: {
    'nav.home': 'Portal',
    'nav.about': 'Sobre mí',
    'nav.cv': 'CV',
    'nav.publications': 'Publicaciones',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',

    'site.role': 'Doctorando, Unidad de Biocomputación, CNB-CSIC',

    'a11y.skipToContent': 'Saltar al contenido',
    'a11y.languageSwitcher': 'Idioma',
    'a11y.currentLanguage': 'Idioma actual',

    'action.download': 'Descargar',
    'action.share': 'Compartir',
    'action.copy': 'Copiar',

    'notFound.title': 'No encontrado',
    'notFound.message':
      'Asegúrese de que ha introducido la dirección correctamente. También es posible que la página se encuentre en proceso de desarrollo.',
    'notFound.home': 'Ir al portal',

    'footer.source': 'Código en GitHub',

    'placeholder.note': 'Esta sección todavía se está escribiendo.',
  },

  eu: {
    'nav.home': 'Ataria',
    'nav.about': 'Niri buruz',
    'nav.cv': 'CV',
    'nav.publications': 'Argitalpenak',
    'nav.projects': 'Proiektuak',
    'nav.contact': 'Kontaktua',

    'site.role': 'Doktoregaia, Biokonputazio Unitatea, CNB-CSIC',

    'a11y.skipToContent': 'Edukira joan',
    'a11y.languageSwitcher': 'Hizkuntza',
    'a11y.currentLanguage': 'Uneko hizkuntza',

    'action.download': 'Deskargatu',
    'action.share': 'Partekatu',
    'action.copy': 'Kopiatu',

    'notFound.title': 'Ez da aurkitu',
    'notFound.message':
      'Ziurtatu sartutako helbidea zuzena dela. Baliteke orri hau garapen prozesuan egotea ere.',
    'notFound.home': 'Atarira joan',

    'footer.source': 'Iturburu-kodea GitHuben',

    'placeholder.note': 'Atal hau idazten ari da oraindik.',
  },
};

/** `const t = useTranslations(locale); t('nav.cv')` */
export function useTranslations(locale: Locale) {
  return function t(key: keyof UIStrings): string {
    return UI[locale][key];
  };
}
