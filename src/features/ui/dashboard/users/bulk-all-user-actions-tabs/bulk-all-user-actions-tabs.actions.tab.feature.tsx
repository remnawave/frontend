import { Button, Group, Paper, px, Stack, Text } from '@mantine/core'
import { PiClockClockwise } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { useBulkAllResetTrafficUsers } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const BulkAllUserActionsActionsTabFeature = (props: IProps) => {
    const { t } = useTranslation()

    const { cleanUpDrawer } = props

    const { mutate: resetTraffic, isPending: isResetTrafficPending } = useBulkAllResetTrafficUsers({
        mutationFns: {
            onSuccess: () => {
                cleanUpDrawer()
            }
        }
    })

    const handleResetTraffic = () => {
        modals.openConfirmModal({
            title: t('bulk-all-user-actions-tabs.actions.tab.feature.confirm-action'),
            centered: true,
            children: (
                <Text>
                    {t('bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic-confirmation')}
                </Text>
            ),
            labels: {
                confirm: t('bulk-all-user-actions-tabs.actions.tab.feature.reset'),
                cancel: t('bulk-all-user-actions-tabs.actions.tab.feature.cancel')
            },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                resetTraffic({})
            }
        })
    }
    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('bulk-all-user-actions-tabs.actions.tab.feature.perform-actions-on-all-users')}
            </Text>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiClockClockwise color="cyan" size={px('1.2rem')} />
                            <Text>
                                {t('bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic')}
                            </Text>
                        </Group>
                        <Button
                            color="cyan"
                            loading={isResetTrafficPending}
                            onClick={handleResetTraffic}
                            variant="light"
                        >
                            {t('bulk-all-user-actions-tabs.actions.tab.feature.reset')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic-description'
                        )}
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    )
}
