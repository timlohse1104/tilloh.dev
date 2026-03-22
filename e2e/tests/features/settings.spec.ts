import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Einstellungen', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/settings`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // Warte bis SettingsDashboard geladen hat
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('zeigt vier Settings-Karten', async ({ authenticatedPage }) => {
    const cards = authenticatedPage.locator('.admin_dashboard_card');
    await expect(cards).toHaveCount(4, { timeout: 10_000 });
  });

  test('Theme-Schalter ist sichtbar', async ({ authenticatedPage }) => {
    // Seite hat genau 2 Toggles: Theme (0) und Language (1)
    const toggles = authenticatedPage.locator('.bx--toggle-input__label');
    await expect(toggles.first()).toBeVisible({ timeout: 10_000 });
    // ☀️ Emoji ist auf der Seite sichtbar (ThemeSwitch)
    await expect(authenticatedPage.locator('text=☀️')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('Sprachschalter ist sichtbar', async ({ authenticatedPage }) => {
    // DE und EN Flaggen-Emojis sind sichtbar (LanguageSwitch)
    await expect(authenticatedPage.locator('text=🇩🇪')).toBeVisible({
      timeout: 10_000,
    });
    await expect(authenticatedPage.locator('text=🇬🇧')).toBeVisible({
      timeout: 10_000,
    });
    // Sprach-Toggle ist der zweite Toggle auf der Seite
    const langToggle = authenticatedPage
      .locator('.bx--toggle-input__label')
      .nth(1);
    await expect(langToggle).toBeVisible({ timeout: 10_000 });
  });

  test('Sprachschalter wechselt Sprache auf Englisch', async ({
    authenticatedPage,
  }) => {
    // Ausgangszustand explizit auf DE setzen (Default ist 'en')
    await authenticatedPage.evaluate(() =>
      localStorage.setItem('language', 'de'),
    );
    await authenticatedPage.reload();
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });

    // Sprach-Toggle ist der zweite Toggle (Theme ist erster)
    const langToggle = authenticatedPage
      .locator('.bx--toggle-input__label')
      .nth(1);
    await expect(langToggle).toBeVisible({ timeout: 5_000 });

    // DE → EN schalten
    await langToggle.click();
    await authenticatedPage.waitForTimeout(300);

    // localStorage muss 'en' enthalten
    const lang = await authenticatedPage.evaluate(() =>
      localStorage.getItem('language'),
    );
    expect(lang).toBe('en');
  });

  test('Sprachänderung bleibt nach Reload erhalten', async ({
    authenticatedPage,
  }) => {
    // Sprache auf Englisch setzen
    await authenticatedPage.evaluate(() =>
      localStorage.setItem('language', 'en'),
    );
    await authenticatedPage.reload();
    await expect(
      authenticatedPage.locator('.admin_dashboard_card').first(),
    ).toBeVisible({ timeout: 15_000 });

    // localStorage-Wert bleibt erhalten
    const lang = await authenticatedPage.evaluate(() =>
      localStorage.getItem('language'),
    );
    expect(lang).toBe('en');
  });
});
