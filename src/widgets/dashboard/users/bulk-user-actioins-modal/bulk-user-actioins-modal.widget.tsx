import { BulkDeleteUsersByStatusCommand, TUsersStatus } from '@remnawave/backend-contract'
import { Button, Group, Select, Stack, Text } from '@mantine/core'
import { IconCheck, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { PiClockDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useState } from 'react'

import { userStatusValues } from '@shared/constants/forms/user-status.constants'
import { QueryKeys, useBulkDeleteUsersByStatus } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

export const BulkUserActionsModalWidget = () => {
    const { t } = useTranslation()
    const [selectedStatus, setSelectedStatus] = useState<null | TUsersStatus>(null)
    const { mutate: deleteUsersByStatus } = useBulkDeleteUsersByStatus({
        mutationFns: {
            onMutate: () => {
                const notificationId = notifications.show({
                    title: 'Processing',
                    message: 'Deleting users...',
                    loading: true,
                    autoClose: false,
                    withCloseButton: false,
                    color: 'blue'
                })

                modals.closeAll()

                return { notificationId }
            },
            onSuccess: (data, variables, context: unknown) => {
                if (context && typeof context === 'object' && 'notificationId' in context) {
                    notifications.update({
                        icon: <IconCheck size={18} />,
                        id: context.notificationId as string,
                        title: 'Success',
                        message: `Deleted ${data.affectedRows} users`,
                        color: 'teal',
                        loading: false,
                        autoClose: 2000
                    })

                    queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
                }
            },
            onError: (error, variables, context: unknown) => {
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
            title: t('bulk-user-actioins-modal.widget.delete-users'),
            children: (
                <Text size="sm">
                    {t('bulk-user-actioins-modal.widget.confirm-action-description')}
                    <br />
                    {t('bulk-user-actioins-modal.widget.confirm-action-irreversible')}
                </Text>
            ),
            labels: {
                confirm: t('bulk-user-actioins-modal.widget.delete-users'),
                cancel: t('bulk-user-actioins-modal.widget.cancel')
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
                    leftSection={<PiClockDuotone size="1rem" />}
                    onChange={(value) => setSelectedStatus(value as TUsersStatus)}
                    placeholder={t('bulk-user-actioins-modal.widget.select-status')}
                    value={selectedStatus}
                />
                <Button color="red" disabled={!selectedStatus} onClick={confirmDeleteUsers}>
                    {t('bulk-user-actioins-modal.widget.delete-users')}
                </Button>
            </Stack>
        </Group>
    )
}
