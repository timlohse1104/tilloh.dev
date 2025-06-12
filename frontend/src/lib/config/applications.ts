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

const loadApplications = async () => ({
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
    toggle: await getToggleValue(TogglesEnum.memorandum),
  },
  jokes: {
    id: 'jokes',
    name: { en: 'Jokes', de: 'Witze' },
    path: '/jokes',
    icon: Cognitive,
    toggle: await getToggleValue(TogglesEnum.jokes),
  },
  todo: {
    id: 'todo',
    name: { en: 'Lists', de: 'Listen' },
    path: '/todo',
    icon: ListBoxes,
    toggle: await getToggleValue(TogglesEnum.todo),
  },
  'food-scan': {
    id: 'food-scan',
    name: { en: 'Food Scan', de: 'Essen-Scan' },
    path: '/food-scan',
    icon: Restaurant,
    toggle: await getToggleValue(TogglesEnum.foodScan),
  },
  chat: {
    id: 'chat',
    name: { en: 'Chat', de: 'Klönschnack' },
    path: '/chat',
    icon: Chat,
    toggle: await getToggleValue(TogglesEnum.chat),
  },
  'catch-em-all': {
    id: 'catch-em-all',
    name: { en: 'Catch-em-all', de: 'Catch-em-all' },
    path: '/catch-em-all',
    icon: GameConsole,
    toggle: await getToggleValue(TogglesEnum.catchEmAll),
  },
  'uno-sort': {
    id: 'uno-sort',
    name: { en: 'Uno sort', de: 'Uno Sortierung' },
    path: '/uno-sort',
    icon: GameConsole,
    toggle: await getToggleValue(TogglesEnum.unoSort),
  },
  'flappy-pikachu': {
    id: 'flappy-pikachu',
    name: { en: 'Flappy Pikachu', de: 'Flappy Pikachu' },
    path: '/flappy-pikachu',
    icon: GameConsole,
    toggle: await getToggleValue(TogglesEnum.flappyPikachu),
  },
  about: {
    id: 'about',
    name: { en: 'About me', de: 'Über mich' },
    path: '/about',
    icon: Identification,
    toggle: await getToggleValue(TogglesEnum.about),
  },
});

export const applicationRoutes = await loadApplications();

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
