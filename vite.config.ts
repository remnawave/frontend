/* eslint-disable indent */
import removeConsole from 'vite-plugin-remove-console'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
// import deadFile from 'vite-plugin-deadfile'
import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

export default defineConfig({
    plugins: [
        react(),
        visualizer() as PluginOption,
        tsconfigPaths(),
        removeConsole(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
            manifest: {
                name: 'Remnawave',
                short_name: 'Remnawave',
                description: 'Remnawave Dashboard',
                theme_color: '#151B22',
                icons: [
                    {
                        src: 'pwa-64x64.png',
                        sizes: '64x64',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'maskable-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            }
        })

        // deadFile({
        //     include: ['src/**/*.{js,jsx,ts,tsx}'],
        //     exclude: ['node_modules/**', /\.md$/i, 'public/**', 'dist/**', '.git/**', '.vscode/**']
        // })
    ],
    build: {
        target: 'esNext',
        outDir: 'dist',
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
                    dnd: ['@hello-pangea/dnd'],
                    mantinetable: ['mantine-react-table'],
                    tanstack: ['@tanstack/react-query', '@tanstack/react-table']
                }
            }
        }
    },
    define: {
        __DOMAIN_BACKEND__: JSON.stringify(process.env.DOMAIN_BACKEND || 'example.com').trim(),
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV).trim(),
        __DOMAIN_OVERRIDE__: JSON.stringify(process.env.DOMAIN_OVERRIDE || '0').trim()
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
