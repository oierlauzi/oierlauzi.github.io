/** Site-wide constants: identity, canonical URLs, external profiles. */

export const SITE = {
  url: 'https://oierlauzi.github.io',
  repo: 'https://github.com/oierlauzi/oierlauzi.github.io',
} as const;

export const PERSON = {
  /** Full legal name, used for the page title and JSON-LD. */
  fullName: 'Oier Lauzirika Zarrabeitia',

  givenName: 'Oier',
  familyName: 'Lauzirika Zarrabeitia',

  /**
   * Preferred academic signature. Author lists are normalised to this on
   * render, so the site shows one consistent identity regardless of how each
   * publisher deposited the name in Crossref.
   */
  signature: 'O. L. Zarrabeitia',

  /**
   * Every form this person's name appears in across publication metadata.
   * Used to detect "this author is me" so the entry can be normalised to
   * `signature` and emphasised. Crossref splits the surname inconsistently
   * between publishers, so a single string comparison is not enough —
   * `10.1107/s2059798325007831` records "O. Lauzirika" while
   * `10.1109/isbi56570.2024.10635352` records "Zarrabeitia".
   *
   * Compared case-insensitively after stripping punctuation and whitespace,
   * and always on given + family together. Surname-only forms are deliberately
   * absent: a bare "Zarrabeitia" would also match an unrelated author with
   * the same surname. Every Crossref record for these papers carries a given
   * name, so nothing is lost.
   */
  nameVariants: [
    'O. L. Zarrabeitia',
    'O.L. Zarrabeitia',
    'Oier Lauzirika Zarrabeitia',
    'O. Lauzirika Zarrabeitia',
    'O. Lauzirika',
    'Oier Lauzirika',
  ],

  orcid: '0009-0003-7908-180X',
  github: 'oierlauzi',

  /**
   * Split so the full address never appears as one string in the HTML.
   * The contact page joins these client-side into a real `mailto:` link and
   * shows "user [at] domain" when JavaScript is unavailable — readable by a
   * person, marginally more work for a naive harvester. It is light cover, not
   * real protection: anything that executes JavaScript will still read it.
   */
  email: { user: 'olauzirika', domain: 'cnb.csic.es' },

  affiliation: {
    unit: 'Biocomputing Unit',
    institution: 'Centro Nacional de Biotecnología (CNB-CSIC)',
    city: 'Madrid',
    country: 'Spain',
  },
} as const;

export const PROFILE_URLS = {
  orcid: `https://orcid.org/${PERSON.orcid}`,
  github: `https://github.com/${PERSON.github}`,
} as const;
