import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const localStorageKey = 'theme';
const defaultValue = 'dark';

const getInitialValue = () => {
  if (browser) {
    return localStorage.getItem(localStorageKey) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const themeStore = writable(getInitialValue()); // Default theme is light

if (browser) {
  themeStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
  });
}

export function toggleTheme() {
  themeStore.update((currentTheme) =>
    currentTheme === 'light' ? 'dark' : 'light',
  );
}
