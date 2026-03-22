import { test as base, expect } from '../../fixtures/authenticated.fixture';
import { ADMIN_IDENTIFIER, FRONTEND_URL } from '../../helpers/constants';

// Admin-Tests: User-Auth (localStorage) + Admin-Login (UI)
const test = base.extend<{ adminPage: typeof base.prototype.authenticatedPage }>({
  adminPage: async ({ authenticatedPage }, use) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/admin`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });

    // Admin-Login-Gate erscheint (eigenes isVerified im admin layout)
    const passwordInput = authenticatedPage.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
    await passwordInput.fill(ADMIN_IDENTIFIER);
    await authenticatedPage.waitForTimeout(300);
    await passwordInput.press('Enter');

    // Warte auf Dashboard
    await expect(authenticatedPage.locator('.admin_overview')).toBeVisible({
      timeout: 15_000,
    });

    await use(authenticatedPage);
  },
});

test.describe('Admin-Bereich', () => {
  test('zeigt Admin-Login-Gate wenn User auf /admin navigiert', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/admin`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });

    const passwordInput = authenticatedPage.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
  });

  test('falscher Admin-Identifier zeigt Fehlermeldung', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${FRONTEND_URL}/admin`);
    await expect(authenticatedPage.locator('main')).toBeVisible({
      timeout: 15_000,
    });

    const passwordInput = authenticatedPage.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10_000 });
    await passwordInput.fill('wrong-admin-identifier-xyz');
    await authenticatedPage.waitForTimeout(300);
    await passwordInput.press('Enter');

    const notification = authenticatedPage.locator(
      '.bx--inline-notification--error',
    );
    await expect(notification).toBeVisible({ timeout: 10_000 });
  });

  test('erfolgreicher Admin-Login zeigt Dashboard', async ({ adminPage }) => {
    const dashboard = adminPage.locator('.admin_overview');
    await expect(dashboard).toBeVisible({ timeout: 10_000 });
  });

  test('Dashboard zeigt Navigation mit Admin-Sub-Routen', async ({
    adminPage,
  }) => {
    // Carbon ContentSwitcher rendert .bx--content-switcher-btn Buttons
    const navButtons = adminPage.locator('.bx--content-switcher-btn');
    await expect(navButtons.first()).toBeVisible({ timeout: 10_000 });
  });

  test('Dashboard zeigt Refresh-FAB und Admin-Bereich', async ({ adminPage }) => {
    const updateButton = adminPage.locator('#update_admin_info_button');
    await expect(updateButton).toBeVisible({ timeout: 10_000 });

    const adminOverview = adminPage.locator('.admin_overview');
    await expect(adminOverview).toBeVisible({ timeout: 10_000 });
  });
});
