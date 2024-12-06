import { useEffect } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { useUserCreationModalStoreIsModalOpen } from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { SYSTEM_QUERY_KEY } from '@shared/api/hooks/system/system.hooks'
import { queryClient } from '@shared/api'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    const isModalOpen = useUserModalStoreIsModalOpen()
    const userModalActions = useUserModalStoreActions()

    const isCreateUserModalOpen = useUserCreationModalStoreIsModalOpen()

    useEffect(() => {
        return () => {
            userModalActions.resetState()
        }
    }, [])

    useEffect(() => {
        if (isModalOpen || isCreateUserModalOpen) return

        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: [SYSTEM_QUERY_KEY] })
    }, [isModalOpen, isCreateUserModalOpen])

    return <UsersPageComponent />
}
