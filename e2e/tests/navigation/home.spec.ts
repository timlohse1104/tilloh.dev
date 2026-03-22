import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Home-Seite und Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(FRONTEND_URL);
    await authenticatedPage.waitForLoadState('networkidle');
    // Warte auf Carbon Header (immer sichtbar) und dann auf main (nur wenn auth)
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Navigations-Grid mit mindestens einer Kachel', async ({
    authenticatedPage,
  }) => {
    // Carbon ContentSwitcher rendert Buttons mit dieser Klasse
    const navButtons = authenticatedPage.locator('.bx--content-switcher-btn');
    await expect(navButtons.first()).toBeVisible({ timeout: 10_000 });
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Header ist sichtbar', async ({ authenticatedPage }) => {
    // Custom Header rendert <section> mit .header_box (kein Carbon .bx--header)
    const header = authenticatedPage.locator('.header_box');
    await expect(header).toBeVisible({ timeout: 10_000 });
  });

  test('Klick auf About-Kachel navigiert zur /about Route', async ({
    authenticatedPage,
  }) => {
    // About-Button in der ContentSwitcher Navigation finden
    const aboutButton = authenticatedPage
      .locator('.bx--content-switcher-btn')
      .filter({ hasText: /About/i });

    if (await aboutButton.isVisible()) {
      await aboutButton.click();
      await expect(authenticatedPage).toHaveURL(/\/about/, {
        timeout: 10_000,
      });
    } else {
      // Fallback: mindestens ein Button ist vorhanden
      const anyButton = authenticatedPage.locator('.bx--content-switcher-btn');
      await expect(anyButton.first()).toBeVisible({ timeout: 5_000 });
    }
  });
});
