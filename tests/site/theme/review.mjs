// Shared production-theme assertions and representative screenshots.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { reviewNavigation, watchPage } from './navigation.mjs';

const routes = [
  ['linear', '/mathematics/linear_models/linear_models/', '#rem-R2_general'],
  ['measure', '/mathematics/analysis/axler_measure_theory_exercises/chapter_2_measure_notes/', '.math-block--remark'],
  ['notation', '/deep_learning/attention/', '#not-attention'],
  ['attention', '/deep_learning/attention_is_all_you_need/', '#rem-enc-self-attn'],
  ['ballot', '/mathematics/probability/ballot_notes/', '#rem-Beta-Binomial-Proportion'],
];

export async function reviewTheme(browser, { origin, output }) {
  const reports = [];
  await mkdir(output, { recursive: true });
  try {
    for (const mode of ['light', 'dark']) for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: mode, reducedMotion: 'reduce', deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = watchPage(page);
      const capture = async name => {
        const filename = `${mode}-${width}-${name}.png`;
        await page.screenshot({ path: path.join(output, filename), animations: 'disabled' });
        reports.push({ filename, url: page.url() });
      };
      try {
        for (const [name, route, target] of routes) {
          await page.goto(`${origin}${route}`);
          await page.evaluate(() => document.fonts.ready);
          const metrics = await page.evaluate(() => {
            const article = document.querySelector('main .sl-markdown-content');
            const x = article.getBoundingClientRect().x;
            const blocks = [...article.querySelectorAll('.math-block, .starlight-aside--note, .starlight-aside--tip')]
              .filter(e => !e.parentElement.closest('.math-block, .starlight-aside'));
            return {
              x, width: article.clientWidth, overflow: document.documentElement.scrollWidth > innerWidth,
              font: getComputedStyle(article).fontFamily, color: getComputedStyle(article).color,
              measure: getComputedStyle(document.documentElement).getPropertyValue('--sl-content-width').trim(),
              blocks: blocks.map(e => {
                const title = e.querySelector(':scope > .math-block__title, :scope > .starlight-aside__title');
                const body = e.querySelector(':scope > .math-block__body, :scope > .starlight-aside__content');
                return { kind: e.dataset.mathKind || 'note', titleX: title.getBoundingClientRect().x,
                  bodyX: body.getBoundingClientRect().x, bodyWidth: body.clientWidth,
                  size: getComputedStyle(body).fontSize, rule: getComputedStyle(e).borderInlineStartWidth,
                  background: getComputedStyle(e).backgroundColor };
              }),
            };
          });
          assert.equal(metrics.overflow, false, `${name}/${width}: page overflow`);
          assert.ok(metrics.font.includes('ET Book'));
          assert.equal(metrics.measure, '56rem');
          assert.equal(metrics.color, mode === 'dark' ? 'rgb(222, 216, 205)' : 'rgb(60, 56, 47)');
          for (const block of metrics.blocks) {
            assert.ok(Math.abs(block.titleX - metrics.x) < 1, `${name}: ${block.kind} title inset`);
            if (block.bodyWidth > 0) {
              assert.ok(Math.abs(block.bodyX - metrics.x) < 1, `${name}: ${block.kind} body inset`);
              assert.equal(block.bodyWidth, metrics.width, `${name}: ${block.kind} lost width`);
            }
            assert.equal(block.size, '21px');
            assert.equal(block.rule, block.kind === 'note' ? '1px' : '2px');
            assert.equal(block.background, 'rgba(0, 0, 0, 0)', 'Fine rules, not tinted cards');
          }
          if (name === 'linear' || name === 'measure') await capture(`${name}-top`);
          await page.locator(target).scrollIntoViewIfNeeded();
          await capture(name);
          if (name === 'linear') {
            const proof = page.locator('details.math-block--proof').last();
            await proof.locator('summary').click();
            const note = proof.locator('.starlight-aside--note');
            await note.scrollIntoViewIfNeeded();
            const nested = await note.evaluate(e => {
              const parent = e.closest('.math-block__body');
              const title = e.querySelector('.starlight-aside__title');
              const body = e.querySelector('.starlight-aside__content');
              return { parentX: parent.getBoundingClientRect().x, ruleX: e.getBoundingClientRect().x,
                titleX: title.getBoundingClientRect().x, bodyX: body.getBoundingClientRect().x,
                gap: parseFloat(getComputedStyle(e).fontSize) * .75 };
            });
            assert.ok(Math.abs(nested.ruleX - nested.parentX) < 1, 'Nested note rule must stay inside the proof scroller');
            assert.ok(Math.abs(nested.titleX - nested.bodyX) < 1);
            assert.ok(Math.abs(nested.bodyX - nested.parentX - nested.gap) < 1, 'Nesting has one consistent inset, not stacked padding');
            await capture('nested-note');
          }
        }
        await page.goto(`${origin}${routes[0][1]}`);
        await page.evaluate(() => window.scrollTo(0, 1100));
        await page.waitForFunction(() => document.documentElement.hasAttribute('data-masthead-away'));
        if (width >= 800) {
          assert.ok(await page.locator('.page > header').evaluate(e => e.getBoundingClientRect().bottom < 0));
          const before = await page.evaluate(() => scrollY);
          const button = await page.locator('.subject-index-toggle').boundingBox();
          const article = await page.locator('main .sl-markdown-content').boundingBox();
          assert.ok(button.y >= 0 && button.x + button.width + 16 < article.x, 'Index button must stay in the margin, not over prose');
          await page.getByRole('button', { name: 'Open subject index', exact: true }).click();
          assert.equal(await page.evaluate(() => scrollY), before, 'Opening the index must not jump back to the masthead');
          const pane = await page.locator('#starlight__sidebar').boundingBox();
          assert.ok(pane.y >= button.y + button.height + 8, 'Index panel must not obscure its trigger');
          await capture('persistent-index');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => !document.querySelector('.main-frame').inert);

          const map = page.locator('starlight-toc');
          assert.equal(await map.isVisible(), true);
          await page.waitForFunction(() => document.querySelectorAll('starlight-toc a[aria-current="true"]').length === 1);
          assert.ok(await map.locator('a').first().evaluate(e => getComputedStyle(e).fontFamily.includes('ET Book')));
          await capture('expanded-map');
          await map.locator('a[href="#ols-basics"]').click();
          assert.equal(new URL(page.url()).hash, '#ols-basics');
          assert.equal(await map.isVisible(), true);
          await page.waitForFunction(() => document.querySelector('starlight-toc a[href="#ols-basics"]').getAttribute('aria-current') === 'true');
        } else {
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          assert.equal(await page.locator('#starlight__sidebar').evaluate(e => e.matches(':popover-open')), true);
          await page.keyboard.press('Escape');
        }
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' });
    const page = await context.newPage();
    for (const width of [800, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${origin}${routes[0][1]}`);
      await page.evaluate(() => document.fonts.ready);
      const button = await page.locator('.subject-index-toggle').boundingBox();
      const article = await page.locator('main .sl-markdown-content').boundingBox();
      assert.ok(button.x + button.width + 8 < article.x, `Margin collision at ${width}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.emulateMedia({ media: 'print' });
    assert.deepEqual(await page.locator('main .sl-markdown-content').evaluate(e => ({
      text: getComputedStyle(e).color, background: getComputedStyle(document.body).backgroundColor,
    })), { text: 'rgb(60, 56, 47)', background: 'rgb(255, 255, 255)' }, 'Printing from dark mode must use dark ink on white');
    assert.equal(await page.locator('.subject-index-toggle').isVisible(), false);
    await context.close();
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJS.newPage();
    await staticPage.goto(`${origin}${routes[0][1]}#rem-R2_general`);
    assert.equal(await staticPage.locator('#rem-R2_general').getAttribute('data-math-kind'), 'remark');
    assert.ok(await staticPage.locator('main .sl-markdown-content').evaluate(e => getComputedStyle(e).fontFamily.includes('ET Book')), 'The approved book theme must not require JavaScript');
    await staticPage.getByRole('button', { name: 'Open subject index', exact: true }).click();
    assert.equal(await staticPage.locator('#starlight__sidebar').evaluate(e => e.matches(':popover-open')), true);
    await staticPage.getByRole('button', { name: 'Close subject index', exact: true }).click();
    assert.equal(await staticPage.locator('#starlight__sidebar').evaluate(e => e.matches(':popover-open')), false);
    await noJS.close();
    await reviewNavigation(browser, { origin, output, reports });
    console.log(`Passed theme review: ${reports.length} captures; aligned mathematical blocks; native navigation, touch close targets, breakpoint/scroll transitions, contents tracking and no-JS exposition.\n${output}`);
  } finally {
    await writeFile(path.join(output, 'report.json'), JSON.stringify(reports, null, 2) + '\n');
  }
}
