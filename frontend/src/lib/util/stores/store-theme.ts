import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const localStorageKey = '__carbon-theme';
const defaultValue = 'g100';

const getInitialValue = () => {
  if (browser) {
    return localStorage.getItem(localStorageKey) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const themeStore = writable(getInitialValue());

if (browser) {
  themeStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
  });
}
