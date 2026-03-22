import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Memorandum', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/memorandum`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // FAB ist sichtbar sobald der Preset-Store geladen hat
    await expect(authenticatedPage.locator('#add_folder_button')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Startup-Screen mit zwei Kacheln wenn keine Ordner vorhanden', async ({
    authenticatedPage,
  }) => {
    const startupCards = authenticatedPage.locator('.startup_card');
    await expect(startupCards).toHaveCount(2, { timeout: 10_000 });
  });

  test('Suchleiste ist sichtbar', async ({ authenticatedPage }) => {
    await expect(
      authenticatedPage.locator('.bx--search-input'),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('FAB öffnet Ordner-Erstellen-Modal', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('#add_folder_button').click();
    const modal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(modal).toBeVisible({ timeout: 10_000 });
  });

  test('Ordner erstellen über FAB-Modal zeigt Ordner mit Titel', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.locator('#add_folder_button').click();
    const modal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(modal).toBeVisible({ timeout: 10_000 });

    // Warten bis Carbon-Modal-Animation abgeschlossen ist und Input interaktiv ist
    const nameInput = modal.locator('.bx--text-input').first();
    await expect(nameInput).toBeEditable({ timeout: 5_000 });
    await nameInput.fill('E2E-Testordner');
    await authenticatedPage.waitForTimeout(200);

    // Speichern
    await modal.locator('.bx--btn--primary').click();

    // Modal schließt sich und Ordner erscheint
    await expect(modal).not.toBeVisible({ timeout: 5_000 });
    await expect(
      authenticatedPage.locator('.folder_title', { hasText: 'E2E-Testordner' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Standard-Preset laden zeigt Ordner-Raster', async ({
    authenticatedPage,
  }) => {
    // Zweite Startup-Kachel hat den "Preset laden"-Button
    const presetButton = authenticatedPage
      .locator('.startup_card')
      .nth(1)
      .locator('button');
    await presetButton.click();

    // Nach dem Laden sollten Ordner-Titel erscheinen
    const folderTitles = authenticatedPage.locator('.folder_title');
    await expect(folderTitles.first()).toBeVisible({ timeout: 10_000 });
    const count = await folderTitles.count();
    expect(count).toBeGreaterThan(0);
  });
});
