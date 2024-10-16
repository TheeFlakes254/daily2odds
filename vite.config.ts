import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['.'], // This allows serving files from the entire project directory
    },
  },
  optimizeDeps: {
    exclude: ['your-problematic-module'] // Replace with the name of the module causing issues, if known
  }
});