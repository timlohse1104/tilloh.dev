import * as fs from 'fs';
import { test as base, type Page } from '@playwright/test';
import { TEST_STATE_FILE } from '../helpers/constants';

type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

/**
 * Custom fixture that injects a valid identifier into localStorage before
 * navigating to the app, bypassing the GlobalLogin gate.
 */
export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const state = JSON.parse(fs.readFileSync(TEST_STATE_FILE, 'utf-8'));
    const testIdentifierId: string = state.testIdentifierId;

    // Set identifier in localStorage before page load so the layout reads it
    await page.addInitScript(
      (id: string) => {
        localStorage.setItem('identifier', id);
      },
      testIdentifierId,
    );

    await use(page);
  },
});

export { expect } from '@playwright/test';
