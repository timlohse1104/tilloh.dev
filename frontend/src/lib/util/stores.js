// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Localstorage stores

// Online persistence
const isOnlinePersistenceKey = 'tilloh.shared.isOnlinePersistence';
let isOnlinePersistenceDefault = false;

if (browser) {
  if (!localStorage.getItem(isOnlinePersistenceKey)) {
    localStorage.setItem(isOnlinePersistenceKey, isOnlinePersistenceDefault);
  }

  isOnlinePersistenceDefault =
    localStorage.getItem(isOnlinePersistenceKey) || isOnlinePersistenceDefault;
}

export const isOnlinePersistenceStore = writable(isOnlinePersistenceDefault);

if (browser) {
  isOnlinePersistenceStore.subscribe((val) => {
    localStorage.setItem(isOnlinePersistenceKey, val);
  });
}
