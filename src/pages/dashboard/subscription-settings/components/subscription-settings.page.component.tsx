import { PiBarcodeDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Container } from '@mantine/core'

import { SubscriptionSettingsTabsWidget } from '@widgets/dashboard/subscription-settings/settings/subscription-tabs.widget'
import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'

import { IProps } from './interfaces'

export const SubscriptionSettingsPageComponent = (props: IProps) => {
    const { t } = useTranslation()

    const { subscriptionSettings } = props

    if (!subscriptionSettings) {
        return <LoadingScreen />
    }

    return (
        <Page title={t('constants.subscription-settings')}>
            <PageHeaderShared
                icon={<PiBarcodeDuotone size={24} />}
                title={t('constants.subscription-settings')}
            />

            <Container fluid p={0} size="xl">
                <SubscriptionSettingsTabsWidget subscriptionSettings={subscriptionSettings} />
            </Container>
        </Page>
    )
}
