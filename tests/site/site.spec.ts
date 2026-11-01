import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { sep } from 'node:path';

// Discover the current build, not a frozen list of migration-era notes.
// This suite requires a fresh build; `npm run validate` handles that ordering.
const routes = (await readdir(new URL('../../dist/', import.meta.url), { recursive: true }))
  .map((path) => path.split(sep).join('/'))
  .filter((path) => path === 'index.html' || path.endsWith('/index.html'))
  .map((path) => `/${path.slice(0, -'index.html'.length)}`)
  .sort();

test('current pages render mathematics; local links and assets resolve', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const targets = new Set<string>();
  expect(routes).toContain('/');
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://jakerobertbaker.github.io${route}`);
    await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute('content', 'gEOmW-qgr_yKbiRv9hNzVzRaIHlBm7kxsZTmr8coNRI');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(ids).size, route).toBe(ids.length);
    // Code blocks may show directive syntax; only rendered prose must not.
    const text = await page.locator('main .sl-markdown-content').evaluate((content) => {
      const copy = content.cloneNode(true) as HTMLElement;
      copy.querySelectorAll('pre').forEach((block) => block.remove());
      document.body.append(copy);
      const rendered = copy.innerText;
      copy.remove();
      return rendered;
    });
    expect(text, route).not.toMatch(/^\/\/\/|^attrs:|\{data-preview\}|^:::+(?:theorem|proof|definition)/m);
    const links = await page.locator('main .sl-markdown-content a[href], main .sl-markdown-content img[src]').evaluateAll((nodes) =>
      nodes.map((node) => node instanceof HTMLAnchorElement ? node.href : (node as HTMLImageElement).src));
    for (const link of links) if (link.startsWith('http://127.0.0.1:4322/')) targets.add(link);
    for (const image of await page.locator('.sl-markdown-content img').all())
      expect(await image.evaluate(async (img: HTMLImageElement) => {
        img.loading = 'eager';
        await img.decode().catch(() => {});
        return img.complete && img.naturalWidth > 0;
      }), route).toBeTruthy();
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

test('native desktop and mobile contents use mathematical labels once and keep original anchors', async ({ page }) => {
  const route = '/mathematics/analysis/axler_measure_theory_exercises/luzin_theorem_2_91/';
  const id = 'apply-egorov-to-each-finite-mm1-ninmathbbz';
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(route);
    await expect(page.locator(`[id="${id}"] .katex`)).toHaveCount(2);
    if (width === 390) await page.locator('#starlight__on-this-page--mobile').click();
    const scope = width === 390 ? 'mobile-starlight-toc' : 'starlight-toc';
    const link = page.locator(`${scope} a[href="#${id}"]`);
    await expect(link).toHaveText('Apply Egorov to each finite (m,m+1), n∈Z');
    await link.click();
    await expect(page).toHaveURL(`${route}#${id}`);
    await expect(page.locator(`[id="${id}"]`)).toBeVisible();
    await expect(link).toHaveAttribute('aria-current', 'true');
  }
});

test('remarks and notation retain published identities and use semantic blocks', async ({ page, request }) => {
  const targets = [
    ['/mathematics/linear_models/linear_models/', 'rem-R2_general', 'remark'],
    ['/mathematics/probability/ballot_notes/', 'rem-Beta-Binomial-Proportion', 'remark'],
    ['/deep_learning/attention_is_all_you_need/', 'rem-enc-self-attn', 'remark'],
    ['/deep_learning/attention/', 'not-attention', 'notation'],
  ];
  const registry = await (await request.get('/theorems.json')).json();
  for (const [route, id, kind] of targets) {
    await page.goto(`${route}#${id}`);
    await expect(page.locator(`[id="${id}"]`)).toHaveClass(`math-block math-block--${kind}`);
    await expect(page.locator(`[id="${id}"] .math-permalink`)).toHaveAttribute('href', `#${id}`);
    expect(registry.blocks.find((block: { url: string }) => block.url === `${route}#${id}`)?.kind).toBe(kind);
  }
  await page.goto('/mathematics/analysis/axler_measure_theory_exercises/chapter_2_measure_notes/');
  await expect(page.locator('.math-block--remark')).toContainText('Already have: countable implies outer measure zero');
  await expect(page.locator('.starlight-aside--note')).toContainText('Therefore');
});

