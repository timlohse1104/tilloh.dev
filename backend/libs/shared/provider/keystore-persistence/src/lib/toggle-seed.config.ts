export const TOGGLE_IDENTIFIER = 'tilloh-toggles';

export interface ToggleSeedEntry {
  key: string;
  defaultValue: string;
}

export const TOGGLE_SEED_CONFIG: ToggleSeedEntry[] = [
  { key: 'TOGGLE_RANDOM_JOKE', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_MEMORANDUM', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_TODO', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_FOOD_SCAN', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_JOKES', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_CATCH_EM_ALL', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_UNO_SORT', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_ABOUT', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_DASHBOARD', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_ACTIVITIES', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_IDENTIFIERS', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_JOKES', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_LINK_PRESETS', defaultValue: 'true' },
  { key: 'TOGGLE_NAV_HITSTAR', defaultValue: 'true' },
];
