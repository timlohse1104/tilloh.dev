import { browser } from '$app/environment';
import { setLocale } from '$lib/util/translations';
import { writable } from 'svelte/store';

const localStorageKey = 'background';
const defaultValue = 'default';

const getInitialValue = () => {
  if (browser) {
    const savedBackground = localStorage.getItem(localStorageKey);
    if (savedBackground) {
      return savedBackground;
    }
  } else {
    return defaultValue;
  }
};

export const backgroundStore = writable(getInitialValue());

if (browser) {
  backgroundStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
  });
}
