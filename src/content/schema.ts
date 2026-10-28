import { z } from 'astro/zod';
import { LOCALES, type Locale } from '../i18n/locales';

type LocalizedShape<T extends z.ZodType> = { [K in Locale]: T };

/**
 * A value that must be present in all three languages.
 *
 * This is the centrepiece of the trilingual setup: because every locale key is
 * required, omitting the Basque variant of a job title is a build failure, not a
 * page that silently falls back to English. The cast is sound — `LOCALES` is
 * exactly `readonly Locale[]`.
 */
export const localized = <T extends z.ZodType>(inner: T) =>
  z.object(Object.fromEntries(LOCALES.map((l) => [l, inner])) as LocalizedShape<T>);

export type Localized<T> = Record<Locale, T>;

/**
 * `YYYY` or `YYYY-MM`.
 *
 * Both granularities are real in this CV: degrees have months ("Sep. 2021 -
 * Jul. 2023") while awards only have years ("2019"). Storing a full `Date`
 * would invent a precision the source does not have, and would drag timezones
 * into what is really just a label.
 */
export const partialDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'Expected YYYY or YYYY-MM');

/** `end: null` means ongoing. */
export const period = z.object({
  start: partialDate,
  end: partialDate.nullable().default(null),
});

export type Period = z.infer<typeof period>;

/**
 * Shared by `education`, `experience`, `internships` and `volunteering` —
 * four collections for the price of one schema.
 *
 * Organisation names are proper nouns and stay untranslated; titles, bullets
 * and distinctions are localized.
 */
export const positionSchema = z.object({
  title: localized(z.string()),
  organisation: z.string(),
  unit: z.string().optional(),
  location: z.string().optional(),
  period,
  /** Honours and distinctions — rendered without bullet markers. */
  distinctions: z.array(localized(z.string())).default([]),
  /** What the role involved. */
  bullets: z.array(localized(z.string())).default([]),
  url: z.url().optional(),

  /* The web CV shows everything; these two trim the PDF. */
  inPdf: z.boolean().default(true),
  /** Cap on bullets in the PDF. Omit for all of them. */
  pdfBullets: z.number().int().nonnegative().optional(),
});
