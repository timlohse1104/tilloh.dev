import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const localStorageKey = 'identifier';

const getInitialIdentifier = () => {
  if (browser) {
    return localStorage.getItem(localStorageKey) || '';
  } else {
    return '';
  }
};

export const identifierStore = writable(getInitialIdentifier());

if (browser) {
  identifierStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
  });
}
