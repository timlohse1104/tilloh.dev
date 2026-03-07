import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/.',
  build: {
    // Target Safari 14+ to transpile top-level await away, avoiding WebKit bug:
    // https://bugs.webkit.org/show_bug.cgi?id=242740
    target: ['es2020', 'safari14'],
  },
  plugins: [nxViteTsPaths(), sveltekit()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
});
