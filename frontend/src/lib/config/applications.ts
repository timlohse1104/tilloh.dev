import { TogglesEnum } from '$lib/types/toggle.dto';
import { getToggleValue } from '$lib/util/toggle';
import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
import Bullhorn from 'carbon-icons-svelte/lib/Bullhorn.svelte';
import Chat from 'carbon-icons-svelte/lib/Chat.svelte';
import Cognitive from 'carbon-icons-svelte/lib/Cognitive.svelte';
import FingerprintRecognition from 'carbon-icons-svelte/lib/FingerprintRecognition.svelte';
import GameConsole from 'carbon-icons-svelte/lib/GameConsole.svelte';
import Home from 'carbon-icons-svelte/lib/Home.svelte';
import Identification from 'carbon-icons-svelte/lib/Identification.svelte';
import ListBoxes from 'carbon-icons-svelte/lib/ListBoxes.svelte';
import RadioButtonChecked from 'carbon-icons-svelte/lib/RadioButtonChecked.svelte';
import Restaurant from 'carbon-icons-svelte/lib/Restaurant.svelte';
import SecurityServices from 'carbon-icons-svelte/lib/SecurityServices.svelte';
import Settings from 'carbon-icons-svelte/lib/Settings.svelte';

// Safari compatibility: Avoid top-level await by loading routes lazily
// This object will be populated after the first access
let cachedRoutes: any = null;

const loadApplications = async () => {
  // Load all toggle values in parallel for better performance
  const [
    memorandumToggle,
    jokesToggle,
    todoToggle,
    foodScanToggle,
    chatToggle,
    catchEmAllToggle,
    unoSortToggle,
    aboutToggle
  ] = await Promise.all([
    getToggleValue(TogglesEnum.memorandum),
    getToggleValue(TogglesEnum.jokes),
    getToggleValue(TogglesEnum.todo),
    getToggleValue(TogglesEnum.foodScan),
    getToggleValue(TogglesEnum.chat),
    getToggleValue(TogglesEnum.catchEmAll),
    getToggleValue(TogglesEnum.unoSort),
    getToggleValue(TogglesEnum.about),
  ]);

  return {
    home: {
      id: 'home',
      name: { en: 'Home', de: 'Startseite' },
      path: '/',
      icon: Home,
      toggle: true,
    },
    memorandum: {
      id: 'memorandum',
      name: { en: 'Memorandum', de: 'Memorandum' },
      path: '/memorandum',
      icon: Bookmark,
      toggle: memorandumToggle,
    },
    jokes: {
      id: 'jokes',
      name: { en: 'Jokes', de: 'Witze' },
      path: '/jokes',
      icon: Cognitive,
      toggle: jokesToggle,
    },
    todo: {
      id: 'todo',
      name: { en: 'Lists', de: 'Listen' },
      path: '/todo',
      icon: ListBoxes,
      toggle: todoToggle,
    },
    'food-scan': {
      id: 'food-scan',
      name: { en: 'Food Scan', de: 'Essen-Scan' },
      path: '/food-scan',
      icon: Restaurant,
      toggle: foodScanToggle,
    },
    chat: {
      id: 'chat',
      name: { en: 'Chat', de: 'Klönschnack' },
      path: '/chat',
      icon: Chat,
      toggle: chatToggle,
    },
    'catch-em-all': {
      id: 'catch-em-all',
      name: { en: 'Catch-em-all', de: 'Catch-em-all' },
      path: '/catch-em-all',
      icon: GameConsole,
      toggle: catchEmAllToggle,
    },
    'uno-sort': {
      id: 'uno-sort',
      name: { en: 'Uno sort', de: 'Uno Sortierung' },
      path: '/uno-sort',
      icon: GameConsole,
      toggle: unoSortToggle,
    },
    about: {
      id: 'about',
      name: { en: 'About me', de: 'Über mich' },
      path: '/about',
      icon: Identification,
      toggle: aboutToggle,
    },
  };
};

// Initialize immediately but don't block module loading
loadApplications().then(routes => {
  cachedRoutes = routes;
});

// Export a Proxy that provides access to routes once loaded
// This maintains backwards compatibility while avoiding top-level await
export const applicationRoutes = new Proxy({} as Awaited<ReturnType<typeof loadApplications>>, {
  get(_target, prop) {
    if (cachedRoutes) {
      return cachedRoutes[prop];
    }
    // If not loaded yet, return a placeholder with default toggle false
    // This prevents errors while loading
    return { toggle: false };
  },
  ownKeys(_target) {
    return cachedRoutes ? Reflect.ownKeys(cachedRoutes) : [];
  },
  getOwnPropertyDescriptor(_target, prop) {
    if (cachedRoutes) {
      return Reflect.getOwnPropertyDescriptor(cachedRoutes, prop);
    }
    return undefined;
  }
});

export const utilityRoutes = {
  settings: {
    id: 'settings',
    name: { en: 'Settings', de: 'Einstellungen' },
    path: '/settings',
    icon: Settings,
    toggle: true,
  },
  admin: {
    id: 'admin',
    name: { en: 'Admin area', de: 'Admin Bereich' },
    path: '/admin',
    icon: SecurityServices,
    toggle: true,
  },
};

export const adminSubRoutes = {
  activities: {
    id: 'activities',
    name: { en: 'Activities', de: 'Aktivitäten' },
    path: '/admin',
    icon: Bullhorn,
    toggle: true,
  },
  idenfiers: {
    id: 'idenfiers',
    name: { en: 'Identifiers', de: 'Identifikatoren' },
    path: '/admin/identifiers',
    icon: FingerprintRecognition,
    toggle: true,
  },
  jokes: {
    id: 'jokes',
    name: { en: 'Jokes', de: 'Witze' },
    path: '/admin/jokes',
    icon: Cognitive,
    toggle: true,
  },
  presets: {
    id: 'presets',
    name: { en: 'Presets', de: 'Voreinstellungen' },
    path: '/admin/presets',
    icon: Bookmark,
    toggle: true,
  },
  toggles: {
    id: 'toggles',
    name: { en: 'Toggles', de: 'Schalter' },
    path: '/admin/toggles',
    icon: RadioButtonChecked,
    toggle: true,
  },
};
