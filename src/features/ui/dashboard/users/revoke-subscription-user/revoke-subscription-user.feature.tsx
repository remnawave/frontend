import { Loader, Menu, Text } from '@mantine/core'
import { PiKeyDuotone } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { useRevokeUserSubscription, usersQueryKeys } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces'

export function RevokeSubscriptionUserFeature(props: IProps) {
    const { userUuid } = props

    const { mutate: revokeUserSubscription, isPending } = useRevokeUserSubscription({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    usersQueryKeys.getUserByUuid({ uuid: userUuid }).queryKey,
                    data
                )
            }
        }
    })

    const openModal = () =>
        modals.openConfirmModal({
            title: 'Revoke subscription',
            children: (
                <Text size="sm">
                    Are you sure you want to revoke the user subscription? This action is
                    irreversible.
                </Text>
            ),
            labels: { confirm: 'Revoke', cancel: 'Cancel' },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => revokeUserSubscription({ route: { uuid: userUuid } })
        })

    return (
        <Menu.Item
            leftSection={isPending ? <Loader size="1rem" /> : <PiKeyDuotone size="16px" />}
            onClick={openModal}
        >
            Revoke Subscription
        </Menu.Item>
    )
}
