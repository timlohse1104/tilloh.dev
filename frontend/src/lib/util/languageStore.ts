import { browser } from '$app/environment';
import { getlocale, setLocale } from '$lib/util/translations';
import { writable } from 'svelte/store';

const getInitialLanguage = () => {
  if (browser) {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLocale(savedLanguage);
      return savedLanguage;
    }
    // In case of no saved language in local storage, use the default language from the browser
    return getlocale();
  } else {
    return 'en';
  }
};

export const languageStore = writable(getInitialLanguage());

if (browser) {
  languageStore.subscribe((value) => {
    localStorage.setItem('language', value);
    setLocale(value);
  });
}
