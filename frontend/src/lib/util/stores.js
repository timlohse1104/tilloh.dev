// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { writable } from 'svelte/store';

// Localstorage stores

// Online persistence store
export const onlinePersistenceStore = writable({
  onlinePersistence: false,
});
