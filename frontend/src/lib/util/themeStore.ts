import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const getInitialTheme = () => {
  if (browser) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark';
  } else {
    return 'dark';
  }
};

export const themeStore = writable(getInitialTheme()); // Default theme is light

if (browser) {
  themeStore.subscribe((value) => {
    localStorage.setItem('theme', value);
  });
}

export function toggleTheme() {
  themeStore.update((currentTheme) =>
    currentTheme === 'light' ? 'dark' : 'light',
  );
}
