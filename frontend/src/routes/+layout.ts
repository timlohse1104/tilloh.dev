import { browser } from '$app/environment';
import { loadTranslations } from '$lib/util/translations';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
  const { pathname } = url;
  const initLocale = getInitialLocale();

  await loadTranslations(initLocale, pathname);

  return { locale: initLocale, route: pathname };
};

function getInitialLocale(): string {
  if (browser) {
    try {
      return window.navigator.language.split('-')[0];
    } catch (e) {
      return 'de';
    }
  }

  return 'de';
}
