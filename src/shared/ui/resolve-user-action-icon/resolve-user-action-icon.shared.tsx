import { PiUserCircle } from 'react-icons/pi'
import { ActionIcon } from '@mantine/core'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { useResolveUser } from '@shared/api/hooks'

interface IProps {
    userId: number
}

export function ResolveUserActionShared(props: IProps) {
    const { userId } = props

    const { mutateAsync: resolveUser, isPending } = useResolveUser()
    const userModalActions = useUserModalStoreActions()

    return (
        <ActionIcon
            loading={isPending}
            onClick={() => {
                resolveUser({
                    variables: {
                        id: Number(userId)
                    }
                }).then(async (result) => {
                    await userModalActions.setUserUuid(result.uuid)
                    userModalActions.changeModalState(true)
                })
            }}
            size="input-sm"
            variant="soft"
        >
            <PiUserCircle size="1.5rem" />
        </ActionIcon>
    )
}
