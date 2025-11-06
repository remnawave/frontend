import { useGetExternalSquads, useGetInternalSquads, useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    const { isLoading: isInternalSquadsLoading } = useGetInternalSquads()
    const { isLoading: isExternalSquadsLoading } = useGetExternalSquads()
    const { isLoading: isNodesLoading } = useGetNodes()

    if (isInternalSquadsLoading || isExternalSquadsLoading || isNodesLoading) {
        return <LoadingScreen />
    }

    return <UsersPageComponent />
}
