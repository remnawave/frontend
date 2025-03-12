import { Paper, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SubscriptionSettingsWidget } from '@widgets/dashboard/subscription-settings/settings/subscription-settings.widget'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

import { IProps } from './interfaces'

export const SubscriptionSettingsPageComponent = (props: IProps) => {
    const { t } = useTranslation()

    const { subscriptionSettings } = props

    if (!subscriptionSettings) {
        return <LoadingScreen />
    }

    return (
        <Page title={'Subscription settings'}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: 'Subscription settings' }
                ]}
                title={'Subscription settings'}
            />

            <Paper mb="lg" p="md" radius="md" withBorder>
                <Stack gap="md">
                    <Title order={4}>What is subscription settings?</Title>

                    <Text c="dimmed" size="sm">
                        Settings below is mostly used by clients apps (i.e. Happ, V2RayNG Streisand,
                        etc.) <br />
                        It is reccomended to change this values to match your service.
                    </Text>
                </Stack>
            </Paper>

            <SubscriptionSettingsWidget subscriptionSettings={subscriptionSettings} />
        </Page>
    )
}
