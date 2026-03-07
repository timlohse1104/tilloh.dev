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

const getInitialIdentifier = (): string => {
  if (!browser) return '{}';
  const local = localStorage.getItem(sharedIdentifierKey);
  if (!local) {
    localStorage.setItem(sharedIdentifierKey, '{}');
    return '{}';
  }
  return local;
};

const initialIdentifier = getInitialIdentifier();

export const sharedIdentifierStore = writable<Identifier>(
  JSON.parse(initialIdentifier),
);

if (browser) {
  // Async validation of local identifier against remote (no top-level await)
  const parsed = JSON.parse(initialIdentifier);
  if (parsed?.id) {
    (async () => {
      try {
        const remoteIdentifier = await getIdentifier(parsed.id);
        if (remoteIdentifier?.name === parsed.name) {
          console.log('Remote identifier fetched successfully.');
        } else {
          console.log('Remote identifier not found. Resetting local identifier.');
          sharedIdentifierStore.set({} as Identifier);
        }
      } catch (error) {
        console.error('Error while fetching remote identifier.', error);
      }
    })();
  }

  sharedIdentifierStore.subscribe((val) => {
    localStorage.setItem(sharedIdentifierKey, JSON.stringify(val));
  });
}

export const resetSharedIdentifier = () => {
  sharedIdentifierStore.set({} as Identifier);
};
