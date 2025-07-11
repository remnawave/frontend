import removeConsole from 'vite-plugin-remove-console'
// import { visualizer } from 'rollup-plugin-visualizer'
import webfontDownload from 'vite-plugin-webfont-dl'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
// import deadFile from 'vite-plugin-deadfile'
import { defineConfig } from 'vite'
import * as dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        removeConsole(),
        webfontDownload()
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
    optimizeDeps: {
        include: ['html-parse-stringify']
    },
    build: {
        target: 'esNext',
        outDir: 'dist',
        chunkSizeWarningLimit: 1000000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('monaco-editor')) return 'monaco-editor'
                        if (
                            id.includes('monaco-languageserver-types') ||
                            id.includes('monaco-worker-manager') ||
                            id.includes('monaco-marker-data-provider') ||
                            id.includes('monaco-yaml') ||
                            id.includes('vscode-languageserver-types') ||
                            id.includes('vscode-languageserver-textdocument')
                        ) {
                            return 'monaco-ext'
                        }

                        if (id.includes('recharts') || id.includes('d3')) {
                            return 'charts'
                        }

                        if (id.includes('@dnd-kit')) {
                            return 'dnd-kit'
                        }

                        if (
                            id.includes('react') ||
                            id.includes('react-dom') ||
                            id.includes('react-router-dom') ||
                            id.includes('react-transition-group') ||
                            id.includes('react-error-boundary') ||
                            id.includes('zustand')
                        ) {
                            return 'react'
                        }

                        if (
                            id.includes('axios') ||
                            id.includes('dayjs') ||
                            id.includes('js-yaml') ||
                            id.includes('nanoid') ||
                            id.includes('zod') ||
                            id.includes('ufo') ||
                            id.includes('base64-js') ||
                            id.includes('buffer') ||
                            id.includes('consola') ||
                            id.includes('country-flag-emoji-polyfill') ||
                            id.includes('crypto-js') ||
                            id.includes('@remnawave') ||
                            id.includes('generate-password-ts')
                        ) {
                            return 'utils'
                        }

                        if (id.includes('@tanstack')) {
                            return 'tanstack'
                        }

                        if (
                            id.includes('i18next') ||
                            id.includes('i18next-http-backend') ||
                            id.includes('i18next-browser-languagedetector')
                        ) {
                            return 'i18n'
                        }

                        if (id.includes('@stablelib') || id.includes('crypto-js')) {
                            return 'crypto'
                        }

                        if (id.includes('@mantine') || id.includes('mantine-datatable')) {
                            return 'mantine'
                        }

                        if (id.includes('@tabler') || id.includes('react-icons')) {
                            return 'icons'
                        }

                        if (
                            id.includes('framer-motion') ||
                            id.includes('motion-dom') ||
                            id.includes('motion-utils')
                        ) {
                            return 'motion'
                        }

                        const pkg = id.match(/node_modules\/([^/]+)/)?.[1]
                        if (pkg && pkg.length < 8) return 'small-vendors'

                        return 'large-vendor'
                    }

                    return 'unknown'
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
            '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
        }
    }
})
