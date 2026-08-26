import { Button, Group, Select, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { BulkDeleteUsersByStatusCommand, TUsersStatus } from '@remnawave/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiClockDuotone } from 'react-icons/pi'
import { TbCheck as IconCheck, TbX as IconX } from 'react-icons/tb'

import { useBulkDeleteUsersByStatus } from '@shared/api/hooks'
import { userStatusValues } from '@shared/constants/forms/user-status.constants'

export const DeleteAllUsersByStatusFeature = () => {
    const { t } = useTranslation()

    const [selectedStatus, setSelectedStatus] = useState<null | TUsersStatus>(null)
    const { mutate: deleteUsersByStatus } = useBulkDeleteUsersByStatus({
        mutationFns: {
            onMutate: () => {
                const notificationId = notifications.show({
                    title: t('common.message.processing'),
                    message: t('delete-all-users-by-status.feature.deleting-users'),
                    loading: true,
                    autoClose: false,
                    withCloseButton: false,
                    color: 'blue'
                })

                modals.closeAll()

                return { notificationId }
            },
            onSuccess: (_data, _variables, context: unknown) => {
                if (context && typeof context === 'object' && 'notificationId' in context) {
                    notifications.update({
                        icon: <IconCheck size={18} />,
                        id: context.notificationId as string,
                        title: t('common.message.success'),
                        message: t('common.message.operation-completed'),
                        color: 'teal',
                        loading: false,
                        autoClose: 2000
                    })
                }
            },
            onError: (error, _variables, context: unknown) => {
                if (context && typeof context === 'object' && 'notificationId' in context) {
                    notifications.update({
                        id: context.notificationId as string,
                        icon: <IconX size={18} />,
                        title: `${BulkDeleteUsersByStatusCommand.TSQ_url}`,
                        message:
                            error instanceof Error
                                ? error.message
                                : `Request failed with unknown error.`,
                        color: 'red'
                    })
                }
            }
        }
    })

    const confirmDeleteUsers = () =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            centered: true,
            confirmProps: { color: 'red', variant: 'soft' },
            onConfirm: () =>
                selectedStatus && deleteUsersByStatus({ variables: { status: selectedStatus } })
        })

    return (
        <Group align="flex-start" grow={false}>
            <Stack gap="md" w={400}>
                <Select
                    allowDeselect={false}
                    data={userStatusValues}
                    description={t('bulk-user-actions-modal.widget.user-deletion-description')}
                    label={t('bulk-user-actions-modal.widget.select-status')}
                    leftSection={<PiClockDuotone size="16px" />}
                    onChange={(value) => setSelectedStatus(value as TUsersStatus)}
                    placeholder={t('bulk-user-actions-modal.widget.select-status')}
                    value={selectedStatus}
                />
                <Button color="red" disabled={!selectedStatus} onClick={confirmDeleteUsers}>
                    {t('common.action.delete')}
                </Button>
            </Stack>
        </Group>
    )
}
