import { writable } from 'svelte/store';

export const themeStore = writable('dark'); // Default theme is light

export function toggleTheme() {
  themeStore.update((currentTheme) =>
    currentTheme === 'light' ? 'dark' : 'light',
  );
}
