import { browser } from '$app/environment';
import { setLocale } from '$lib/util/translations';
import { writable } from 'svelte/store';

const localStorageKey = 'background-color';
const defaultValue = '{r: 22, g: 22, b: 22, a: 1}';

const getInitialValue = () => {
  if (browser) {
    const savedBackgroundColor = localStorage.getItem(localStorageKey);
    if (savedBackgroundColor) {
      return savedBackgroundColor;
    }
  } else {
    return JSON.parse(defaultValue);
  }
};

export const backgroundColorStore = writable(getInitialValue());

if (browser) {
  backgroundColorStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
    setLocale(value);
  });
}
