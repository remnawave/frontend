import { ActionIcon, Tooltip } from '@mantine/core'
import { PiKeyDuotone } from 'react-icons/pi'

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

    return (
        <Tooltip label="Revoke subscription">
            <ActionIcon
                color="green"
                loading={isPending}
                onClick={() => revokeUserSubscription({ route: { uuid: userUuid } })}
                size="xl"
            >
                <PiKeyDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
