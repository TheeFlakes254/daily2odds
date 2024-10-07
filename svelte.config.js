import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // You can specify Vercel-specific options here if needed
      // For example:
      // edge: false,
      // split: false,
    })
  }
};

export default config;