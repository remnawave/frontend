import { useTranslation } from 'react-i18next'
import { Container } from '@mantine/core'

import { SubscriptionSettingsTabsWidget } from '@widgets/dashboard/subscription-settings/settings/subscription-tabs.widget'
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
                    { label: t('constants.subscription') },
                    { label: t('constants.subscription-settings') }
                ]}
                title={t('constants.subscription-settings')}
            />

            <Container fluid p={0} size="xl">
                <SubscriptionSettingsTabsWidget subscriptionSettings={subscriptionSettings} />
            </Container>
        </Page>
    )
}
