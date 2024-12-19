import { browser } from '$app/environment';
import { changeLanguage, getlocale } from '$lib/util/translations';
import { writable } from 'svelte/store';

const getInitialLanguage = () => {
  if (browser) {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage ? savedLanguage : getlocale();
  } else {
    return 'en';
  }
};

export const languageStore = writable(getInitialLanguage());

if (browser) {
  languageStore.subscribe((value) => {
    localStorage.setItem('language', value);
    changeLanguage(value);
  });
}
