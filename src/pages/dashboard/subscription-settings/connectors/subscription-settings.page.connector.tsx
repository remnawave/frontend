import { useGetSubscriptionSettings } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import { SubscriptionSettingsPageComponent } from '../components'

export const SubscriptionSettingsConnector = () => {
    const { data: subscriptionSettings } = useGetSubscriptionSettings()

    if (!subscriptionSettings) {
        return <LoadingScreen />
    }

    return <SubscriptionSettingsPageComponent subscriptionSettings={subscriptionSettings} />
}
