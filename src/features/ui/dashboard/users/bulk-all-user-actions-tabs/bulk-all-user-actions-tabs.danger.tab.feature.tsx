import { Alert, Button, Divider, Group, Paper, Stack, Text } from '@mantine/core'
import { PiTrash, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

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

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiTrash color="var(--mantine-color-red-6)" size={20} />
                                <Text fw={600} size="md">
                                    {t(
                                        'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-all-user-actions-tabs.danger.tab.feature.delete-users-by-status-description'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        color="red.6"
                        onClick={() => {
                            modals.open({
                                title: (
                                    <BaseOverlayHeader
                                        IconComponent={PiTrash}
                                        iconVariant="gradient-red"
                                        title={t('common.confirm-action')}
                                    />
                                ),
                                centered: true,
                                children: (
                                    <DeleteAllUsersByStatusFeature cleanUpDrawer={cleanUpDrawer} />
                                )
                            })
                        }}
                        variant="light"
                    >
                        {t('common.delete')}
                    </Button>
                </Group>
            </Paper>
        </Stack>
    )
}
