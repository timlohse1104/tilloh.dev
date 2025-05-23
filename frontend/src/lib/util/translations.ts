import i18n, { type Config } from 'sveltekit-i18n';

interface Params {
  error: unknown;
  folderName: string;
  linkName: string;
  amount: number;
  identifierName: string;
  identifier: string;
  listName: string;
  keyName: string;
  joke: string;
  id: string;
  modelName: string;
}

const config: Config<Partial<Params>> = {
  initLocale: 'en',
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: async () =>
        (await import(/* @vite-ignore */ '../config/en.json')).default,
    },
    {
      locale: 'de',
      key: '',
      loader: async () =>
        (await import(/* @vite-ignore */ '../config/de.json')).default,
    },
  ],
};

export const getlocale = () => {
  if (navigator.language.startsWith('de')) return 'de';
  return 'en';
};

export const {
  t,
  loading,
  locales,
  locale,
  initialized,
  translations,
  loadTranslations,
  setLocale,
} = new i18n(config);
