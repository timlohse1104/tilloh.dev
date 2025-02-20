import { browser } from '$app/environment';
import { getlocale, setLocale } from '$lib/util/translations';
import { writable } from 'svelte/store';

const localStorageKey = 'language';
const defaultValue = 'en';

const getInitialValue = () => {
  if (browser) {
    const savedLanguage = localStorage.getItem(localStorageKey);
    if (savedLanguage) {
      setLocale(savedLanguage);
      return savedLanguage;
    }
    // In case of no saved language in local storage, use the default language from the browser
    return getlocale();
  } else {
    return defaultValue;
  }
};

export const languageStore = writable(getInitialValue());

if (browser) {
  languageStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, value);
    setLocale(value);
  });
}
