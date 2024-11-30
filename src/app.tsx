import '@mantine/carousel/styles.layer.css'
import '@mantine/charts/styles.layer.css'
import '@mantine/code-highlight/styles.layer.css'
import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/dropzone/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/nprogress/styles.layer.css'
import 'mantine-datatable/styles.layer.css'
import './global.css'

import { MantineProvider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import { Router } from '@/app/router/router'
import { AuthProvider } from '@/shared/providers/auth-provider'
import { theme } from '@/shared/theme'

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')

    return (
        <AuthProvider>
            <MantineProvider theme={theme} defaultColorScheme="dark">
                <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                <NavigationProgress />
                <ModalsProvider>
                    <Router />
                </ModalsProvider>
            </MantineProvider>
        </AuthProvider>
    )
}
