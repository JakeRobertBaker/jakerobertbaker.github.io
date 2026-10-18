import { test } from '@playwright/test';
import { reviewTheme } from './theme/review.mjs';

test('book theme: full-width blocks, contents, responsive controls and touch dismissal', async ({ browser, baseURL }, testInfo) => {
  test.setTimeout(240_000);
  await reviewTheme(browser, { origin: baseURL!, output: testInfo.outputPath('theme-review') });
});
