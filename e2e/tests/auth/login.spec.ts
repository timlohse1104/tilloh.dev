import * as fs from 'fs';
import { expect, test } from '@playwright/test';
import { FRONTEND_URL, TEST_STATE_FILE } from '../../helpers/constants';

test.describe('Login-Gate', () => {
  test.beforeEach(async ({ page }) => {
    // Kein auth fixture – wir testen den echten Login-Flow
    await page.goto(FRONTEND_URL);
    // Warte auf Login-Gate (kein Identifier → Passwort-Feld erscheint)
    await expect(page.locator('input[type="password"]')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Login-Gate wenn kein Identifier gesetzt ist', async ({ page }) => {
    // localStorage leer → identifierStore = '' → isVerified = false
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
  });

  test('Login mit gültigem Identifier navigiert zur App', async ({ page }) => {
    const state = JSON.parse(fs.readFileSync(TEST_STATE_FILE, 'utf-8'));
    const testIdentifierId: string = state.testIdentifierId;

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });

    // fill() + kurze Pause damit Svelte bind:value updaten kann
    await passwordInput.fill(testIdentifierId);
    await page.waitForTimeout(300);
    await passwordInput.press('Enter');

    // Nach erfolgreichem Login soll main sichtbar sein
    await expect(page.locator('main')).toBeVisible({ timeout: 15_000 });
    await expect(passwordInput).not.toBeVisible();
  });

  test('Login mit ungültigem Identifier zeigt Fehlermeldung', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
    await passwordInput.fill('completely-invalid-identifier-xyz-123');
    await page.waitForTimeout(300);
    await passwordInput.press('Enter');

    const notification = page.locator('.bx--inline-notification--error');
    await expect(notification).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toBeVisible();
  });
});
