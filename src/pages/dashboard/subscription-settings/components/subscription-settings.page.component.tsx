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
        <Page title={t('constants.subscription-settings')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.subscription-settings') }
                ]}
                title={t('constants.subscription-settings')}
            />

            <Paper mb="lg" p="md" radius="md" withBorder>
                <Stack gap="md">
                    <Title order={4}>
                        {t('subscription-settings.page.component.what-is-subscription-settings')}
                    </Title>

                    <Text c="dimmed" size="sm">
                        {t(
                            'subscription-settings.page.component.subscription-settings-description'
                        )}{' '}
                        <br />
                        {t(
                            'subscription-settings.page.component.subscription-settings-description-line-2'
                        )}
                    </Text>
                </Stack>
            </Paper>

            <SubscriptionSettingsWidget subscriptionSettings={subscriptionSettings} />
        </Page>
    )
}
