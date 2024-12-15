import { useEffect } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { useUserCreationModalStoreIsModalOpen } from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { QueryKeys } from '@shared/api/hooks'
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
        ;(async () => {
            await queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
            await queryClient.refetchQueries({ queryKey: QueryKeys.system._def })
        })()
    }, [isModalOpen, isCreateUserModalOpen])

    return <UsersPageComponent />
}
