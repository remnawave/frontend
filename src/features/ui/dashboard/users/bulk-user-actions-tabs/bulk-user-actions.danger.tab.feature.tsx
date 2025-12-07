import { Alert, Button, Divider, Group, Paper, Stack, Text } from '@mantine/core'
import { PiTrash, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { useBulkDeleteUsers } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const BulkUserActionsDangerTabFeature = (props: IProps) => {
    const { cleanUpDrawer } = props
    const { t } = useTranslation()

    const actions = useBulkUsersActionsStoreActions()

    const uuids = actions.getUuids()

    const { mutate: deleteUsers, isPending: isDeletePending } = useBulkDeleteUsers({
        mutationFns: {
            onSuccess: () => {
                cleanUpDrawer()
            }
        }
    })

    const handleDeleteUsers = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteUsers({
                    variables: { uuids }
                })
            }
        })
    }

    return (
        <Stack gap="md">
            <Alert
                color="red.6"
                icon={<PiWarning size="16px" />}
                title={t('bulk-user-actions.danger.tab.feature.danger-zone')}
            >
                {t(
                    'bulk-user-actions.danger.tab.feature.these-actions-are-irreversible-and-can-result-in-permanent-data-loss'
                )}
            </Alert>

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiTrash color="var(--mantine-color-red-6)" size={20} />
                                <Text fw={600} size="md">
                                    {t('bulk-user-actions.danger.tab.feature.delete-users')}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.danger.tab.feature.permanently-deletes-all-selected-users-and-their-data'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        color="red.6"
                        loading={isDeletePending}
                        onClick={handleDeleteUsers}
                        variant="light"
                    >
                        {t('common.delete')}
                    </Button>
                </Group>
            </Paper>
        </Stack>
    )
}
