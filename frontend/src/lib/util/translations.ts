import i18n, { type Config } from 'sveltekit-i18n';
interface Params {
  dateValue: number;
  value: number;
  download: number;
  award: number;
  val: Date;
}

const config: Config<Partial<Params>> = {
  initLocale: 'de',
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: async () => (await import('../config/en.json')).default,
    },
    {
      locale: 'de',
      key: '',
      loader: async () => (await import('../config/de.json')).default,
    },
  ],
};

export const {
  t,
  loading,
  locales,
  locale,
  initialized,
  translations,
  loadTranslations,
} = new i18n(config);
