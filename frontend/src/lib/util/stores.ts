import { browser } from '$app/environment';
import { Identifier } from '$lib/util/types';
import { writable } from 'svelte/store';

// Localstorage stores

// Online persistence - Identifier
const sharedIdentifierKey = 'shared.identifier';
let sharedIdentifierDefault = '{}';

if (browser) {
  if (!localStorage.getItem(sharedIdentifierKey)) {
    localStorage.setItem(sharedIdentifierKey, sharedIdentifierDefault);
  }
  sharedIdentifierDefault = localStorage.getItem(sharedIdentifierKey);
}

export const sharedIdentifierStore = writable<Identifier>(
  JSON.parse(sharedIdentifierDefault)
);

if (browser) {
  sharedIdentifierStore.subscribe((val) => {
    localStorage.setItem(sharedIdentifierKey, JSON.stringify(val));
  });
}

export function resetSharedIdentifier() {
  sharedIdentifierStore.set({} as Identifier);
}
