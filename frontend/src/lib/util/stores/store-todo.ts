import { browser } from '$app/environment';
import type { TodoList } from '$lib/types/todo';
import { writable } from 'svelte/store';
import { ensureTodoListUUID } from '../uuid';

const localStorageKey = 'todos';
const defaultValue: TodoList[] = [];

// TODO: Fix this to not falsy set todos done
export const sortDoneLast = (todoListArray: TodoList[]): TodoList[] => {
  const sorted = JSON.parse(
    JSON.stringify(
      todoListArray.map((todoList) => ({
        ...todoList,
        todos: todoList.todos.sort((a, b) => Number(a.done) - Number(b.done)),
      })),
    ),
  );
  return sorted;
};

const getInitialValue = () => {
  if (browser) {
    const localStorageValue =
      JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
    const backwardsCompatibleValue = ensureTodoListUUID(localStorageValue);
    // Ensure categories property exists for backward compatibility
    const withCategories = backwardsCompatibleValue.map((list: TodoList) => ({
      ...list,
      categories: list.categories || [],
    }));
    return withCategories;
  } else {
    return defaultValue;
  }
};

export const todoStore = writable(getInitialValue());

if (browser) {
  todoStore.subscribe((value: TodoList[]) =>
    // localStorage.setItem(localStorageKey, JSON.stringify(sortDoneLast(value))),
    localStorage.setItem(localStorageKey, JSON.stringify(value)),
  );
}
