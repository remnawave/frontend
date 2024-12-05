import { useEffect } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { useUserCreationModalStoreIsModalOpen } from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { useDashboardStoreActions } from '@entities/dashboard/dashboard-store/dashboard-store'
import { queryClient } from '@shared/api'

import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    const actions = useDashboardStoreActions()

    const isModalOpen = useUserModalStoreIsModalOpen()
    const userModalActions = useUserModalStoreActions()

    const isCreateUserModalOpen = useUserCreationModalStoreIsModalOpen()

    useEffect(() => {
        return () => {
            actions.resetState()
            userModalActions.resetState()
        }
    }, [])

    useEffect(() => {
        if (isModalOpen || isCreateUserModalOpen) return
        actions.getSystemInfo()

        queryClient.invalidateQueries({ queryKey: ['users'] })
    }, [isModalOpen, isCreateUserModalOpen])

    return <UsersPageComponent />
}
