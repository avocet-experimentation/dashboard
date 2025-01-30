/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // define: {
  //   VITE_FLAG_SERVICE_URL: JSON.stringify(
  //     `${process.env.VITE_FLAG_SERVICE_URL}`,
  //   ),
  //   VITE_EVENT_SERVICE_URL: JSON.stringify(
  //     `${process.env.VITE_EVENT_SERVICE_URL}`,
  //   ),
  //   VITE_GRAPHQL_SERVICE_URL: JSON.stringify(
  //     `${process.env.VITE_GRAPHQL_SERVICE_URL}`,
  //   ),
  //   VITE_AUTH0_DOMAIN: JSON.stringify(`${process.env.VITE_AUTH0_DOMAIN}`),
  //   VITE_AUTH0_CLIENT_ID: JSON.stringify(`${process.env.VITE_AUTH0_CLIENT_ID}`),
  //   VITE_AUTH0_AUDIENCE: JSON.stringify(`${process.env.VITE_AUTH0_AUDIENCE}`),
  //   VITE_API_SERVER_URL: JSON.stringify(`${process.env.VITE_API_SERVER_URL}`),
  // },
  preview: {
    port: 5173,
    strictPort: true,
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
  // // proxy setup (only for full stack apps)
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5001",
  //     },
  //   },
  // },
});
