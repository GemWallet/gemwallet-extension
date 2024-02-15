import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

// Had to create a separate config for content script
// Source: https://stackoverflow.com/questions/77235874/vite-chrome-extension-manifest-v3-cannot-use-import-statement-outside-a-mod
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: './src/chromeServices/content/index.ts'
      },
      output: {
        entryFileNames: 'assets/[name].js',
        inlineDynamicImports: true
      }
    }
  }
});
