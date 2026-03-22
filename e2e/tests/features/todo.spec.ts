import { expect, test } from '../../fixtures/authenticated.fixture';
import { FRONTEND_URL } from '../../helpers/constants';

// localStorage key for the todoStore
const TODO_STORE_KEY = 'todos';

test.describe('Todo', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/todo`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });
    // FAB always visible once the Todo page has loaded
    await expect(authenticatedPage.locator('#list_menu_button')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('zeigt Leer-Zustand wenn keine Listen vorhanden', async ({
    authenticatedPage,
  }) => {
    // No lists → empty state with h1
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
    // Open menu
    await authenticatedPage.locator('#list_menu_button').click();
    const menuModal = authenticatedPage.locator('.bx--modal.is-visible');
    await expect(menuModal).toBeVisible({ timeout: 10_000 });

    // Click the "create new list" button
    const createButton = menuModal
      .locator('button.bx--btn')
      .filter({ hasText: /Neu|New|Erstell/i });
    await createButton.first().click();

    // Wait directly on .create_list_section (unique to TodoListOverlay)
    // Do not scope via .bx--modal.is-visible — avoids confusion with the
    // closing side-menu modal during Carbon animation
    const nameInput = authenticatedPage
      .locator('.create_list_section .bx--text-input')
      .first();
    await expect(nameInput).toBeVisible({ timeout: 10_000 });
    await expect(nameInput).toBeEditable({ timeout: 5_000 });
    await nameInput.fill('E2E-Testliste');
    await authenticatedPage.waitForTimeout(200);

    // Save (primary button in the visible modal)
    await authenticatedPage
      .locator('.bx--modal.is-visible .bx--btn--primary')
      .first()
      .click();

    // The TodoList component appears (input section becomes visible)
    await expect(authenticatedPage.locator('.input_section')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('Todo zu bestehender Liste hinzufügen', async ({
    authenticatedPage,
  }) => {
    // Set up a list via localStorage before page load
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

    // Reload page so the store picks up the data
    await authenticatedPage.reload();
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });

    // Input section is visible (list exists → TodoList renders)
    // Use .bx--text-input instead of input[type="text"] for more reliable selection
    const todoInput = authenticatedPage
      .locator('.input_section .bx--text-input')
      .first();
    await expect(todoInput).toBeVisible({ timeout: 15_000 });
    await expect(todoInput).toBeEditable({ timeout: 5_000 });

    // Enter todo title and confirm with Enter
    await todoInput.fill('E2E-Aufgabe');
    await todoInput.press('Enter');
    await authenticatedPage.waitForTimeout(300);

    // Todo appears in the list
    const todoEntry = authenticatedPage.locator('text=E2E-Aufgabe');
    await expect(todoEntry).toBeVisible({ timeout: 10_000 });
  });
});
