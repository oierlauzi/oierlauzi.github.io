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

  'date.ongoing': string;

  'cv.education': string;
  'cv.experience': string;
  'cv.internships': string;
  'cv.awards': string;
  'cv.skills': string;
  'cv.languages': string;
  'cv.volunteering': string;
  'cv.publications': string;

  'projects.research': string;
  'projects.independent': string;
  'projects.personal': string;
  'projects.contributions': string;
  'projects.components': string;
  'status.archived': string;
  'status.inDevelopment': string;

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

    'date.ongoing': 'Ongoing',

    'cv.education': 'Education',
    'cv.experience': 'Experience',
    'cv.internships': 'Scholarships and internships',
    'cv.awards': 'Awards',
    'cv.skills': 'Skills',
    'cv.languages': 'Languages',
    'cv.volunteering': 'Volunteering',
    'cv.publications': 'Publications',

    'projects.research': 'Research software',
    'projects.independent': 'Independent projects',
    'projects.personal': 'Personal projects',
    'projects.contributions': 'Contributions',
    'projects.components': 'Components',
    'status.archived': 'Archived',
    'status.inDevelopment': 'In development',

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

    'date.ongoing': 'Actualidad',

    'cv.education': 'Formación',
    'cv.experience': 'Experiencia',
    'cv.internships': 'Becas y prácticas',
    'cv.awards': 'Premios',
    'cv.skills': 'Competencias',
    'cv.languages': 'Idiomas',
    'cv.volunteering': 'Voluntariado',
    'cv.publications': 'Publicaciones',

    'projects.research': 'Software de investigación',
    'projects.independent': 'Proyectos independientes',
    'projects.personal': 'Proyectos personales',
    'projects.contributions': 'Contribuciones',
    'projects.components': 'Componentes',
    'status.archived': 'Archivado',
    'status.inDevelopment': 'En desarrollo',

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

    'date.ongoing': 'Gaur arte',

    'cv.education': 'Prestakuntza',
    'cv.experience': 'Esperientzia',
    'cv.internships': 'Bekak eta praktikak',
    'cv.awards': 'Sariak',
    'cv.skills': 'Gaitasunak',
    'cv.languages': 'Hizkuntzak',
    'cv.volunteering': 'Boluntariotza',
    'cv.publications': 'Argitalpenak',

    'projects.research': 'Ikerketa-softwarea',
    'projects.independent': 'Proiektu independenteak',
    'projects.personal': 'Proiektu pertsonalak',
    'projects.contributions': 'Ekarpenak',
    'projects.components': 'Osagaiak',
    'status.archived': 'Artxibatuta',
    'status.inDevelopment': 'Garapenean',

    'placeholder.note': 'Atal hau idazten ari da oraindik.',
  },
};

/** `const t = useTranslations(locale); t('nav.cv')` */
export function useTranslations(locale: Locale) {
  return function t(key: keyof UIStrings): string {
    return UI[locale][key];
  };
}
