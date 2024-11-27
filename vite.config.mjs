import { fileURLToPath, URL } from 'node:url';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenv.config({ path: `${__dirname}/.env` });

export default defineConfig({
  plugins: [react(), tsconfigPaths(), mdx()],
  define: {
    __DOMAIN_BACKEND__: JSON.stringify(process.env.DOMAIN_BACKEND).trim(),
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV).trim(),
  },
  server: {
    host: '0.0.0.0',
    port: 3333,
    cors: false,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
});
