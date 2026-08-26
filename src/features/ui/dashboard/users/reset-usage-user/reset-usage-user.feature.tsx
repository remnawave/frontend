import { Loader, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { PiClockCounterClockwiseDuotone } from 'react-icons/pi'

import { queryClient } from '@shared/api'
import { useResetUserTraffic, usersQueryKeys } from '@shared/api/hooks'

interface IProps {
    userId: number
}

export function ResetUsageUserFeature(props: IProps) {
    const { userId } = props
    const { t } = useTranslation()

    const { mutate: resetUserTraffic, isPending: isResetUserTrafficPending } = useResetUserTraffic({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    usersQueryKeys.getUserById({ userId: userId }).queryKey,
                    data
                )
            }
        }
    })

    const handleResetUsage = async () => {
        resetUserTraffic({
            route: {
                userId: userId
            }
        })
    }

    const openModal = () =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: { confirm: t('common.action.reset'), cancel: t('common.action.cancel') },
            centered: true,
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            onConfirm: () => handleResetUsage()
        })

    return (
        <Menu.Item
            leftSection={
                isResetUserTrafficPending ? (
                    <Loader size="1rem" />
                ) : (
                    <PiClockCounterClockwiseDuotone size="16px" />
                )
            }
            onClick={openModal}
        >
            {t('reset-usage-user.feature.reset-usage')}
        </Menu.Item>
    )
}
