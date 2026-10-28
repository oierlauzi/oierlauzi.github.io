/**
 * Fetches publication metadata from Crossref and reconciles it against ORCID.
 *
 *   npm run sync:publications            fetch and rewrite the generated file
 *   npm run sync:publications -- --check report drift and exit non-zero
 *
 * The site build never runs this and never hits the network: it reads the
 * committed publications.generated.json. That keeps builds hermetic and
 * reproducible, makes every metadata change reviewable in a diff, and means a
 * Crossref outage cannot fail a deploy.
 *
 * Why the DOI list is hand-owned rather than pulled from ORCID: ORCID holds
 * only a fraction of the works (1 of 4 at the time of writing) and Crossref's
 * `filter=orcid:` returns nothing at all, because no publisher deposited the
 * ORCID iD in the metadata. Neither service can discover the list, so the list
 * is owned here and ORCID is diffed against it in both directions.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { sanitizeTitle, titleToPlainText } from '../src/lib/sanitize.ts';
import { toAuthor } from '../src/lib/names.ts';
import { PERSON } from '../src/site.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = resolve(root, 'src/data/publications.yaml');
const OUTPUT = resolve(root, 'src/data/publications.generated.json');

const MAILTO = `${PERSON.email.user}@${PERSON.email.domain}`;
const CROSSREF = 'https://api.crossref.org/works/';
const ORCID_WORKS = `https://pub.orcid.org/v3.0/${PERSON.orcid}/works`;

interface InputEntry {
  id: string;
  doi: string;
  type: 'journal' | 'conference';
  preprintDoi?: string;
}

interface Author {
  name: string;
  self: boolean;
}

interface GeneratedEntry {
  id: string;
  doi: string;
  type: string;
  title: string;
  titleText: string;
  authors: Author[];
  venue: string | null;
  venueShort: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  year: string;
  month: string | null;
  publisher: string | null;
  url: string;
  preprintUrl: string | null;
}

/** Crossref gives given/family separately; join before matching. */
function formatAuthor(entry: { given?: string; family?: string; name?: string }): Author {
  return toAuthor(entry.name ?? [entry.given, entry.family].filter(Boolean).join(' '));
}

function first<T>(value: T[] | undefined): T | null {
  return value && value.length > 0 ? (value[0] as T) : null;
}

async function getJson(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': `oierlauzi.github.io (mailto:${MAILTO})` },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

async function fetchWork(entry: InputEntry): Promise<GeneratedEntry> {
  const data = await getJson(`${CROSSREF}${encodeURIComponent(entry.doi)}?mailto=${MAILTO}`);
  const m = data.message;

  const rawTitle = first<string>(m.title) ?? '(untitled)';
  const issued: number[] = m.issued?.['date-parts']?.[0] ?? [];

  return {
    id: entry.id,
    doi: entry.doi,
    type: entry.type,
    title: sanitizeTitle(rawTitle),
    titleText: titleToPlainText(rawTitle),
    authors: (m.author ?? []).map(formatAuthor),
    venue: first<string>(m['container-title']),
    venueShort: first<string>(m['short-container-title']),
    volume: m.volume ?? null,
    issue: m.issue ?? null,
    pages: m.page ?? null,
    year: String(issued[0] ?? ''),
    month: issued[1] ? String(issued[1]).padStart(2, '0') : null,
    publisher: m.publisher ?? null,
    url: `https://doi.org/${entry.doi}`,
    preprintUrl: entry.preprintDoi ? `https://doi.org/${entry.preprintDoi}` : null,
  };
}

/** Every DOI recorded on the ORCID profile, normalised to lowercase. */
async function fetchOrcidDois(): Promise<Set<string>> {
  const data = await getJson(ORCID_WORKS);
  const dois = new Set<string>();
  for (const group of data.group ?? []) {
    for (const ext of group['external-ids']?.['external-id'] ?? []) {
      if (ext['external-id-type'] === 'doi') dois.add(String(ext['external-id-value']).toLowerCase());
    }
  }
  return dois;
}

async function main(): Promise<void> {
  const check = process.argv.includes('--check');

  const entries = parseYaml(await readFile(INPUT, 'utf8')) as InputEntry[];
  console.log(`Reading ${entries.length} DOIs from src/data/publications.yaml`);

  const works: GeneratedEntry[] = [];
  for (const entry of entries) {
    const work = await fetchWork(entry);
    const selfCount = work.authors.filter((a) => a.self).length;
    console.log(`  ${entry.doi}  ${work.titleText.slice(0, 54)}`);
    console.log(`      ${work.authors.length} authors, self matched ${selfCount}x`);
    if (selfCount !== 1) {
      // Either the name variants missed this record, or they over-matched.
      // Both are wrong and silently produce a misleading author list.
      console.error(`      WARNING: expected exactly 1 self match, got ${selfCount}`);
      console.error(`      authors: ${work.authors.map((a) => a.name).join('; ')}`);
      process.exitCode = 1;
    }
    works.push(work);
  }

  // --- reconcile against ORCID, in both directions ------------------------
  const siteDois = new Set(entries.map((e) => e.doi.toLowerCase()));
  const preprintDois = new Set(
    entries.flatMap((e) => (e.preprintDoi ? [e.preprintDoi.toLowerCase()] : []))
  );

  let drift = false;
  try {
    const orcidDois = await fetchOrcidDois();
    const missingFromSite = [...orcidDois].filter((d) => !siteDois.has(d) && !preprintDois.has(d));
    const missingFromOrcid = [...siteDois].filter((d) => !orcidDois.has(d));

    console.log(`\nORCID holds ${orcidDois.size} DOI(s); the site lists ${siteDois.size}.`);
    if (missingFromSite.length > 0) {
      drift = true;
      console.log('  In ORCID but not on the site — add to publications.yaml:');
      for (const d of missingFromSite) console.log(`    ${d}`);
    }
    if (missingFromOrcid.length > 0) {
      drift = true;
      console.log('  On the site but not in ORCID — your ORCID record needs updating:');
      for (const d of missingFromOrcid) console.log(`    https://doi.org/${d}`);
    }
    if (!drift) console.log('  In sync.');
  } catch (error) {
    console.error(`\nORCID reconciliation skipped: ${(error as Error).message}`);
    if (check) process.exitCode = 1;
  }

  if (check) {
    if (drift) {
      console.error('\n--check: ORCID and the site disagree (see above).');
      process.exitCode = 1;
    }
    return;
  }

  await writeFile(OUTPUT, `${JSON.stringify(works, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${works.length} entries to src/data/publications.generated.json`);
}

await main();
