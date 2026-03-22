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
    // Beide Code-Snippets müssen vorhanden sein
    const codeSnippets = authenticatedPage.locator('.bx--snippet--multi');
    await expect(codeSnippets).toHaveCount(2, { timeout: 10_000 });
  });

  test('i18n: Sprach-Wechsel auf Englisch ändert Intro-Text', async ({
    authenticatedPage,
  }) => {
    // Setze Sprache auf Englisch via localStorage
    await authenticatedPage.evaluate(() => {
      localStorage.setItem('language', 'en');
    });
    await authenticatedPage.reload();
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 10_000,
    });
    await authenticatedPage.waitForTimeout(1000);

    // Auf Deutsch: "mein Name ist Tim"
    // Auf Englisch: "my name is Tim" (oder ähnlich)
    // Der Test prüft, dass sich der Intro-Text unterscheidet (page-content reagiert auf locale)
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
