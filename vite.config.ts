import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import { splashScreen } from 'vite-plugin-splash-screen'
// import { visualizer } from 'rollup-plugin-visualizer'
// import deadFile from 'vite-plugin-deadfile'
import removeConsole from 'vite-plugin-remove-console'
import webfontDownload from 'vite-plugin-webfont-dl'
import 'dotenv/config'

export default defineConfig({
    assetsInclude: ['**/*.lottie'],
    plugins: [
        react(),
        removeConsole(),
        webfontDownload()
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
    optimizeDeps: {
        include: [
            'html-parse-stringify',
            'monaco-editor/editor',
            'monaco-editor/features/register.all',
            'monaco-editor/languages/definitions/yaml/yaml',
            'monaco-editor/languages/features/json/register'
        ]
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        chunkSizeWarningLimit: 1000000,
        rollupOptions: {
            onwarn(warning, defaultHandler) {
                if (warning.code === 'COMMONJS_VARIABLE_IN_ESM') return
                defaultHandler(warning)
            },
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'react',
                            test: /node_modules[\\/](react|react-dom|react-router|react-error-boundary)[\\/]/
                        },
                        {
                            name: 'markdown',
                            test: /node_modules[\\/](react-markdown|remark-gfm|rehype-raw)[\\/]/
                        },
                        {
                            name: 'icons',
                            test: /node_modules[\\/](react-icons|@lottiefiles[\\/]dotlottie-react)[\\/]/
                        },
                        {
                            name: 'zod',
                            test: /node_modules[\\/](axios|zod|zustand|xbytes|zod-to-json-schema)[\\/]/
                        },
                        {
                            name: 'utils',
                            test: /node_modules[\\/](nanoid|ufo|consola|semver|is-svg|sax|jsonc-parser|json-edit-react|dayjs)[\\/]/
                        },
                        {
                            name: 'mantine',
                            test: /node_modules[\\/]@mantine[\\/](core|hooks|dates|nprogress|notifications|modals)[\\/]/
                        },
                        {
                            name: 'remnawave',
                            test: /node_modules[\\/]@remnawave[\\/](backend-contract|subscription-page-types)[\\/]/
                        },
                        {
                            name: 'i18n',
                            test: /node_modules[\\/](i18next|i18next-http-backend|i18next-browser-languagedetector)[\\/]/
                        },
                        {
                            name: 'motion',
                            test: /node_modules[\\/](framer-motion|motion|motion-dom|motion-utils)[\\/]/
                        },
                        {
                            name: 'crypto',
                            test: /node_modules[\\/]@stablelib[\\/](base64|x25519)[\\/]/
                        },
                        {
                            name: 'charts',
                            test: /node_modules[\\/](recharts|highcharts|@highcharts[\\/]react)[\\/]/
                        },
                        {
                            name: 'dnd',
                            test: /node_modules[\\/]@dnd-kit[\\/](abstract|dom|helpers|react)[\\/]/
                        },
                        {
                            name: 'mantinetable',
                            test: /node_modules[\\/](@kastov[\\/]mantine-react-table-open|mantine-datatable)[\\/]/
                        },
                        {
                            name: 'prettier',
                            test: /node_modules[\\/](prettier|vscode-languageserver-types)[\\/]/
                        },
                        {
                            name: 'monaco',
                            test: /node_modules[\\/](monaco-editor|monaco-yaml|yaml)[\\/]/
                        },
                        {
                            name: 'tanstack',
                            test: /node_modules[\\/]@tanstack[\\/](react-query|react-table|react-virtual)[\\/]/
                        },
                        {
                            name: 'xterm',
                            test: /node_modules[\\/]@xterm[\\/]/
                        }
                    ]
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
        cors: true,
        strictPort: true,
        allowedHosts: true,
        hmr: {
            overlay: false
        }
    },
    resolve: {
        tsconfigPaths: true,
        alias: [
            {
                find: /^monaco-editor\/esm\/vs\/(.*)$/,
                replacement: 'monaco-editor/$1'
            }
        ]
    }
})
