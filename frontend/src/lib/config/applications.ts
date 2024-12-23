import { TogglesEnum } from '$lib/types/toggle.dto';
import { getToggleValue } from '$lib/util/toggle';

const loadApplications = async () => ({
  home: {
    name: { en: 'Home', de: 'Startseite' },
    path: '/',
    icon: 'home',
    toggle: true,
  },
  memorandum: {
    name: { en: 'Memorandum', de: 'Memorandum' },
    path: '/memorandum',
    icon: 'bookmarks',
    toggle: await getToggleValue(TogglesEnum.memorandum),
  },
  jokes: {
    name: { en: 'Jokes', de: 'Witze' },
    path: '/jokes',
    icon: 'psychology',
    toggle: await getToggleValue(TogglesEnum.jokes),
  },
  todo: {
    name: { en: 'Lists', de: 'Listen' },
    path: '/todo',
    icon: 'list',
    toggle: await getToggleValue(TogglesEnum.todo),
  },
  'food-scan': {
    name: { en: 'Food Scan', de: 'Essen-Scan' },
    path: '/food-scan',
    icon: 'fastfood',
    toggle: await getToggleValue(TogglesEnum.foodScan),
  },
  chat: {
    name: { en: 'Chat', de: 'Klönschnack' },
    path: '/chat',
    icon: 'chat',
    toggle: await getToggleValue(TogglesEnum.chat),
  },
  'catch-em-all': {
    name: { en: 'Catch-em-all', de: 'Catch-em-all' },
    path: '/catch-em-all',
    icon: 'sports_esports',
    toggle: await getToggleValue(TogglesEnum.catchEmAll),
  },
  'uno-sort': {
    name: { en: 'Uno sort', de: 'Uno Sortierung' },
    path: '/uno-sort',
    icon: 'style',
    toggle: await getToggleValue(TogglesEnum.unoSort),
  },
  about: {
    name: { en: 'About me', de: 'Über mich' },
    path: '/about',
    icon: 'badge',
    toggle: await getToggleValue(TogglesEnum.about),
  },
});

export const applicationRoutes = await loadApplications();

export const utilityRoutes = {
  settings: {
    name: { en: 'Settings', de: 'Einstellungen' },
    path: '/settings',
    icon: 'settings',
  },
  admin: {
    name: { en: 'Admin area', de: 'Admin Bereich' },
    path: '/admin',
    icon: 'admin_panel_settings',
  },
};
