import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const lightThemeValue = 'g10';
export const darkThemeValue = 'g100';

const localStorageKey = '__carbon-theme';
const defaultValue = darkThemeValue;

const getInitialValue = () => {
  if (browser) {
    return localStorage.getItem(localStorageKey) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const themeStore = writable(
  getInitialValue() as 'white' | 'g10' | 'g80' | 'g90' | 'g100',
);

if (browser) {
  themeStore.subscribe((value: 'white' | 'g10' | 'g80' | 'g90' | 'g100') => {
    localStorage.setItem(localStorageKey, value);
  });
}
