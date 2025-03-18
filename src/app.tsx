import '@mantine/carousel/styles.layer.css'
import '@mantine/charts/styles.layer.css'
import '@mantine/code-highlight/styles.layer.css'
import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/dropzone/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/nprogress/styles.layer.css'
import 'mantine-react-table/styles.css'

import './global.css'

import { Center, DirectionProvider, MantineProvider } from '@mantine/core'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { QueryClientProvider } from '@tanstack/react-query'
import { NavigationProgress } from '@mantine/nprogress'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { I18nextProvider } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { Suspense } from 'react'
import dayjs from 'dayjs'

// import { StrictMode } from 'react'
import { AuthProvider } from '@shared/hocs/auth-provider'
import { LoadingScreen } from '@shared/ui'
import { theme } from '@shared/constants'

import { Router } from './app/router/router'
import { queryClient } from './shared/api'
import i18n from './app/i18n/i18n'

dayjs.extend(customParseFormat)

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')
    const isDev = __NODE_ENV__ === 'development'

    return (
        // <StrictMode>
        <I18nextProvider defaultNS={''} i18n={i18n}>
            <QueryClientProvider client={queryClient}>
                {isDev && <ReactQueryDevtools initialIsOpen={false} />}
                <AuthProvider>
                    <DirectionProvider>
                        <MantineProvider defaultColorScheme="dark" theme={theme}>
                            <ModalsProvider>
                                <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                                <NavigationProgress />
                                <Suspense
                                    fallback={
                                        <Center h={'100%'}>
                                            <LoadingScreen height="60vh" />
                                        </Center>
                                    }
                                >
                                    <Router />
                                </Suspense>
                            </ModalsProvider>
                        </MantineProvider>
                    </DirectionProvider>
                </AuthProvider>
            </QueryClientProvider>
        </I18nextProvider>
        // </StrictMode>
    )
}
