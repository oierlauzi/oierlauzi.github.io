/**
 * Renders the CV page of each locale to a PDF.
 *
 *   npm run build:pdf        (run after `npm run build`)
 *
 * The PDFs render the same /{lang}/cv/ page the site serves, with print.css
 * deciding what appears, so there is no separate print template to drift.
 *
 * This is kept out of `npm run build` deliberately: it needs a browser, and
 * making every build depend on one to change a line of CSS is a poor trade.
 * CI runs both steps in sequence.
 */

import { createServer, type Server } from 'node:http';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { LOCALES } from '../src/i18n/locales.ts';
import { PERSON } from '../src/site.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(root, 'dist');

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

function fileNameFor(locale: string): string {
  return `${PERSON.fullName.replace(/\s+/g, '-')}-CV-${locale}.pdf`;
}

/**
 * Serves dist/ from inside this process.
 *
 * `astro preview` is not usable here: in Astro 7 it always daemonises. The
 * command returns 0 as soon as it has handed off to a detached server, so
 * there is nothing to wait on and nothing to kill, and the detached server's
 * own failures go to Astro's log rather than to this script's stderr. That is
 * exactly how the first CI run failed, with a 30s timeout and no diagnostic.
 *
 * Owning the server instead means startup is awaited rather than polled,
 * shutdown is certain, and the bind address is explicit.
 */
function startServer(): Promise<{ server: Server; origin: string }> {
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
    // Directory URLs map to their index.html, matching the built output.
    const relative = path.endsWith('/') ? `${path}index.html` : path;
    const file = resolve(DIST, `.${relative}`);

    // Refuse anything escaping dist/, even though the only client here is a
    // browser this script drives itself.
    if (file !== DIST && !file.startsWith(DIST + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    const type = CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
    const stream = createReadStream(file);
    stream.on('error', () => res.writeHead(404).end('Not found'));
    stream.on('open', () => {
      res.writeHead(200, { 'Content-Type': type });
      stream.pipe(res);
    });
  });

  return new Promise((resolveStart, rejectStart) => {
    server.on('error', rejectStart);
    // Port 0: the OS picks a free one, so there is no port to collide over.
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        rejectStart(new Error('Server did not bind to a TCP port'));
        return;
      }
      resolveStart({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function main(): Promise<void> {
  const entries = await readdir(DIST).catch(() => {
    throw new Error('dist/ not found — run `npm run build` first.');
  });
  if (!entries.includes('en')) throw new Error('dist/ looks incomplete — run `npm run build` first.');

  const { server, origin } = await startServer();
  // CHROMIUM_PATH lets an environment that already ships a browser use it
  // instead of Playwright's own download. CI leaves it unset and relies on
  // `npx playwright install chromium`.
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });

  try {
    // colorScheme light is a second guard beside print.css: the tokens follow
    // prefers-color-scheme, and a headless browser reporting dark would
    // otherwise render pale text on black once printBackground is on.
    const context = await browser.newContext({ colorScheme: 'light' });

    for (const locale of LOCALES) {
      const page = await context.newPage();
      await page.goto(`${origin}/${locale}/cv/`, { waitUntil: 'networkidle' });

      // Without this the PDF silently falls back to Georgia: the woff2 files
      // are still in flight when pdf() captures the layout.
      await page.evaluate(() => document.fonts.ready);

      const path = resolve(DIST, fileNameFor(locale));
      await page.pdf({
        path,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        // Chromium does not support @page margin boxes, so counter(page) in CSS
        // does nothing — the page number has to come from here. The template is
        // an isolated document that inherits no styles and defaults to zero
        // font-size, hence the inline style.
        footerTemplate: `
          <div style="width:100%;font-family:Georgia,serif;font-size:8pt;color:#777;
                      text-align:center;padding:0 16mm;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>`,
        margin: { top: '16mm', right: '16mm', bottom: '20mm', left: '16mm' },
      });
      await page.close();

      const { size } = await stat(path);
      console.log(`  ${fileNameFor(locale).padEnd(40)} ${(size / 1024).toFixed(0)} KB`);
    }
  } finally {
    await browser.close();
    await new Promise<void>((done) => server.close(() => done()));
  }

  console.log(`\nWrote ${LOCALES.length} PDFs to dist/`);
}

await main();
