import { TogglesEnum } from '$lib/types/toggle.dto';
import { getToggleValue } from '$lib/util/toggle';

const loadApplications = async () => ({
  home: {
    id: 'home',
    name: { en: 'Home', de: 'Startseite' },
    path: '/',
    icon: 'Home',
    toggle: true,
  },
  memorandum: {
    id: 'memorandum',
    name: { en: 'Memorandum', de: 'Memorandum' },
    path: '/memorandum',
    icon: 'Bookmark',
    toggle: await getToggleValue(TogglesEnum.memorandum),
  },
  jokes: {
    id: 'jokes',
    name: { en: 'Jokes', de: 'Witze' },
    path: '/jokes',
    icon: 'Cognitive',
    toggle: await getToggleValue(TogglesEnum.jokes),
  },
  todo: {
    id: 'todo',
    name: { en: 'Lists', de: 'Listen' },
    path: '/todo',
    icon: 'ListBoxes',
    toggle: await getToggleValue(TogglesEnum.todo),
  },
  'food-scan': {
    id: 'food-scan',
    name: { en: 'Food Scan', de: 'Essen-Scan' },
    path: '/food-scan',
    icon: 'Restaurant',
    toggle: await getToggleValue(TogglesEnum.foodScan),
  },
  chat: {
    id: 'chat',
    name: { en: 'Chat', de: 'Klönschnack' },
    path: '/chat',
    icon: 'Chat',
    toggle: await getToggleValue(TogglesEnum.chat),
  },
  'catch-em-all': {
    id: 'catch-em-all',
    name: { en: 'Catch-em-all', de: 'Catch-em-all' },
    path: '/catch-em-all',
    icon: 'GameConsole',
    toggle: await getToggleValue(TogglesEnum.catchEmAll),
  },
  'uno-sort': {
    id: 'uno-sort',
    name: { en: 'Uno sort', de: 'Uno Sortierung' },
    path: '/uno-sort',
    icon: 'GameConsole',
    toggle: await getToggleValue(TogglesEnum.unoSort),
  },
  about: {
    id: 'about',
    name: { en: 'About me', de: 'Über mich' },
    path: '/about',
    icon: 'Identification',
    toggle: await getToggleValue(TogglesEnum.about),
  },
});

export const applicationRoutes = await loadApplications();

export const utilityRoutes = {
  settings: {
    id: 'settings',
    name: { en: 'Settings', de: 'Einstellungen' },
    path: '/settings',
    icon: 'Settings',
    toggle: () => true,
  },
  admin: {
    id: 'admin',
    name: { en: 'Admin area', de: 'Admin Bereich' },
    path: '/admin',
    icon: 'SecurityServices',
    toggle: () => true,
  },
};

export const adminSubRoutes = {
  idenfiers: {
    id: 'idenfiers',
    name: { en: 'Identifiers', de: 'Identifikatoren' },
    path: '/admin/identifiers',
    icon: 'FingerprintRecognition',
    toggle: () => true,
  },
  jokes: {
    id: 'jokes',
    name: { en: 'Jokes', de: 'Witze' },
    path: '/admin/jokes',
    icon: 'Cognitive',
    toggle: () => true,
  },
  presets: {
    id: 'presets',
    name: { en: 'Presets', de: 'Voreinstellungen' },
    path: '/admin/presets',
    icon: 'Bookmark',
    toggle: () => true,
  },
  toggles: {
    id: 'toggles',
    name: { en: 'Toggles', de: 'Schalter' },
    path: '/admin/toggles',
    icon: 'RadioButtonChecked',
    toggle: () => true,
  },
};
