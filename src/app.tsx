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

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { NavigationProgress } from '@mantine/nprogress'
import { Notifications } from '@mantine/notifications'
import { MantineProvider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

// import { StrictMode } from 'react'
import { AuthProvider } from '@shared/hocs/auth-provider'
import { theme } from '@shared/constants'

import { Router } from './app/router/router'
import { queryClient } from './shared/api'

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')
    const isDev = __NODE_ENV__ === 'development'

    return (
        // <StrictMode>
        <QueryClientProvider client={queryClient}>
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
            <AuthProvider>
                <MantineProvider defaultColorScheme="dark" theme={theme}>
                    <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                    <NavigationProgress />

                    <Router />
                </MantineProvider>
            </AuthProvider>
        </QueryClientProvider>
        // </StrictMode>
    )
}
