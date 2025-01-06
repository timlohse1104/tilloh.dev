import { browser } from '$app/environment';
import type { TodoList } from '$lib/types/todo';
import { writable } from 'svelte/store';

const localStorageKey = 'todos';
const defaultValue: TodoList[] = [];

const getInitialValue = () => {
  if (browser) {
    return JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
  } else {
    return defaultValue;
  }
};

export const todoStore = writable(getInitialValue());

if (browser) {
  todoStore.subscribe((value: TodoList[]) =>
    localStorage.setItem(localStorageKey, JSON.stringify(value)),
  );
}
