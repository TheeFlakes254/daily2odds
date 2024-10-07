import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['pocketbase']
  },
  build: {
    rollupOptions: {
      external: ['pocketbase']
    }
  },
  ssr: {
    noExternal: ['pocketbase']
  }
});