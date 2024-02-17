import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      ...nodePolyfills({
        include: ['querystring', 'url']
      }),
      apply: 'build'
    },
    {
      ...inject({
        Buffer: ['buffer', 'Buffer']
      }),
      apply: 'serve'
    },
    react()
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.ts'
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/chromeServices/background/index.ts',
        offscreen: './src/chromeServices/offscreen/index.ts'
      },
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify'
    }
  }
});
