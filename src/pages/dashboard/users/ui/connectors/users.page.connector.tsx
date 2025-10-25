import { useGetExternalSquads, useGetInternalSquads, useGetNodes } from '@shared/api/hooks'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    useGetInternalSquads()
    useGetNodes()
    useGetExternalSquads()

    return <UsersPageComponent />
}
