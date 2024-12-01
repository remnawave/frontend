/* eslint-disable indent */
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

export default defineConfig({
    plugins: [react(), visualizer() as PluginOption, tsconfigPaths()],
    build: {
        target: 'esNext',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
                    axios: ['axios'],
                    zod: ['zod'],
                    mantine: [
                        '@mantine/core',
                        '@mantine/hooks',
                        '@mantine/dates',
                        '@mantine/nprogress',
                        '@mantine/notifications',
                        '@mantine/modals'
                    ],
                    recharts: ['recharts'],
                    dnd: ['@hello-pangea/dnd']
                }
            }
        }
    },
    define: {
        __DOMAIN_BACKEND__: JSON.stringify(process.env.DOMAIN_BACKEND).trim(),
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV).trim()
    },
    server: {
        host: '0.0.0.0',
        port: 3333,
        cors: false,
        strictPort: true
    },
    resolve: {
        alias: {
            '@entitites': fileURLToPath(new URL('./src/entitites', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
        }
    }
})
