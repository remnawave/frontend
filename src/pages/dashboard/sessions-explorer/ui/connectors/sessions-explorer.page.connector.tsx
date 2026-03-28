import { useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import SessionsExplorerPageComponent from '../components/sessions-explorer.page.component'

export function SessionsExplorerPageConnector() {
    const { isLoading: isNodesLoading } = useGetNodes()

    if (isNodesLoading) {
        return <LoadingScreen />
    }

    return <SessionsExplorerPageComponent />
}
