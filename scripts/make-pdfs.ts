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

import { spawn, type ChildProcess } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';
import { LOCALES } from '../src/i18n/locales.ts';
import { PERSON } from '../src/site.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(root, 'dist');
const PORT = 4330;
const ORIGIN = `http://127.0.0.1:${PORT}`;

function fileNameFor(locale: string): string {
  return `${PERSON.fullName.replace(/\s+/g, '-')}-CV-${locale}.pdf`;
}

async function waitForServer(url: string, timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not start at ${url} within ${timeoutMs}ms`);
}

/**
 * `file://` is not an option: the page references /fonts/… and /_astro/… by
 * absolute path, which would resolve against the filesystem root.
 */
function startPreview(): ChildProcess {
  const child = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr?.on('data', (d) => process.stderr.write(`  [preview] ${d}`));
  return child;
}

async function main(): Promise<void> {
  const entries = await readdir(DIST).catch(() => {
    throw new Error('dist/ not found — run `npm run build` first.');
  });
  if (!entries.includes('en')) throw new Error('dist/ looks incomplete — run `npm run build` first.');

  const server = startPreview();
  // CHROMIUM_PATH lets an environment that already ships a browser use it
  // instead of Playwright's own download. CI leaves it unset and relies on
  // `npx playwright install chromium`.
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });

  try {
    await waitForServer(`${ORIGIN}/en/cv/`);

    // colorScheme light is a second guard beside print.css: the tokens follow
    // prefers-color-scheme, and a headless browser reporting dark would
    // otherwise render pale text on black once printBackground is on.
    const context = await browser.newContext({ colorScheme: 'light' });

    for (const locale of LOCALES) {
      const page = await context.newPage();
      await page.goto(`${ORIGIN}/${locale}/cv/`, { waitUntil: 'networkidle' });

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
    server.kill();
  }

  console.log(`\nWrote ${LOCALES.length} PDFs to dist/`);
}

await main();
