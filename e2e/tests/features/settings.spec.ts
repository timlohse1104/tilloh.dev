import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Einstellungen', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/settings`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // Wait until SettingsDashboard has loaded
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('zeigt vier Settings-Karten', async ({ authenticatedPage }) => {
    const cards = authenticatedPage.locator('.admin_dashboard_card');
    await expect(cards).toHaveCount(4, { timeout: 10_000 });
  });

  test('Theme-Schalter ist sichtbar', async ({ authenticatedPage }) => {
    // Page has exactly 2 toggles: Theme (0) and Language (1)
    const toggles = authenticatedPage.locator('.bx--toggle-input__label');
    await expect(toggles.first()).toBeVisible({ timeout: 10_000 });
    // ☀️ emoji is visible on the page (ThemeSwitch)
    await expect(authenticatedPage.locator('text=☀️')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('Sprachschalter ist sichtbar', async ({ authenticatedPage }) => {
    // DE and EN flag emojis are visible (LanguageSwitch)
    await expect(authenticatedPage.locator('text=🇩🇪')).toBeVisible({
      timeout: 10_000,
    });
    await expect(authenticatedPage.locator('text=🇬🇧')).toBeVisible({
      timeout: 10_000,
    });
    // Language toggle is the second toggle on the page
    const langToggle = authenticatedPage
      .locator('.bx--toggle-input__label')
      .nth(1);
    await expect(langToggle).toBeVisible({ timeout: 10_000 });
  });

  test('Sprachschalter wechselt Sprache auf Englisch', async ({
    authenticatedPage,
  }) => {
    // Explicitly set initial state to DE (default is 'en')
    await authenticatedPage.evaluate(() =>
      localStorage.setItem('language', 'de'),
    );
    await authenticatedPage.reload();
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });

    // Language toggle is the second toggle (Theme is first)
    const langToggle = authenticatedPage
      .locator('.bx--toggle-input__label')
      .nth(1);
    await expect(langToggle).toBeVisible({ timeout: 5_000 });

    // Switch DE → EN
    await langToggle.click();
    await authenticatedPage.waitForTimeout(300);

    // localStorage must contain 'en'
    const lang = await authenticatedPage.evaluate(() =>
      localStorage.getItem('language'),
    );
    expect(lang).toBe('en');
  });

  test('Sprachänderung bleibt nach Reload erhalten', async ({
    authenticatedPage,
  }) => {
    // Set language to English
    await authenticatedPage.evaluate(() =>
      localStorage.setItem('language', 'en'),
    );
    await authenticatedPage.reload();
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });

    // localStorage value persists
    const lang = await authenticatedPage.evaluate(() =>
      localStorage.getItem('language'),
    );
    expect(lang).toBe('en');
  });
});
