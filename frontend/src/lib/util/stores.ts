import { browser } from '$app/environment';
import type { ChatList } from '$lib/types/chat';
import { Identifier } from '$lib/util/types';
import { writable } from 'svelte/store';

// Localstorage stores
let chatStoreDefault: ChatList[] = [];
const chatStoreKey = 'chats';

if (browser) {
  if (!localStorage.getItem(chatStoreKey)) {
    localStorage.setItem(chatStoreKey, JSON.stringify(chatStoreDefault));
  }

  chatStoreDefault =
    JSON.parse(localStorage.getItem(chatStoreKey)) || chatStoreDefault;
}

export const chatStore = writable(chatStoreDefault);

if (browser) {
  chatStore.subscribe((value: ChatList[]) =>
    localStorage.setItem(chatStoreKey, JSON.stringify(value))
  );
}

export const listOverlayOptionsStore = writable({
  showOverlay: false,
  type: undefined,
});

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
