import assert from 'node:assert/strict';
import path from 'node:path';

const algebra = '/mathematics/set_theory/universal_algebra/';
const ballot = '/mathematics/probability/ballot_notes/';

export function watchPage(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
  return errors;
}

async function hitTarget(locator) {
  return locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('button, summary') === element;
  });
}

export async function reviewNavigation(browser, { origin, output, reports }) {
  const capture = async (page, name) => {
    const filename = `${name}.png`;
    await page.screenshot({ path: path.join(output, filename), animations: 'disabled' });
    reports.push({ filename, url: page.url() });
  };

  // Match the supplied half-width screenshots, including a short viewport.
  for (const mode of ['light', 'dark']) for (const width of [800, 960, 1070, 1151]) {
    const context = await browser.newContext({ viewport: { width, height: 497 }, colorScheme: mode, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = watchPage(page);
    try {
      await page.goto(`${origin}${algebra}`);
      await page.evaluate(() => document.fonts.ready);
      const index = page.getByRole('button', { name: 'Open subject index', exact: true });
      const contents = page.locator('mobile-starlight-toc .toggle');
      for (const state of ['top', 'scrolled']) {
        if (state === 'scrolled') {
          await page.evaluate(() => window.scrollTo(0, 1100));
          await page.waitForFunction(() => document.documentElement.hasAttribute('data-masthead-away'));
          assert.ok(await page.locator('.page > header').evaluate(e => e.getBoundingClientRect().bottom <= 0));
        }
        const left = await index.boundingBox();
        const right = await contents.boundingBox();
        assert.ok(Math.abs(left.y - right.y) < 1 && Math.abs(left.height - right.height) < 1, `Controls misaligned: ${width}/${mode}/${state}`);
        assert.ok(await page.locator('mobile-starlight-toc nav').evaluate(e => e.getBoundingClientRect().width < 200), 'Contents must not form a second full-width bar');
        assert.ok(await hitTarget(index));
        assert.ok(await hitTarget(page.locator('#starlight__on-this-page--mobile')));
        if (state === 'top') {
          for (const selector of ['.site-title', 'button[data-open-modal]', '.page > header .right-group starlight-theme-select']) {
            const rect = await page.locator(selector).boundingBox();
            assert.ok(rect.x + rect.width < right.x, `Header action overlaps contents: ${selector}/${width}`);
          }
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 1070) await capture(page, `narrow-${mode}-${state}`);
      }
      await page.locator('#starlight__on-this-page--mobile').click();
      const dropdown = await page.locator('mobile-starlight-toc .dropdown').boundingBox();
      assert.ok(dropdown.x >= 0 && dropdown.y >= 0 && dropdown.x + dropdown.width <= width && dropdown.y + dropdown.height <= 497, `Contents exceeds short viewport at ${width}`);
      if (width === 1070) await capture(page, `narrow-${mode}-contents`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#starlight__mobile-toc').getAttribute('open'), null);
      const before = await page.evaluate(() => scrollY);
      await index.click();
      assert.equal(await page.locator('#starlight__sidebar').evaluate(e => e.matches(':popover-open')), true);
      const close = page.getByRole('button', { name: 'Close subject index', exact: true });
      assert.ok(await hitTarget(close));
      assert.equal(await page.locator('#starlight__sidebar .mobile-preferences').evaluate(e => getComputedStyle(e.parentElement).display), 'block', 'Social links must remain available in the menu');
      await close.click();
      await page.waitForFunction(() => !document.querySelector('.main-frame').inert);
      assert.equal(await page.evaluate(() => scrollY), before);
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  }

  // Touch contexts catch top-layer occlusion that a simple DOM visibility check misses.
  for (const mode of ['light', 'dark']) for (const width of [320, 360, 390, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 740 }, colorScheme: mode, reducedMotion: 'reduce', hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = watchPage(page);
    try {
      for (const [name, route] of [['home', '/'], ['article', ballot]]) for (const state of ['top', 'scrolled']) {
        await page.goto(`${origin}${route}`);
        await page.evaluate(() => document.fonts.ready);
        if (state === 'scrolled') {
          await page.evaluate(() => window.scrollTo(0, 1100));
          await page.waitForFunction(() => document.documentElement.hasAttribute('data-masthead-away'));
        }
        const menu = page.getByRole('button', { name: 'Menu', exact: true });
        const before = await page.evaluate(() => scrollY);
        await menu.tap();
        const pane = page.locator('#starlight__sidebar');
        assert.equal(await pane.evaluate(e => e.matches(':popover-open')), true);
        assert.equal(await menu.locator('.close-menu').isVisible(), true);
        assert.ok(await hitTarget(menu), `Close toggle is covered: ${width}/${mode}/${name}/${state}`);
        const control = await menu.boundingBox();
        const panel = await pane.boundingBox();
        assert.ok(panel.y >= control.y + control.height && panel.y + panel.height <= 740);
        if (width === 360) await capture(page, `phone-${mode}-${name}-${state}-menu`);
        await menu.tap();
        await page.waitForFunction(() => !document.querySelector('.main-frame').inert);
        assert.equal(await pane.evaluate(e => e.matches(':popover-open')), false);
        assert.equal(await page.evaluate(() => scrollY), before, 'Closing the menu must preserve the reading position');
        await menu.tap();
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => !document.querySelector('.main-frame').inert);
        assert.equal(await pane.evaluate(e => e.matches(':popover-open')), false);
        if (name === 'article' && state === 'scrolled') {
          const contents = await page.locator('mobile-starlight-toc .toggle').boundingBox();
          const button = await menu.boundingBox();
          assert.ok(Math.abs(contents.y + contents.height / 2 - button.y - button.height / 2) < 1, 'Phone controls must share a centre line');
          const summary = page.locator('#starlight__on-this-page--mobile');
          await summary.tap();
          await page.locator('mobile-starlight-toc a[href="#hypergeometric-distribution"]').tap();
          assert.equal(new URL(page.url()).hash, '#hypergeometric-distribution');
          assert.equal(await page.locator('#starlight__mobile-toc').getAttribute('open'), null);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  }

  // State transition while the native popover is open, not just fresh page loads.
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true });
  const page = await context.newPage();
  const errors = watchPage(page);
  try {
    await page.goto(`${origin}${ballot}`);
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await page.setViewportSize({ width: 1070, height: 600 });
    // Starlight closes the mobile popover when crossing its desktop breakpoint.
    await page.waitForFunction(() => !document.querySelector('.main-frame').inert && !document.querySelector('#starlight__sidebar').matches(':popover-open'));
    await page.getByRole('button', { name: 'Open subject index', exact: true }).tap();
    await page.getByRole('button', { name: 'Close subject index', exact: true }).tap();
    await page.waitForFunction(() => !document.querySelector('.main-frame').inert);
    await page.setViewportSize({ width: 1440, height: 1000 });
    assert.equal(await page.locator('starlight-toc').isVisible(), true);
    await page.goto(`${origin}${algebra}`);
    assert.equal(await page.locator('[data-look], #theme-lab').count(), 0, 'No experiment state or comparison UI ships');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
}
