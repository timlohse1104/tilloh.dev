import { writable } from 'svelte/store';

export function localTodoStore(key, value) {
  const saved = localStorage.getItem(key);
  const store = writable(saved ? JSON.parse(saved) : value);

  store.subscribe(($value) => {
    localStorage.setItem(key, JSON.stringify($value));
  });
  return store;
}

export function localTodoTitleStore(key, value) {
  const saved = localStorage.getItem(key);
  const store = writable(saved ? JSON.parse(saved) : value);

  store.subscribe(($value) => {
    localStorage.setItem(key, JSON.stringify($value));
  });
  return store;
}
