/**
 * Crossref titles are not plain text. They arrive as XML fragments carrying
 * real markup and the indentation of the publisher's deposit file, e.g.
 *
 *   '<i>AlignPCA</i>\n      -2\n      <i>D</i>\n      : PCA-reduced ...'
 *
 * which must render as "AlignPCA-2D: PCA-reduced ...". Rendering therefore
 * needs `set:html`, which makes this function a security boundary, not a
 * formatting nicety: it is the only thing standing between third-party
 * metadata and the DOM.
 */

/** Inline formatting that genuinely occurs in scientific titles. */
const ALLOWED_TAGS = ['i', 'em', 'b', 'strong', 'sub', 'sup', 'scp'] as const;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body.startsWith('#x') || body.startsWith('#X')) {
      const code = Number.parseInt(body.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (body.startsWith('#')) {
      const code = Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named ?? match;
  });
}

/**
 * Collapses the deposit file's indentation.
 *
 * A whitespace run containing a newline is dropped only when it sits against a
 * tag boundary, because that is pretty-printing rather than a real space —
 * "</i>\n    -2" means "</i>-2". A newline between two words is still a word
 * break and collapses to a single space, so a title wrapped mid-sentence does
 * not have its words glued together.
 */
function collapseWhitespace(input: string): string {
  return input
    .replace(/>\s*\n\s*/g, '>')
    .replace(/\s*\n\s*</g, '<')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Returns a string safe to pass to `set:html`.
 *
 * Everything is escaped first and only bare tags from the allowlist are then
 * restored. A tag carrying any attribute therefore stays escaped and renders
 * as visible text — `<i onclick=…>` is never un-escaped, because the restore
 * pattern matches only `<i>` and `</i>` exactly.
 */
export function sanitizeTitle(raw: string): string {
  const collapsed = collapseWhitespace(decodeEntities(String(raw)));
  const escaped = escapeHtml(collapsed);
  const bareTag = new RegExp(`&lt;(/?)(${ALLOWED_TAGS.join('|')})&gt;`, 'gi');
  return escaped.replace(bareTag, '<$1$2>');
}

/** The same text with no markup at all — for `<title>`, meta tags and JSON-LD. */
export function titleToPlainText(raw: string): string {
  const collapsed = collapseWhitespace(decodeEntities(String(raw)));
  return collapsed.replace(/<\/?[a-z][^>]*>/gi, '').replace(/\s+/g, ' ').trim();
}
