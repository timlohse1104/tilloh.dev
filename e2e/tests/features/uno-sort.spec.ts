import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('Uno Sort', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/uno-sort`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // Warte bis UNO-Heading sichtbar ist (Locale initialisiert)
    await expect(authenticatedPage.locator('h1')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt UNO-Heading', async ({ authenticatedPage }) => {
    const heading = authenticatedPage.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10_000 });
    await expect(heading).toHaveText('UNO');
  });

  test('startet mit 7 Karten in der Hand', async ({ authenticatedPage }) => {
    const handCards = authenticatedPage.locator('#player_hand .uno_card');
    await expect(handCards).toHaveCount(7, { timeout: 10_000 });
  });

  test('zeigt Karte ziehen Button', async ({ authenticatedPage }) => {
    const drawButton = authenticatedPage
      .locator('button.bx--btn')
      .filter({ hasText: /Draw|Zieh/i });
    await expect(drawButton).toBeVisible({ timeout: 10_000 });
  });

  test('Karte ziehen erhöht Kartenanzahl in der Hand', async ({
    authenticatedPage,
  }) => {
    const initialCards = await authenticatedPage
      .locator('#player_hand .uno_card')
      .count();

    const drawButton = authenticatedPage
      .locator('button.bx--btn')
      .filter({ hasText: /Draw|Zieh/i });
    await drawButton.click();
    await authenticatedPage.waitForTimeout(500);

    const newCards = await authenticatedPage
      .locator('#player_hand .uno_card')
      .count();
    expect(newCards).toBeGreaterThan(initialCards);
  });

  test('Reset setzt auf 7 Startkarten zurück', async ({ authenticatedPage }) => {
    // Erst Karte ziehen
    const drawButton = authenticatedPage
      .locator('button.bx--btn')
      .filter({ hasText: /Draw|Zieh/i });
    await drawButton.click();
    await authenticatedPage.waitForTimeout(500);

    // Reset klicken – Button hat Text "Reset"
    const resetButton = authenticatedPage
      .locator('button.bx--btn')
      .filter({ hasText: /Reset/i });
    await resetButton.click();
    await authenticatedPage.waitForTimeout(500);

    const cardsAfterReset = await authenticatedPage
      .locator('#player_hand .uno_card')
      .count();
    expect(cardsAfterReset).toBe(7);
  });
});
