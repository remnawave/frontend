import { useGetExternalSquads, useGetSubscriptionTemplates } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ExternalSquadsPageComponent } from '../components/external-squads.page.component'

export function ExternalSquadsPageConnector() {
    const { data: externalSquads, isLoading: isExternalSquadsLoading } = useGetExternalSquads()
    const { isLoading: isTemplatesLoading } = useGetSubscriptionTemplates()

    if (isExternalSquadsLoading || !externalSquads || isTemplatesLoading) {
        return <LoadingScreen />
    }
    return <ExternalSquadsPageComponent externalSquads={externalSquads.externalSquads} />
}
