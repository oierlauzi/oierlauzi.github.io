import type { Period } from '../content/schema';
import { toSortKey } from './dates';

/**
 * Comparators for collection listings.
 *
 * `getCollection()` returns entries in a non-deterministic, platform-dependent
 * order — so a listing that looks right locally can come out shuffled in CI.
 * Every listing in the site sorts through one of these.
 */

/** Most recent first; ongoing entries (`end: null`) sort above finished ones. */
export function byPeriodDesc(a: { period: Period }, b: { period: Period }): number {
  const aOngoing = a.period.end === null;
  const bOngoing = b.period.end === null;
  if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;
  return toSortKey(b.period.start) - toSortKey(a.period.start);
}

/** Most recent first, for single-date entries such as awards. */
export function byDateDesc(a: { date: string }, b: { date: string }): number {
  return toSortKey(b.date) - toSortKey(a.date);
}

/** Explicit author-defined sequence, for lists with no inherent chronology. */
export function byOrder(a: { order: number }, b: { order: number }): number {
  return a.order - b.order;
}

interface ProjectLike {
  featured: boolean;
  period?: Period;
  name: string;
}

/**
 * Featured first, then most recent, then alphabetical.
 *
 * Several projects have no documented start date, so they fall to the bottom of
 * their group rather than being given an invented one.
 */
export function byProject(a: ProjectLike, b: ProjectLike): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;

  const aKey = a.period ? toSortKey(a.period.start) : -1;
  const bKey = b.period ? toSortKey(b.period.start) : -1;
  if (aKey !== bKey) return bKey - aKey;

  return a.name.localeCompare(b.name);
}
