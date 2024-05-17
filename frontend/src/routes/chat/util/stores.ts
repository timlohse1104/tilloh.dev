import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ChatList } from '../types/list';

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
