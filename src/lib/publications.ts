import { getCollection } from 'astro:content';
import { sanitizeTitle } from './sanitize';
import { toAuthor } from './names';

export type PublicationType = 'journal' | 'conference' | 'thesis';

/**
 * One shape for both sources — Crossref-enriched entries and the hand-written
 * ones — so the page renders a single uniform list and never has to know where
 * an entry came from.
 */
export interface Publication {
  id: string;
  type: PublicationType;
  /** Already sanitised; safe for `set:html`. May contain <i>, <sub>, <sup>. */
  titleHtml: string;
  /** Markup-free, for JSON-LD and meta tags. */
  titleText: string;
  authors: { name: string; self: boolean }[];
  venue: string | null;
  /** Volume, issue and pages, or a thesis's degree and a venue's location. */
  detail: string | null;
  year: string;
  month: string | null;
  url: string | null;
  preprintUrl: string | null;
  /** Set only when the work is not in English. */
  language: string | null;
}

/** "82(7), 727–739" — with an en dash in the page range, as a citation wants. */
function citationDetail(volume: string | null, issue: string | null, pages: string | null): string | null {
  const parts: string[] = [];
  if (volume) parts.push(issue ? `${volume}(${issue})` : volume);
  if (pages) parts.push(pages.replace(/-/g, '–'));
  return parts.length > 0 ? parts.join(', ') : null;
}

export async function getPublications(): Promise<Publication[]> {
  const generated = await getCollection('publications');
  const extra = await getCollection('publicationsExtra');

  const fromCrossref: Publication[] = generated.map((entry) => ({
    id: entry.id,
    type: entry.data.type,
    titleHtml: entry.data.title,
    titleText: entry.data.titleText,
    authors: entry.data.authors,
    venue: entry.data.venueShort ?? entry.data.venue,
    detail: citationDetail(entry.data.volume, entry.data.issue, entry.data.pages),
    year: entry.data.year,
    month: entry.data.month,
    url: entry.data.url,
    preprintUrl: entry.data.preprintUrl,
    language: null,
  }));

  const fromHand: Publication[] = extra.map((entry) => ({
    id: entry.id,
    type: entry.data.type,
    // Hand-written titles are plain text, but they go through the same
    // sanitiser so every title on the page is rendered the same way.
    titleHtml: sanitizeTitle(entry.data.title),
    titleText: entry.data.title,
    authors: entry.data.authors.map(toAuthor),
    venue: entry.data.venue,
    detail: [entry.data.note, entry.data.location].filter(Boolean).join(' · ') || null,
    year: entry.data.year,
    month: null,
    url: entry.data.url ?? null,
    preprintUrl: null,
    language: entry.data.language ?? null,
  }));

  // getCollection() is unordered, so sort explicitly: newest first, falling
  // back to the title when two works share a year and have no month.
  return [...fromCrossref, ...fromHand].sort((a, b) => {
    const keyA = Number(a.year) * 100 + Number(a.month ?? 0);
    const keyB = Number(b.year) * 100 + Number(b.month ?? 0);
    if (keyA !== keyB) return keyB - keyA;
    return a.titleText.localeCompare(b.titleText);
  });
}

/** Section order on the page: peer-reviewed work first, theses last. */
export const TYPE_ORDER = ['journal', 'conference', 'thesis'] as const;

export function byType(publications: Publication[], type: PublicationType): Publication[] {
  return publications.filter((p) => p.type === type);
}
