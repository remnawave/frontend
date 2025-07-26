import { useGetInternalSquads } from '@shared/api/hooks'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    useGetInternalSquads()

    return <UsersPageComponent />
}
