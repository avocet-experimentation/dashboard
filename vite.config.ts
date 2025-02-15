/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    preview: {
      port: 4173,
      strictPort: true,
      proxy: {
        '/graphql': {
          target: process.env.VITE_API_SERVER_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      origin: 'http://0.0.0.0:5173',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setupTests.ts'],
    },
    build: {
      target: "ESNext",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
  });
}