import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

// localStorage-Key des todoStore
const TODO_STORE_KEY = 'todos';

test.describe('Todo', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/todo`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // FAB immer sichtbar sobald Todo-Seite geladen hat
    await expect(authenticatedPage.locator('#list_menu_button')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Leer-Zustand wenn keine Listen vorhanden', async ({
    authenticatedPage,
  }) => {
    // Keine Listen → Leer-Zustand mit h1
    await expect(authenticatedPage.locator('main h1')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('Listen-Menü-FAB ist sichtbar', async ({ authenticatedPage }) => {
    await expect(
      authenticatedPage.locator('#list_menu_button'),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('Listen-Menü öffnet Modal mit Leer-Hinweis', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.locator('#list_menu_button').click();
    const modal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(modal).toBeVisible({ timeout: 10_000 });
  });

  test('Neue Liste erstellen erscheint in der Ansicht', async ({
    authenticatedPage,
  }) => {
    // Menü öffnen
    await authenticatedPage.locator('#list_menu_button').click();
    const menuModal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(menuModal).toBeVisible({ timeout: 10_000 });

    // "Neue Liste erstellen" Button klicken
    const createButton = menuModal
      .locator('button.bx--btn')
      .filter({ hasText: /Neu|New|Erstell/i });
    await createButton.first().click();

    // Direkt auf .create_list_section warten (eindeutig für TodoListOverlay)
    // Nicht via .bx--modal.is-visible scropen – vermeidet Verwechslung mit dem
    // schließenden Side-Menu-Modal während der Carbon-Animation
    const nameInput = authenticatedPage
      .locator('.create_list_section .bx--text-input')
      .first();
    await expect(nameInput).toBeVisible({ timeout: 10_000 });
    await expect(nameInput).toBeEditable({ timeout: 5_000 });
    await nameInput.fill('E2E-Testliste');
    await authenticatedPage.waitForTimeout(200);

    // Speichern (primärer Button im sichtbaren Modal)
    await authenticatedPage
      .locator('.bx--modal.is-visible .bx--btn--primary')
      .first()
      .click();

    // Die TodoList-Komponente erscheint (Input-Sektion wird sichtbar)
    await expect(authenticatedPage.locator('.input_section')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('Todo zu bestehender Liste hinzufügen', async ({
    authenticatedPage,
  }) => {
    // Liste per localStorage vor dem Seitenaufruf einrichten
    await authenticatedPage.evaluate((key) => {
      const list = [
        {
          id: 'e2e-todo-list-id',
          name: 'E2E-Liste',
          emoji: '📝',
          todos: [],
          history: [],
          categories: [],
          isShared: false,
        },
      ];
      localStorage.setItem(key, JSON.stringify(list));
    }, TODO_STORE_KEY);

    // Seite neu laden damit Store die Daten übernimmt
    await authenticatedPage.reload();
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });

    // Input-Sektion ist sichtbar (Liste existiert → TodoList rendert)
    // .bx--text-input statt input[type="text"] für zuverlässigere Selektierung
    const todoInput = authenticatedPage
      .locator('.input_section .bx--text-input')
      .first();
    await expect(todoInput).toBeVisible({ timeout: 15_000 });
    await expect(todoInput).toBeEditable({ timeout: 5_000 });

    // Todo-Titel eingeben und mit Enter bestätigen
    await todoInput.fill('E2E-Aufgabe');
    await todoInput.press('Enter');
    await authenticatedPage.waitForTimeout(300);

    // Todo erscheint in der Liste
    const todoEntry = authenticatedPage.locator('text=E2E-Aufgabe');
    await expect(todoEntry).toBeVisible({ timeout: 10_000 });
  });
});
