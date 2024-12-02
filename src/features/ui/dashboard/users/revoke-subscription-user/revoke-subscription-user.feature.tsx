import { notifications } from '@mantine/notifications'
import { ActionIcon, Tooltip } from '@mantine/core'
import { PiKeyDuotone } from 'react-icons/pi'
import { useState } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreUser
} from '@/entitites/dashboard/user-modal-store/user-modal-store'

import { IProps } from './interfaces'

export function RevokeSubscriptionUserFeature(props: IProps) {
    const actions = useUserModalStoreActions()
    const [isLoading, setIsLoading] = useState(false)
    const user = useUserModalStoreUser()

    if (!user) return null

    const handleRevokeSubscription = async () => {
        setIsLoading(true)
        try {
            await actions.reveokeSubscription()

            notifications.show({
                title: 'Success',
                message: 'Subscription revoked',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to revoke subscription',
                color: 'red'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Tooltip label="Revoke subscription">
            <ActionIcon
                color="green"
                loading={isLoading}
                onClick={handleRevokeSubscription}
                size="xl"
            >
                <PiKeyDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
