import { test, expect } from '@playwright/test';

// A native popover is in the top layer. Visibility alone does not establish
// that its outside Menu/X invoker can receive a touch (the reported bug).
test.describe('mobile navigation dismissal', () => {
  test.use({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });

  test('Menu/X remains visible and tappable on home and scrolled articles', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      for (const route of ['/', '/mathematics/probability/ballot_notes/']) {
        await page.goto(route);
        await page.evaluate(() => window.scrollTo(0, 1100));
        const menu = page.getByRole('button', { name: 'Menu', exact: true });
        const before = await page.evaluate(() => scrollY);
        await menu.tap();
        await expect(page.locator('#starlight__sidebar')).toBeVisible();
        await expect(menu.locator('.close-menu')).toBeVisible();
        expect(await menu.evaluate(element => {
          const rect = element.getBoundingClientRect();
          return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('button') === element;
        })).toBe(true);
        await menu.tap();
        await expect(page.locator('#starlight__sidebar')).toBeHidden();
        await expect(page.locator('.main-frame')).not.toHaveAttribute('inert');
        expect(await page.evaluate(() => scrollY)).toBe(before);
        await menu.tap();
        await page.keyboard.press('Escape');
        await expect(page.locator('#starlight__sidebar')).toBeHidden();
        await expect(page.locator('.main-frame')).not.toHaveAttribute('inert');
      }
    }
  });
});
