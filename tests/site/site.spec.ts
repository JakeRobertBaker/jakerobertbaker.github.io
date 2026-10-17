import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const baseline = JSON.parse(await readFile(new URL('../fixtures/legacy-site.json', import.meta.url), 'utf8')) as {
  source: string; url: string; ids: string[]; blockIds: string[]; mathSha256: string; mathCount: number;
}[];

test('all original pages, mathematics and 250 anchors survive; local links and assets resolve', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const targets = new Set<string>();
  for (const original of baseline) {
    const source = await readFile(new URL(`../../src/content/docs/${original.source}`, import.meta.url), 'utf8');
    const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
    const math = body.match(/\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$)[^\n$]+?\$/g) ?? [];
    expect(createHash('sha256').update(math.join('\n')).digest('hex'), original.source).toBe(original.mathSha256);
    const response = await page.goto(original.url);
    expect(response?.status(), original.url).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://jakerobertbaker.github.io${original.url}`);
    await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute('content', 'gEOmW-qgr_yKbiRv9hNzVzRaIHlBm7kxsZTmr8coNRI');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(ids, original.url).toEqual(expect.arrayContaining(original.ids));
    expect(new Set(ids).size, original.url).toBe(ids.length);
    const text = await page.locator('main .sl-markdown-content').innerText();
    expect(text, original.url).not.toMatch(/^\/\/\/|^attrs:|\{data-preview\}|^:::+(?:theorem|proof|definition)/m);
    const links = await page.locator('main .sl-markdown-content a[href], main .sl-markdown-content img[src]').evaluateAll((nodes) =>
      nodes.map((node) => node instanceof HTMLAnchorElement ? node.href : (node as HTMLImageElement).src));
    for (const link of links) if (link.startsWith('http://127.0.0.1:4322/')) targets.add(link);
    for (const image of await page.locator('.sl-markdown-content img').all())
      expect(await image.evaluate(async (img: HTMLImageElement) => {
        img.loading = 'eager';
        await img.decode().catch(() => {});
        return img.complete && img.naturalWidth > 0;
      }), original.url).toBeTruthy();
  }
  for (const target of targets) {
    const url = new URL(target);
    const response = await request.get(url.pathname + url.search);
    expect(response.status(), target).toBe(200);
    if (url.hash && response.headers()['content-type']?.includes('text/html'))
      expect(await response.text(), target).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
  }
  expect(errors).toEqual([]);
});

test('native proofs, nested blocks, preserved image attributes and source math in headings', async ({ page }) => {
  await page.goto('/mathematics/linear_models/linear_models/#def-ols_lm');
  await expect(page.locator('#def-ols_lm .katex').first()).toBeVisible();
  const proof = page.locator('details[data-math-kind="proof"]').first();
  await expect(proof).not.toHaveAttribute('open');
  await proof.locator('summary').click();
  await expect(proof).toHaveAttribute('open', '');
  await expect(proof.locator('.katex').first()).toBeVisible();
  await expect(page.locator('img[width="50%"]')).toHaveCount(1);
  await expect(page.locator('details[data-math-kind="proof"] .starlight-aside')).toHaveCount(1);
  await page.goto('/mathematics/probability/normal_distribution/');
  await expect(page.locator('details[data-math-kind="proof"][open]')).toHaveCount(1);
  await page.goto('/mathematics/analysis/axler_measure_theory_exercises/exercises_2D/');
  await expect(page.locator('h3 .katex').first()).toBeVisible();
  await page.evaluate(() => {
    const el = document.createElement('details');
    el.id = 'deep-proof'; el.innerHTML = '<summary>Proof</summary><p id="deep-statement">Inside proof</p>';
    document.querySelector('main')!.append(el);
    location.hash = '#deep-statement';
  });
  await expect(page.locator('#deep-proof')).toHaveAttribute('open', '');
});

test('theorem registry is generated from the same Markdown and preserves all identified blocks', async ({ request }) => {
  const response = await request.get('/theorems.json');
  expect(response.status()).toBe(200);
  const registry = await response.json();
  expect(registry.version).toBe(1);
  expect(registry.blocks).toHaveLength(98);
  expect(new Set(registry.blocks.map((block: { url: string }) => block.url)).size).toBe(98);
  for (const block of registry.blocks) {
    expect(block.statement).toBeTruthy();
    expect(block.line).toBeGreaterThan(0);
    expect(block.source).toMatch(/\.md$/);
    const source = await readFile(new URL(`../../src/content/docs/${block.source}`, import.meta.url), 'utf8');
    expect(source.split('\n')[block.line - 1], block.url).toMatch(new RegExp(`^:{3,}${block.kind}`));
    expect(block.uses).toEqual([]); // No dependencies invented during migration.
  }
});

test('hover and keyboard previews render KaTeX and keep normal navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/mathematics/probability/normal_distribution/');
  const reference = page.locator('.sl-markdown-content a[href*="linear_models"]').first();
  await reference.hover();
  await expect(page.locator('#theorem-preview')).toBeVisible();
  await expect(page.locator('#theorem-preview .katex').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#theorem-preview')).toBeHidden();
  await reference.focus();
  await expect(page.locator('#theorem-preview')).toBeVisible();
  await reference.click();
  await expect(page).toHaveURL(/linear_models\/linear_models\/#def-standard_normal/);
  await expect(page.locator('#def-standard_normal')).toBeVisible();
});

test('mobile navigation, themes, contents, long math, and built-site search', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const routes = baseline.map((original) => original.url);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(392);
    }
  }
  await page.goto('/mathematics/set_theory/universal_algebra/');
  expect(await page.locator('.math-block__body').evaluateAll((elements) => elements.some((element) =>
    getComputedStyle(element).overflowX === 'auto' && element.scrollWidth > element.clientWidth))).toBeTruthy();
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const sidebar = page.getByRole('navigation', { name: 'Main' });
  await sidebar.getByText('Mathematics', { exact: true }).click();
  await sidebar.getByText('Analysis', { exact: true }).click();
  await sidebar.getByText('Companion to Analysis', { exact: true }).click();
  await expect(sidebar.getByText('Chapter 5', { exact: true })).toBeVisible();
  await sidebar.getByText('Chapter 5', { exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Chapter 5');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.locator('.pagefind-ui__search-input').fill('Luzin');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  await expect(page.locator('.pagefind-ui__results')).toContainText('Luzin');
});

test('crawler discovery, legacy sitemap and Pages static assets are retained', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toBe(await (await request.get('/sitemap-index.xml')).text());
  const urls = await (await request.get('/sitemap-0.xml')).text();
  const guide = await (await request.get('/llms.txt')).text();
  for (const original of baseline) {
    expect(urls).toContain(`https://jakerobertbaker.github.io${original.url}`);
    expect(guide).toContain(`https://jakerobertbaker.github.io${original.url}`);
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('https://jakerobertbaker.github.io/sitemap.xml');
  expect(await readFile(new URL('../../dist/.nojekyll', import.meta.url), 'utf8')).toBe('');
});

test('static mathematics and proof disclosure work without client JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/mathematics/linear_models/linear_models/');
  await expect(page.locator('#def-ols_lm .katex').first()).toBeVisible();
  const proof = page.locator('details[data-math-kind="proof"]').first();
  await proof.locator('summary').click();
  await expect(proof).toHaveAttribute('open', '');
  await context.close();
});
