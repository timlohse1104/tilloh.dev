// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser } from '$app/environment';
import { Identifier } from '$lib/util/types';
import { writable } from 'svelte/store';

// Localstorage stores

// Online persistence - Identifier
const sharedIdentifierKey = 'shared.identifier';

export const sharedIdentifierStore = writable<Identifier>(JSON.parse('{}'));

if (browser) {
  sharedIdentifierStore.subscribe((val) => {
    localStorage.setItem(sharedIdentifierKey, JSON.stringify(val));
  });
}

export function resetSharedIdentifier() {
  sharedIdentifierStore.set(JSON.parse('{}'));
}