test('theorem registry agrees with current rendered blocks and Markdown locations', async ({ page, request }) => {
  const response = await request.get('/theorems.json');
  expect(response.status()).toBe(200);
  const registry = await response.json();
  expect(registry.version).toBe(1);
  const blockUrls = registry.blocks.map((block: { url: string }) => block.url);
  expect(new Set(blockUrls).size).toBe(blockUrls.length);
  const renderedBlockUrls: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    const blocks = await page.locator('[data-math-kind][id]').evaluateAll((nodes) =>
      nodes.map((node) => ({ id: node.id, kind: node.getAttribute('data-math-kind') })));
    for (const block of blocks) {
      const url = `${route}#${block.id}`;
      renderedBlockUrls.push(url);
      expect(registry.blocks.find((entry: { url: string }) => entry.url === url)?.kind, url).toBe(block.kind);
    }
  }
  expect([...blockUrls].sort()).toEqual(renderedBlockUrls.sort());
  for (const block of registry.blocks) {
    expect(block.statement).toBeTruthy();
    expect(block.line).toBeGreaterThan(0);
    expect(block.source).toMatch(/\.md$/);
    const source = await readFile(new URL(`../../src/content/docs/${block.source}`, import.meta.url), 'utf8');
    expect(source.split('\n')[block.line - 1], block.url).toMatch(new RegExp(`^:{3,}${block.kind}`));
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
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(392);
      // Wide math must remain scrollable, but no note has to keep a wide formula.
      expect(await page.locator('.math-block__body').evaluateAll((elements) => elements.every((element) =>
        element.scrollWidth <= element.clientWidth || getComputedStyle(element).overflowX === 'auto')), route).toBeTruthy();
    }
  }
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

test('current pages are discoverable and the sitemap alias works', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toBe(await (await request.get('/sitemap-index.xml')).text());
  const urls = await (await request.get('/sitemap-0.xml')).text();
  const guide = await (await request.get('/llms.txt')).text();
  for (const route of routes)
    expect(urls).toContain(`<loc>https://jakerobertbaker.github.io${route}</loc>`);
  // The guide is curated, not exhaustive. Check its actual links instead of
  // requiring a manual entry for every new note.
  for (const [, path] of guide.matchAll(/\]\(https:\/\/jakerobertbaker\.github\.io([^)]*)\)/g)) {
    const url = new URL(path || '/', 'https://jakerobertbaker.github.io');
    const response = await request.get(url.pathname + url.search);
    expect(response.status(), url.href).toBe(200);
    if (url.hash && response.headers()['content-type']?.includes('text/html'))
      expect(await response.text(), url.href).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('https://jakerobertbaker.github.io/sitemap.xml');
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

test('proof graphs lay out registry results and proofs, select them, and degrade to a list', async ({ page, request, browser }) => {
  const route = '/mathematics/analysis/companion_to_analysis/theory_graph/';
  const { blocks } = await (await request.get('/theorems.json')).json();
  const page_ = '/mathematics/analysis/companion_to_analysis/theory/';
  const results = blocks.filter((block: { url: string; kind: string }) => block.url.startsWith(page_) && block.kind !== 'proof');
  const proofs = blocks.filter((block: { url: string; kind: string; proves: string | null }) =>
    block.kind === 'proof' && block.proves?.startsWith(page_));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route);
  const graph = page.locator('theorem-graph', { has: page.getByRole('group', { name: 'Companion to Analysis theory graph' }) });
  await expect(graph).toHaveAttribute('data-ready', '');
  await expect(graph.locator('.tg-node')).toHaveCount(results.length);
  await expect(graph.locator('.tg-proof')).toHaveCount(proofs.length);
  await expect(graph.locator('.tg-edge')).toHaveCount(proofs.length);
  // Cards start as titles; a click opens the statement, a second click folds it.
  const card = graph.locator('.tg-node').first();
  await expect(card.locator('.tg-node__body')).toBeHidden();
  await card.locator('.tg-node__kind').click();
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  await expect(card.locator('.tg-node__body .katex').first()).toBeVisible();
  await card.locator('.tg-node__kind').click();
  await expect(card.locator('.tg-node__body')).toBeHidden();
  await graph.getByRole('button', { name: 'Statements' }).click();
  await expect(graph.locator('.tg-node.is-open')).toHaveCount(results.length);
  await page.waitForTimeout(1500); // Let the layout settle around the opened cards.
  // Laid out: no two cards overlap.
  const boxes = await graph.locator('.tg-node').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().toJSON()));
  for (const [i, a] of boxes.entries()) for (const b of boxes.slice(i + 1))
    expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBeTruthy();
  const panel = graph.locator('.theorem-graph__panel');
  await graph.locator('.tg-node .tg-node__body').first().click();
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'All upstream' })).toBeVisible();
  await expect(graph).toHaveClass(/has-selection/);
  await graph.locator('.tg-proof').first().click();
  await expect(page).toHaveURL(route);
  await expect(panel.locator('h4', { hasText: 'Proof' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const static_ = await context.newPage();
  await static_.goto(`http://127.0.0.1:4322${route}`);
  await expect(static_.locator('.tg-node .katex').first()).toBeVisible();
  await expect(static_.locator('.tg-proof__route').first()).toBeVisible();
  await context.close();
});
