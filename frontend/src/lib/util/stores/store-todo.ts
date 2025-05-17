import { browser } from '$app/environment';
import type { TodoList } from '$lib/types/todo';
import { writable } from 'svelte/store';
import { ensureTodoListUUID } from '../uuid';

const localStorageKey = 'todos';
const defaultValue: TodoList[] = [];

export const sortDoneLast = (todoListArray: TodoList[]): TodoList[] => {
  console.log('unsorted', JSON.parse(JSON.stringify(todoListArray)));
  const sorted = JSON.parse(
    JSON.stringify(
      todoListArray.map((todoList) => ({
        ...todoList,
        todos: todoList.todos.sort((a, b) => Number(a.done) - Number(b.done)),
      })),
    ),
  );
  console.log('sorted', sorted);
  return sorted;
};

const getInitialValue = () => {
  if (browser) {
    const localStorageValue =
      JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
    const backwardsCompatibleValue = ensureTodoListUUID(localStorageValue);
    return backwardsCompatibleValue;
  } else {
    return defaultValue;
  }
};

export const todoStore = writable(getInitialValue());

if (browser) {
  todoStore.subscribe((value: TodoList[]) =>
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(sortDoneLast(ensureTodoListUUID(value))),
    ),
  );
}
