import { useGetSubscriptionSettings } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ResponseRulesPageComponent } from '../components/response-rules.page.component'

export function ResponseRulesPageConnector() {
    const { data: subscriptionSettings, isLoading: isSubscriptionSettingsLoading } =
        useGetSubscriptionSettings()

    if (isSubscriptionSettingsLoading || !subscriptionSettings) {
        return <LoadingScreen />
    }

    return (
        <ResponseRulesPageComponent
            responseRules={subscriptionSettings.responseRules}
            subscriptionSettingsUuid={subscriptionSettings.uuid}
        />
    )
}
