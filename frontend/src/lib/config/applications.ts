import { TogglesEnum } from '$lib/types/toggle.dto';
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
    toggle: await getToggleValue(TogglesEnum.memorandum),
  },
  todo: {
    name: 'Listen',
    path: '/todo',
    icon: 'list',
    toggle: await getToggleValue(TogglesEnum.todo),
  },
  chat: {
    name: 'Klönschnack',
    path: '/chat',
    icon: 'chat',
    toggle: await getToggleValue(TogglesEnum.chat),
  },
  'catch-em-all': {
    name: 'Catch-Em-All',
    path: '/catch-em-all',
    icon: 'sports_esports',
    toggle: await getToggleValue(TogglesEnum.catchEmAll),
  },
  'uno-sort': {
    name: 'UNO Sortierung',
    path: '/uno-sort',
    icon: 'style',
    toggle: await getToggleValue(TogglesEnum.unoSort),
  },
  about: {
    name: 'Über mich',
    path: '/about',
    icon: 'badge',
    toggle: await getToggleValue(TogglesEnum.about),
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
