import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Jokes-Seite', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/jokes`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // Warte bis Jokes-Komponente geladen ist (nicht mehr "Locale initializing...")
    await expect(authenticatedPage.locator('h1')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Zufallswitz-Karte', async ({ authenticatedPage }) => {
    // Warte auf die Witz-Kachel (erscheint wenn randomJoke.created gesetzt)
    const jokeTile = authenticatedPage.locator('.bx--tile');
    await expect(jokeTile).toBeVisible({ timeout: 15_000 });
  });

  test('zeigt Neuen Witz laden Button', async ({ authenticatedPage }) => {
    const loadButton = authenticatedPage.locator('button.bx--btn').filter({
      hasText: /Neuer Witz|New Joke|New random/i,
    });
    await expect(loadButton).toBeVisible({ timeout: 10_000 });
  });

  test('lädt neuen Witz bei Button-Klick', async ({ authenticatedPage }) => {
    // Erst Witz-Kachel abwarten
    const jokeTile = authenticatedPage.locator('.bx--tile i');
    await expect(jokeTile).toBeVisible({ timeout: 15_000 });
    const initialText = await jokeTile.textContent();

    const loadButton = authenticatedPage.locator('button.bx--btn').filter({
      hasText: /Neuer Witz|New Joke|New random/i,
    });
    await loadButton.click();
    await authenticatedPage.waitForTimeout(1500);

    await expect(jokeTile).toBeVisible({ timeout: 10_000 });
  });

  test('FAB-Button öffnet Create-Witz-Modal', async ({ authenticatedPage }) => {
    const fabButton = authenticatedPage.locator('#add_joke_button');
    await expect(fabButton).toBeVisible({ timeout: 10_000 });
    await fabButton.click();

    const modal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(modal).toBeVisible({ timeout: 10_000 });
  });

  test('Create-Modal schließen mit Close-Button', async ({
    authenticatedPage,
  }) => {
    const fabButton = authenticatedPage.locator('#add_joke_button');
    await fabButton.click();

    const modal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(modal).toBeVisible({ timeout: 10_000 });

    // Close-Button des Carbon Modals klicken
    await authenticatedPage.locator('.bx--modal-close').click();
    await expect(modal).not.toBeVisible({ timeout: 5_000 });
  });
});
