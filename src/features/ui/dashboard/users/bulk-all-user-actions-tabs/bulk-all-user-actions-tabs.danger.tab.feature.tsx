import { Alert, Button, Group, Paper, px, Stack, Text } from '@mantine/core'
import { PiTrash, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { DeleteAllUsersByStatusFeature } from '../delete-all-users-by-status/delete-all-users-by-status.feature'
import { IProps } from './interfaces'

export const BulkAllUserActionsDangerTabFeature = (props: IProps) => {
    const { cleanUpDrawer } = props
    const { t } = useTranslation()

    return (
        <Stack gap="md">
            <Alert
                color="red.6"
                icon={<PiWarning size="16px" />}
                title={t('bulk-all-user-actions-tabs.danger.tab.feature.danger-zone')}
            >
                {t('bulk-all-user-actions-tabs.danger.tab.feature.danger-zone-description')}
            </Alert>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiTrash color="var(--mantine-color-red-6)" size={px('1.2rem')} />
                            <Text>
                                {t(
                                    'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status'
                                )}
                            </Text>
                        </Group>
                        <Button
                            color="red.6"
                            onClick={() => {
                                modals.open({
                                    title: t('common.confirm-action'),
                                    centered: true,
                                    children: (
                                        <DeleteAllUsersByStatusFeature
                                            cleanUpDrawer={cleanUpDrawer}
                                        />
                                    )
                                })
                            }}
                            variant="light"
                        >
                            {t('common.delete')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status-description'
                        )}
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    )
}
