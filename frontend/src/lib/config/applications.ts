import { getToggleValue } from '$lib/util/toggle';

const loadApplications = async () => ({
  home: {
    name: 'Startseite',
    path: '/',
    icon: 'home',
    toggle: true,
  },
  memorandum: {
    name: 'Memorandum',
    path: '/memorandum',
    icon: 'bookmarks',
    toggle: await getToggleValue('TOGGLE_NAV_MEMORANDUM'),
  },
  todo: {
    name: 'Listen',
    path: '/todo',
    icon: 'list',
    toggle: await getToggleValue('TOGGLE_NAV_TODO'),
  },
  chat: {
    name: 'Klönschnack',
    path: '/chat',
    icon: 'chat',
    toggle: await getToggleValue('TOGGLE_NAV_CHAT'),
  },
  'catch-em-all': {
    name: 'Catch-Em-All',
    path: '/catch-em-all',
    icon: 'sports_esports',
    toggle: await getToggleValue('TOGGLE_NAV_CATCH_EM_ALL'),
  },
  'uno-sort': {
    name: 'UNO Sortierung',
    path: '/uno-sort',
    icon: 'style',
    toggle: await getToggleValue('TOGGLE_NAV_UNO_SORT'),
  },
  about: {
    name: 'Über mich',
    path: '/about',
    icon: 'badge',
    toggle: await getToggleValue('TOGGLE_NAV_ABOUT'),
  },
});

export const applicationRoutes = await loadApplications();

export const utilityRoutes = {
  settings: {
    name: 'Einstellungen',
    path: '/settings',
    icon: 'settings',
  },
  admin: {
    name: 'Admin',
    path: '/admin',
    icon: 'admin_panel_settings',
  },
};
