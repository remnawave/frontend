import { BulkDeleteUsersByStatusCommand, TUsersStatus } from '@remnawave/backend-contract'
import { TbCheck as IconCheck, TbX as IconX } from 'react-icons/tb'
import { Button, Group, Select, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { PiClockDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useState } from 'react'

import { userStatusValues } from '@shared/constants/forms/user-status.constants'
import { useBulkDeleteUsersByStatus } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const DeleteAllUsersByStatusFeature = (props: IProps) => {
    const { cleanUpDrawer } = props
    const { t } = useTranslation()

    const [selectedStatus, setSelectedStatus] = useState<null | TUsersStatus>(null)
    const { mutate: deleteUsersByStatus } = useBulkDeleteUsersByStatus({
        mutationFns: {
            onMutate: () => {
                const notificationId = notifications.show({
                    title: t('delete-all-users-by-status.feature.processing'),
                    message: t('delete-all-users-by-status.feature.deleting-users'),
                    loading: true,
                    autoClose: false,
                    withCloseButton: false,
                    color: 'blue'
                })

                modals.closeAll()
                cleanUpDrawer()

                return { notificationId }
            },
            onSuccess: (data, context: unknown) => {
                if (context && typeof context === 'object' && 'notificationId' in context) {
                    notifications.update({
                        icon: <IconCheck size={18} />,
                        id: context.notificationId as string,
                        title: t('delete-all-users-by-status.feature.success'),
                        message: t(
                            'delete-all-users-by-status.feature.deleted-data-affectedrows-users',
                            {
                                count: data.affectedRows
                            }
                        ),
                        color: 'teal',
                        loading: false,
                        autoClose: 2000
                    })
                }
            },
            onError: (error, context: unknown) => {
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
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () =>
                selectedStatus && deleteUsersByStatus({ variables: { status: selectedStatus } })
        })

    return (
        <Group align="flex-start" grow={false}>
            <Stack gap="md" w={400}>
                <Select
                    allowDeselect={false}
                    data={userStatusValues}
                    description={t('bulk-user-actioins-modal.widget.user-deletion-description')}
                    label={t('bulk-user-actioins-modal.widget.select-status')}
                    leftSection={<PiClockDuotone size="16px" />}
                    onChange={(value) => setSelectedStatus(value as TUsersStatus)}
                    placeholder={t('bulk-user-actioins-modal.widget.select-status')}
                    value={selectedStatus}
                />
                <Button color="red" disabled={!selectedStatus} onClick={confirmDeleteUsers}>
                    {t('common.delete')}
                </Button>
            </Stack>
        </Group>
    )
}
