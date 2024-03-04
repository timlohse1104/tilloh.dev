import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { TodoList } from '../types/list';

let todoStoreDefault: TodoList[] = [];
const todoStoreKey = 'todos';

if (browser) {
  if (!localStorage.getItem(todoStoreKey)) {
    localStorage.setItem(todoStoreKey, JSON.stringify(todoStoreDefault));
  }

  todoStoreDefault =
    JSON.parse(localStorage.getItem(todoStoreKey)) || todoStoreDefault;
}

export const todoStore = writable(todoStoreDefault);

if (browser) {
  todoStore.subscribe((value: TodoList[]) =>
    localStorage.setItem(todoStoreKey, JSON.stringify(value))
  );
}

export const listOverlayOptionsStore = writable({
  showOverlay: false,
  type: undefined,
});
