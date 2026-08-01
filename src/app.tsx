import '@mantine/carousel/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/spotlight/styles.css'
import '@kastov/mantine-react-table-open/styles.css'
import '@kastov/mantine-datatable/styles.css'
import './global.css'
import NiceModal from '@ebay/nice-modal-react'
import { Center, DirectionProvider, MantineProvider, v8CssVariablesResolver } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import { QueryClientProvider } from '@tanstack/react-query'
// import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Suspense, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

import { theme } from '@shared/constants'
import { AuthProvider } from '@shared/hocs/auth-provider'
// import { StrictMode } from 'react'
import { IsMobileProvider } from '@shared/hocs/is-mobile-provider'
import { LoadingScreen } from '@shared/ui'
import { ConnectionStatusOverlay } from '@shared/ui/connection-status-overlay'

import i18n from './app/i18n/i18n'
import { Router } from './app/router/router'
import { initConnectionWatchdog, queryClient } from './shared/api'

dayjs.extend(customParseFormat)

polyfillCountryFlagEmojis()

initConnectionWatchdog()

export function App() {
    const isDev = __NODE_ENV__ === 'development'

    useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
            const bottomBar = document.createElement('div')
            bottomBar.className = 'safe-area-bottom'
            root.appendChild(bottomBar)
        }
    }, [])

    // useEffect(() => {
    //     hideSplashScreen()
    // }, [])

    return (
        // <StrictMode>
        <I18nextProvider defaultNS="" i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                {isDev && <ReactQueryDevtools initialIsOpen={false} />}
                <AuthProvider>
                    <IsMobileProvider>
                        <DirectionProvider>
                            <MantineProvider
                                cssVariablesResolver={v8CssVariablesResolver}
                                defaultColorScheme="dark"
                                theme={theme}
                                deduplicateInlineStyles
                            >
                                <NiceModal.Provider>
                                    <ModalsProvider>
                                        <Notifications position="top-right" />
                                        <ConnectionStatusOverlay />
                                        <NavigationProgress />
                                        <Suspense
                                            fallback={
                                                <Center h="100%">
                                                    <LoadingScreen height="60vh" />
                                                </Center>
                                            }
                                        >
                                            <Router />
                                        </Suspense>
                                    </ModalsProvider>
                                </NiceModal.Provider>
                            </MantineProvider>
                        </DirectionProvider>
                    </IsMobileProvider>
                </AuthProvider>
            </QueryClientProvider>
        </I18nextProvider>
        // </StrictMode>
    )
}
