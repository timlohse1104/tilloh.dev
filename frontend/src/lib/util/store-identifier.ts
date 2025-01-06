import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const localStorageKey = 'identifier';
const defaultValue = '';

const getInitialValue = () => {
  if (browser) {
    return localStorage.getItem(localStorageKey) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const identifierStore = writable(getInitialValue());

if (browser) {
  identifierStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
  });
}
