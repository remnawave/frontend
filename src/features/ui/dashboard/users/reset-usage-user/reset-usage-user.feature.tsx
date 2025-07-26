import { PiClockCounterClockwiseDuotone } from 'react-icons/pi'
import { Loader, Menu, Text } from '@mantine/core'
import { modals } from '@mantine/modals'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { useResetUserTraffic } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function ResetUsageUserFeature(props: IProps) {
    const { userUuid } = props
    const actions = useUserModalStoreActions()

    const { mutate: resetUserTraffic, isPending: isResetUserTrafficPending } = useResetUserTraffic({
        mutationFns: {
            onSuccess: () => {
                actions.changeModalState(false)
            }
        }
    })

    const handleResetUsage = async () => {
        resetUserTraffic({
            route: {
                uuid: userUuid ?? ''
            }
        })
    }

    const openModal = () =>
        modals.openConfirmModal({
            title: 'Reset user traffic',
            children: (
                <Text size="sm">
                    Are you sure you want to reset the user traffic? This action is irreversible.
                </Text>
            ),
            labels: { confirm: 'Reset', cancel: 'Cancel' },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => handleResetUsage()
        })

    return (
        <Menu.Item
            leftSection={
                isResetUserTrafficPending ? (
                    <Loader color="var(--mantine-color-blue-5)" size={'1rem'} />
                ) : (
                    <PiClockCounterClockwiseDuotone
                        color="var(--mantine-color-blue-5)"
                        size="16px"
                    />
                )
            }
            onClick={openModal}
        >
            Reset usage
        </Menu.Item>
    )
}
