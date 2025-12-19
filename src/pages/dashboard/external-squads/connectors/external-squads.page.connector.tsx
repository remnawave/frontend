import {
    useGetExternalSquads,
    useGetSubscriptionPageConfigs,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ExternalSquadsPageComponent } from '../components/external-squads.page.component'

export function ExternalSquadsPageConnector() {
    const { data: externalSquads, isLoading: isExternalSquadsLoading } = useGetExternalSquads()
    const { isLoading: isTemplatesLoading } = useGetSubscriptionTemplates()
    const { isLoading: isSubscriptionPageConfigsLoading } = useGetSubscriptionPageConfigs()

    if (
        isExternalSquadsLoading ||
        !externalSquads ||
        isTemplatesLoading ||
        isSubscriptionPageConfigsLoading
    ) {
        return <LoadingScreen />
    }
    return <ExternalSquadsPageComponent externalSquads={externalSquads.externalSquads} />
}
