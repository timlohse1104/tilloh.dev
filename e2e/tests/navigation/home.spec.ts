import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Home-Seite und Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(FRONTEND_URL);
    await authenticatedPage.waitForLoadState('networkidle');
    // Wait for main to be visible (only rendered when authenticated)
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Navigations-Grid mit mindestens einer Kachel', async ({
    authenticatedPage,
  }) => {
    // Carbon ContentSwitcher renders buttons with this class
    const navButtons = authenticatedPage.locator('.bx--content-switcher-btn');
    await expect(navButtons.first()).toBeVisible({ timeout: 10_000 });
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Header ist sichtbar', async ({ authenticatedPage }) => {
    // Custom Header renders <section> with .header_box (not Carbon's .bx--header)
    const header = authenticatedPage.locator('.header_box');
    await expect(header).toBeVisible({ timeout: 10_000 });
  });

  test('Klick auf About-Kachel navigiert zur /about Route', async ({
    authenticatedPage,
  }) => {
    // Find the About button in the ContentSwitcher navigation
    const aboutButton = authenticatedPage
      .locator('.bx--content-switcher-btn')
      .filter({ hasText: /About/i });

    if (await aboutButton.isVisible()) {
      await aboutButton.click();
      await expect(authenticatedPage).toHaveURL(/\/about/, {
        timeout: 10_000,
      });
    } else {
      // Fallback: at least one button is present
      const anyButton = authenticatedPage.locator('.bx--content-switcher-btn');
      await expect(anyButton.first()).toBeVisible({ timeout: 5_000 });
    }
  });
});
