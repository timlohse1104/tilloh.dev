import { browser } from '$app/environment';
import { darkThemeValue, themeStore } from '$lib/util/stores/store-theme';
import { writable } from 'svelte/store';

const localStorageKey = 'background-color';
export const defaultDarkValue = '{"r": 22, "g": 22, "b": 22, "a": 1}';
export const defaultLightValue = '{"r": 222, "g": 222, "b": 250, "a": 1}';
export let defaultValue = defaultDarkValue;
themeStore.subscribe((value) => {
  defaultValue =
    value === darkThemeValue ? defaultDarkValue : defaultLightValue;
});

const getInitialValue = () => {
  if (browser) {
    const savedBackgroundColor = localStorage.getItem(localStorageKey);
    console.log('savedBackgroundColor', savedBackgroundColor);
    if (!savedBackgroundColor || savedBackgroundColor === 'undefined') {
      localStorage.setItem(localStorageKey, defaultValue);
      return JSON.parse(defaultValue);
    } else {
      return JSON.parse(savedBackgroundColor);
    }
  } else {
    return JSON.parse(defaultValue);
  }
};

export const backgroundColorStore = writable(getInitialValue());

if (browser) {
  backgroundColorStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  });
}
