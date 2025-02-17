import { browser } from '$app/environment';
import { getIdentifier } from '$lib/api/identifiers.api';
import { Identifier } from '$lib/util/types';
import { writable } from 'svelte/store';

// Localstorage stores
export const listOverlayOptionsStore = writable({
  showOverlay: false,
  type: undefined,
});

// Online persistence - Identifier
const sharedIdentifierKey = 'shared.identifier';
let sharedIdentifierDefault = '{}';

if (browser) {
  const localIdentifier = localStorage.getItem(sharedIdentifierKey);
  let resetIdentifier = false;

  if (!localIdentifier) {
    localStorage.setItem(sharedIdentifierKey, sharedIdentifierDefault);
    resetIdentifier = true;
  } else {
    sharedIdentifierDefault = localIdentifier;
  }

  if (resetIdentifier) {
    let remoteIdentifier;
    try {
      remoteIdentifier = await getIdentifier(JSON.parse(localIdentifier).id);
    } catch (error) {
      console.error('Error while fetching remote identifier.', error);
    }
    if (remoteIdentifier.name === JSON.parse(localIdentifier).name) {
      console.log('Remote identifier fetched successfully.');
      sharedIdentifierDefault = localIdentifier;
    } else {
      console.log('Remote identifier not found. Resetting local identifier.');
    }
  }
}

export const sharedIdentifierStore = writable<Identifier>(
  JSON.parse(sharedIdentifierDefault),
);

if (browser) {
  sharedIdentifierStore.subscribe((val) => {
    localStorage.setItem(sharedIdentifierKey, JSON.stringify(val));
  });
}

export const resetSharedIdentifier = () => {
  sharedIdentifierStore.set({} as Identifier);
};
