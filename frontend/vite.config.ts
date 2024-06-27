import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/.',
  build: {
    target: 'esnext', //browsers can handle the latest ES features
  },
  plugins: [nxViteTsPaths(), sveltekit()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
});
