import { expect, test } from '@playwright/test';

test('placeholder smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/.*/);
});
