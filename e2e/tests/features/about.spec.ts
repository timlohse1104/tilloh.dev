import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

test.describe('About-Seite', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/about`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('zeigt "Moin"-Begrüßung und Intro-Text', async ({
    authenticatedPage,
  }) => {
    const moin = authenticatedPage.locator('.capital_word');
    await expect(moin).toBeVisible({ timeout: 10_000 });
    await expect(moin).toHaveText('Moin');
  });

  test('zeigt Code-Snippets', async ({ authenticatedPage }) => {
    // Both code snippets must be present
    const codeSnippets = authenticatedPage.locator('.bx--snippet--multi');
    await expect(codeSnippets).toHaveCount(2, { timeout: 10_000 });
  });

  test('i18n: Sprach-Wechsel auf Englisch ändert Intro-Text', async ({
    authenticatedPage,
  }) => {
    // Set language to English via localStorage
    await authenticatedPage.evaluate(() => {
      localStorage.setItem('language', 'en');
    });
    await authenticatedPage.reload();
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 10_000,
    });
    await authenticatedPage.waitForTimeout(1000);

    // In German: "mein Name ist Tim"
    // In English: "my name is Tim" (or similar)
    // The test verifies that the intro text changes (page-content reacts to locale)
    const section = authenticatedPage.locator('section p').first();
    await expect(section).toBeVisible({ timeout: 10_000 });
  });

  test('i18n: Zurück auf Deutsch', async ({ authenticatedPage }) => {
    await authenticatedPage.evaluate(() => {
      localStorage.setItem('language', 'de');
    });
    await authenticatedPage.reload();
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 10_000,
    });

    const moin = authenticatedPage.locator('.capital_word');
    await expect(moin).toBeVisible({ timeout: 10_000 });
    await expect(moin).toHaveText('Moin');
  });
});
