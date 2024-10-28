import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      out: 'build',
      precompress: false,
      envPrefix: ''
    })
  },
  preprocess: vitePreprocess()
};

export default config;