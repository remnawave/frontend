// import { splashScreen } from 'vite-plugin-splash-screen'
import removeConsole from 'vite-plugin-remove-console'
// import { visualizer } from 'rollup-plugin-visualizer'
import webfontDownload from 'vite-plugin-webfont-dl'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { fileURLToPath, URL } from 'node:url'
import { comlink } from 'vite-plugin-comlink'
import react from '@vitejs/plugin-react-swc'
// import deadFile from 'vite-plugin-deadfile'
import { defineConfig } from 'vite'
import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

export default defineConfig({
    plugins: [
        react(),
        comlink(),
        tsconfigPaths(),
        removeConsole(),
        webfontDownload(),
        ViteEjsPlugin((viteConfig) => {
            return {
                root: viteConfig.root,
                isCrowdin: process.env.CROWDIN === '1'
            }
        })
        // splashScreen({
        //     logoSrc: 'favicons/logo_small.svg',
        //     splashBg: '#161B23'
        // })
        // visualizer({
        //     open: true,
        //     gzipSize: true,
        //     brotliSize: true
        // })
        // deadFile({
        //     include: ['src/**/*.{js,jsx,ts,tsx}'],
        //     exclude: ['node_modules/**', /\.md$/i, 'public/**', 'dist/**', '.git/**', '.vscode/**']
        // })
    ],
    worker: {
        plugins: () => [comlink()]
    },
    optimizeDeps: {
        include: ['html-parse-stringify']
    },
    build: {
        target: 'esNext',
        outDir: 'dist',
        chunkSizeWarningLimit: 1000000,
        // minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom', 'react-error-boundary'],
                    icons: ['react-icons/pi', 'react-icons/fa', 'react-icons/tb'],
                    date: ['dayjs'],
                    zod: ['axios', 'zod', 'zustand', 'xbytes'],
                    utils: [
                        'nanoid',
                        'ufo',
                        'base64-js',
                        'buffer',
                        'consola',
                        'semver',
                        'jsonc-parser',
                        'json-edit-react'
                    ],
                    mantine: [
                        '@mantine/core',
                        '@mantine/hooks',
                        '@mantine/dates',
                        '@mantine/nprogress',
                        '@mantine/notifications',
                        '@mantine/modals'
                    ],
                    remnawave: ['@remnawave/backend-contract'],
                    i18n: ['i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],
                    motion: ['framer-motion', 'motion-dom', 'motion-utils', 'motion'],
                    crypto: ['crypto-js', '@stablelib/base64', '@stablelib/x25519'],
                    charts: ['recharts', 'highcharts', 'highcharts-react-official'],
                    dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
                    mantinetable: ['mantine-react-table', 'mantine-datatable'],
                    prettier: ['prettier', 'vscode-languageserver-types', 'prettier/plugins/yaml'],
                    monaco: ['monaco-editor', 'monaco-yaml', 'yaml'],
                    tanstack: [
                        '@tanstack/react-query',
                        '@tanstack/react-table',
                        '@tanstack/react-virtual'
                    ]
                }
            }
        }
    },
    define: {
        __DOMAIN_BACKEND__: JSON.stringify(process.env.DOMAIN_BACKEND || 'example.com').trim(),
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV).trim(),
        __DOMAIN_OVERRIDE__: JSON.stringify(process.env.DOMAIN_OVERRIDE || '0').trim(),
        __CROWDIN__: JSON.stringify(process.env.CROWDIN || '0').trim()
    },
    server: {
        host: '0.0.0.0',
        port: 3333,
        cors: true,
        strictPort: true,
        allowedHosts: true
    },
    resolve: {
        alias: {
            '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
        }
    }
})
