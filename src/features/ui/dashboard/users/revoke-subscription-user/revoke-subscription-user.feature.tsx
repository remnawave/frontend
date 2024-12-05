import { ActionIcon, Tooltip } from '@mantine/core'
import { PiKeyDuotone } from 'react-icons/pi'

import { useInvalidateUsersTSQ, useRevokeUserSubscription } from '@/shared/api/hooks'

import { IProps } from './interfaces'

export function RevokeSubscriptionUserFeature(props: IProps) {
    const { userUuid } = props
    const refreshUsers = useInvalidateUsersTSQ()

    const { mutate: revokeUserSubscription, isPending } = useRevokeUserSubscription({
        mutationFns: {
            onSuccess: () => {
                refreshUsers()
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
