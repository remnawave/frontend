import { useGetInternalSquads } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { InternalSquadsPageComponent } from '../components/internal-squads.page.component'

export function InternalSquadsPageConnector() {
    const { data: internalSquads, isLoading: isInternalSquadsLoading } = useGetInternalSquads()

    if (isInternalSquadsLoading || !internalSquads) {
        return <LoadingScreen />
    }

    return <InternalSquadsPageComponent internalSquads={internalSquads.internalSquads} />
}
