import { browser } from '$app/environment';
import type { List } from '$lib/types/list';
import { writable } from 'svelte/store';
import { ensureListUUID } from '../uuid';

const localStorageKey = 'lists';
const defaultValue: List[] = [];

const getInitialValue = () => {
  if (browser) {
    const initialListsValue =
      JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;

    return initialListsValue.map((list) => ensureListUUID(list));
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

export const newListIndexStore = writable(0);

export const currentListIndexStore = writable(0);
