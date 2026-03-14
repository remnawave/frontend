import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetNodes,
    useGetUserTags
} from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    const { isLoading: isInternalSquadsLoading } = useGetInternalSquads()
    const { isLoading: isExternalSquadsLoading } = useGetExternalSquads()
    const { isLoading: isNodesLoading } = useGetNodes()
    const { isLoading: isTagsLoading } = useGetUserTags()

    if (isInternalSquadsLoading || isExternalSquadsLoading || isNodesLoading || isTagsLoading) {
        return <LoadingScreen />
    }

    return <UsersPageComponent />
}
