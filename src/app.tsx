import '@mantine/carousel/styles.layer.css';
import '@mantine/charts/styles.layer.css';
import '@mantine/code-highlight/styles.layer.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/dropzone/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/nprogress/styles.layer.css';
import '@mantine/spotlight/styles.layer.css';
import '@mantine/tiptap/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './global.css';

import { HelmetProvider } from 'react-helmet-async';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { Router } from '@/app/router/router';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { theme } from '@/shared/theme';

export function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <MantineProvider theme={theme} defaultColorScheme="dark">
                    <Notifications position="top-right" />
                    <NavigationProgress />
                    <ModalsProvider>
                        <Router />
                    </ModalsProvider>
                </MantineProvider>
            </AuthProvider>
        </HelmetProvider>
    );
}
