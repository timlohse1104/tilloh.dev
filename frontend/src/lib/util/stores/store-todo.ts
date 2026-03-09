import { browser } from '$app/environment';
import type { HistoryEntry, TodoList } from '$lib/types/todo';
import { normalizeCategory } from '$lib/util/helper';
import { writable } from 'svelte/store';

export const normalizeHistoryEntries = (
  history: (string | HistoryEntry)[],
): HistoryEntry[] =>
  history.map((entry) =>
    typeof entry === 'string' ? { title: entry, category: '' } : entry,
  );
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
    const withHistory = withCategories.map((list: TodoList) => ({
      ...list,
      history: normalizeHistoryEntries(list.history || []),
    }));
    const withNormalizedCategories = withHistory.map((list: TodoList) => ({
      ...list,
      categories: list.categories.map(normalizeCategory),
      todos: list.todos.map((todo) => ({
        ...todo,
        category: normalizeCategory(todo.category || ''),
      })),
      history: list.history.map((entry) => ({
        ...entry,
        category: normalizeCategory(entry.category || ''),
      })),
    }));
    return withNormalizedCategories;
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
