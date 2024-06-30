import adapter from '@sveltejs/adapter-static';
import path from 'path';
import { sveltePreprocess } from 'svelte-preprocess';

const config = {
  preprocess: sveltePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: null,
      precompress: false,
      strict: true,
    }),
  },
  prerender: {
    default: true,
  },
  vite: {
    resolve: {
      alias: {
        $lib: path.resolve('./src/lib'),
      },
    },
  },
};

export default config;
