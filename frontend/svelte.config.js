import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess([
    {
      scss: {
        prependData: `
          @import '${resolve('./src/lib/styles/_font.scss')}';
          @import '${resolve('./src/lib/styles/_mixins.scss')}';
          @import '${resolve('./src/lib/styles/_variables.scss')}';
        `,
      },
    },
  ]),
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
