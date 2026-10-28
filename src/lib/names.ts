// Extension is explicit because scripts/sync-publications.ts imports this file
// through Node's native ESM resolver, which does not do extensionless lookup.
// Astro's tsconfig sets allowImportingTsExtensions, so Vite is happy too.
import { PERSON } from '../site.ts';

/**
 * Collapses a personal name to a comparison key: lowercase, letters only.
 *
 * Crossref splits this author's name three different ways across publishers —
 * `O.`/`Lauzirika`, `O. L.`/`Zarrabeitia` and `O.L.`/`Zarrabeitia` — so neither
 * punctuation nor spacing can be trusted.
 */
export function nameKey(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}]/gu, '');
}

const SELF_KEYS = new Set(PERSON.nameVariants.map(nameKey));

/**
 * Whether a full name refers to the site's owner.
 *
 * Matches on given + family together and never on a surname alone: a bare
 * "Zarrabeitia" would also match an unrelated person with the same surname,
 * silently emphasising someone else in an author list. Every Crossref record
 * for these papers carries a given name, so there is nothing to gain by
 * loosening it.
 */
export function isSelf(fullName: string): boolean {
  return SELF_KEYS.has(nameKey(fullName));
}

/** Author entry normalised to one consistent identity for display. */
export function toAuthor(fullName: string): { name: string; self: boolean } {
  const self = isSelf(fullName);
  return { name: self ? PERSON.signature : fullName, self };
}
