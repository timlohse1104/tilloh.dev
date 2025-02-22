import { browser } from '$app/environment';
import type { List } from '$lib/types/list';
import { writable } from 'svelte/store';

const localStorageKey = 'lists';
const defaultValue: List[] = [];

const getInitialValue = () => {
  if (browser) {
    return JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const listStore = writable(getInitialValue());

if (browser) {
  listStore.subscribe((value: List[]) =>
    localStorage.setItem(localStorageKey, JSON.stringify(value)),
  );
}
