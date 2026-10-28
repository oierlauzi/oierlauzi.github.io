import { LOCALE_META, type Locale } from '../i18n/locales';
import type { Period } from '../content/schema';

interface ParsedDate {
  year: number;
  /** 1-12, or undefined when the source only gave a year. */
  month?: number;
}

function parse(value: string): ParsedDate {
  const [year, month] = value.split('-');
  return { year: Number(year), month: month ? Number(month) : undefined };
}

/**
 * Comparable integer for sorting: `YYYYMM`, with a year-only date sorting as
 * though it were January.
 *
 * `getCollection()` returns entries in a non-deterministic, platform-dependent
 * order, so every listing has to sort explicitly — this is what it sorts on.
 */
export function toSortKey(value: string): number {
  const { year, month } = parse(value);
  return year * 100 + (month ?? 0);
}

/**
 * Formats one endpoint in the given language.
 *
 * Deliberately `Intl` rather than a hand-written month table: Basque does not
 * merely translate the month names, it reverses the order ("2023 urt." against
 * "Jan 2023"). A lookup table would have produced plausible-looking but wrong
 * Basque. Verified against Node's full-ICU build.
 */
export function formatDate(value: string, locale: Locale): string {
  const { year, month } = parse(value);
  const tag = LOCALE_META[locale].intlTag;

  if (month === undefined) {
    return new Intl.DateTimeFormat(tag, { year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(year, 0, 1))
    );
  }

  return new Intl.DateTimeFormat(tag, {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

/**
 * Formats a period as a range: "Sep 2021 – Jul 2023", "2024 – Ongoing", "2019".
 *
 * `ongoingLabel` is passed in from the UI dictionary rather than derived here,
 * because "Ongoing" is chrome, not data.
 */
export function formatPeriod(value: Period, locale: Locale, ongoingLabel: string): string {
  const start = formatDate(value.start, locale);

  if (value.end === null) return `${start} – ${ongoingLabel}`;
  // A single-year event reads better as "2019" than "2019 – 2019".
  if (value.end === value.start) return start;

  return `${start} – ${formatDate(value.end, locale)}`;
}
