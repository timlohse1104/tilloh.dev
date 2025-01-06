import { browser } from '$app/environment';
import type { ChatList } from '$lib/types/chat';
import { writable } from 'svelte/store';

const localStorageKey = 'chats';
const defaultValue: ChatList[] = [];

const getInitialValue = () => {
  if (browser) {
    return JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const chatStore = writable(getInitialValue());

if (browser) {
  chatStore.subscribe((value: ChatList[]) =>
    localStorage.setItem(localStorageKey, JSON.stringify(value)),
  );
}
