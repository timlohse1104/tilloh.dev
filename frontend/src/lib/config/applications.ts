import type { Route } from '$lib/types/route';
import { TogglesEnum } from '$lib/types/toggle.dto';
import { getToggleValue } from '$lib/util/toggle';
import Bookmark from 'carbon-icons-svelte/lib/Bookmark.svelte';
import Bullhorn from 'carbon-icons-svelte/lib/Bullhorn.svelte';
import Cognitive from 'carbon-icons-svelte/lib/Cognitive.svelte';
import FingerprintRecognition from 'carbon-icons-svelte/lib/FingerprintRecognition.svelte';
import GameConsole from 'carbon-icons-svelte/lib/GameConsole.svelte';
import Music from 'carbon-icons-svelte/lib/Music.svelte';
import Home from 'carbon-icons-svelte/lib/Home.svelte';
import Identification from 'carbon-icons-svelte/lib/Identification.svelte';
import ListBoxes from 'carbon-icons-svelte/lib/ListBoxes.svelte';
import RadioButtonChecked from 'carbon-icons-svelte/lib/RadioButtonChecked.svelte';
import Restaurant from 'carbon-icons-svelte/lib/Restaurant.svelte';
import SecurityServices from 'carbon-icons-svelte/lib/SecurityServices.svelte';
import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
import { derived, writable } from 'svelte/store';

export type ApplicationRoutes = {
  home: Route;
  memorandum: Route;
  jokes: Route;
  todo: Route;
  'food-scan': Route;
  'catch-em-all': Route;
  'uno-sort': Route;
  hitstar: Route;
  about: Route;
};

const loadApplications = async (): Promise<ApplicationRoutes> => {
  const [
    memorandumToggle,
    jokesToggle,
    todoToggle,
    foodScanToggle,
    catchEmAllToggle,
    unoSortToggle,
    hitstarToggle,
    aboutToggle,
  ] = await Promise.all([
    getToggleValue(TogglesEnum.memorandum),
    getToggleValue(TogglesEnum.jokes),
    getToggleValue(TogglesEnum.todo),
    getToggleValue(TogglesEnum.foodScan),
    getToggleValue(TogglesEnum.catchEmAll),
    getToggleValue(TogglesEnum.unoSort),
    getToggleValue(TogglesEnum.hitstar),
    getToggleValue(TogglesEnum.about),
  ]);

  return {
    home: { id: 'home', name: { en: 'Home', de: 'Startseite' }, path: '/', icon: Home, toggle: true },
    memorandum: { id: 'memorandum', name: { en: 'Memorandum', de: 'Memorandum' }, path: '/memorandum', icon: Bookmark, toggle: memorandumToggle },
    jokes: { id: 'jokes', name: { en: 'Jokes', de: 'Witze' }, path: '/jokes', icon: Cognitive, toggle: jokesToggle },
    todo: { id: 'todo', name: { en: 'Lists', de: 'Listen' }, path: '/todo', icon: ListBoxes, toggle: todoToggle },
    'food-scan': { id: 'food-scan', name: { en: 'Food Scan', de: 'Essen-Scan' }, path: '/food-scan', icon: Restaurant, toggle: foodScanToggle },
    'catch-em-all': { id: 'catch-em-all', name: { en: 'Catch-em-all', de: 'Catch-em-all' }, path: '/catch-em-all', icon: GameConsole, toggle: catchEmAllToggle },
    'uno-sort': { id: 'uno-sort', name: { en: 'Uno sort', de: 'Uno Sortierung' }, path: '/uno-sort', icon: GameConsole, toggle: unoSortToggle },
    hitstar: { id: 'hitstar', name: { en: 'Hitstar', de: 'Hitstar' }, path: '/hitstar', icon: Music, toggle: hitstarToggle },
    about: { id: 'about', name: { en: 'About me', de: 'Über mich' }, path: '/about', icon: Identification, toggle: aboutToggle },
  };
};

const defaultApplicationRoutes: ApplicationRoutes = {
  home: { id: 'home', name: { en: 'Home', de: 'Startseite' }, path: '/', icon: Home, toggle: true },
  memorandum: { id: 'memorandum', name: { en: 'Memorandum', de: 'Memorandum' }, path: '/memorandum', icon: Bookmark, toggle: false },
  jokes: { id: 'jokes', name: { en: 'Jokes', de: 'Witze' }, path: '/jokes', icon: Cognitive, toggle: false },
  todo: { id: 'todo', name: { en: 'Lists', de: 'Listen' }, path: '/todo', icon: ListBoxes, toggle: false },
  'food-scan': { id: 'food-scan', name: { en: 'Food Scan', de: 'Essen-Scan' }, path: '/food-scan', icon: Restaurant, toggle: false },
  'catch-em-all': { id: 'catch-em-all', name: { en: 'Catch-em-all', de: 'Catch-em-all' }, path: '/catch-em-all', icon: GameConsole, toggle: false },
  'uno-sort': { id: 'uno-sort', name: { en: 'Uno sort', de: 'Uno Sortierung' }, path: '/uno-sort', icon: GameConsole, toggle: false },
  hitstar: { id: 'hitstar', name: { en: 'Hitstar', de: 'Hitstar' }, path: '/hitstar', icon: Music, toggle: false },
  about: { id: 'about', name: { en: 'About me', de: 'Über mich' }, path: '/about', icon: Identification, toggle: false },
};

export const applicationRoutes = writable<ApplicationRoutes>(defaultApplicationRoutes);

export const activeApplicationRoutes = derived(applicationRoutes, ($routes) =>
  Object.values($routes).filter((route) => route.toggle),
);

// Load actual toggle values from backend and update store reactively
loadApplications().then((routes) => applicationRoutes.set(routes));

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
