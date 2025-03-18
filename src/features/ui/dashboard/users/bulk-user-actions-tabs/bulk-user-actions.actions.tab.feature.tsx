import { Button, Checkbox, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { PiClockClockwise, PiNotchesDuotone, PiUserMinus } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import {
    useBulkResetTraffic,
    useBulkRevokeUsersSubscription,
    useBulkSetActiveInbounds,
    useGetFullInbounds
} from '@shared/api/hooks'
import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { InboundCheckboxCardWidget } from '@widgets/dashboard/users/inbound-checkbox-card'

import { IProps } from './interfaces/props.interface'

export const BulkUserActionsActionsTabFeature = (props: IProps) => {
    const { t } = useTranslation()

    const actions = useBulkUsersActionsStoreActions()
    const uuidsLength = actions.getUuidLenght()
    const uuids = actions.getUuids()
    const { cleanUpDrawer } = props

    const { data: inbounds } = useGetFullInbounds()

    const { mutate: revokeUsersSubscription, isPending: isRevokePending } =
        useBulkRevokeUsersSubscription({
            mutationFns: {
                onSuccess: () => {
                    cleanUpDrawer()
                }
            }
        })

    const { mutate: resetTraffic, isPending: isResetPending } = useBulkResetTraffic({
        mutationFns: {
            onSuccess: () => {
                cleanUpDrawer()
            }
        }
    })

    const { mutate: setActiveInbounds, isPending: isSetActiveInboundsPending } =
        useBulkSetActiveInbounds({
            mutationFns: {
                onSuccess: () => {
                    cleanUpDrawer()
                }
            }
        })

    const handleRevokeSubscription = () => {
        modals.openConfirmModal({
            title: t('bulk-user-actions.actions.tab.feature.revoke-subscription'),
            centered: true,
            children: (
                <Text size="sm">
                    {t('bulk-user-actions.actions.tab.feature.revoke-confirmation-line-1', {
                        usersCount: uuidsLength
                    })}
                    <br />
                    {t('bulk-user-actions.actions.tab.feature.revoke-confirmation-line-2')}
                </Text>
            ),
            labels: {
                confirm: t('bulk-user-actions.actions.tab.feature.revoke'),
                cancel: t('bulk-user-actions.actions.tab.feature.cancel')
            },
            confirmProps: { color: 'orange' },
            onConfirm: () => {
                revokeUsersSubscription({
                    variables: { uuids }
                })
            }
        })
    }

    const handleResetTraffic = () => {
        modals.openConfirmModal({
            title: t('bulk-user-actions.actions.tab.feature.reset-traffic'),
            centered: true,
            children: (
                <Text size="sm">
                    {t('bulk-user-actions.actions.tab.feature.reset-traffic-confirmation-line-1', {
                        usersCount: uuidsLength
                    })}
                    <br />
                    {t('bulk-user-actions.actions.tab.feature.reset-traffic-confirmation-line-2')}
                </Text>
            ),
            labels: {
                confirm: t('bulk-user-actions.actions.tab.feature.reset'),
                cancel: t('bulk-user-actioins-modal.widget.cancel')
            },
            confirmProps: { color: 'blue' },
            onConfirm: () => {
                resetTraffic({
                    variables: { uuids }
                })
            }
        })
    }

    const handleChangeActiveInbounds = () => {
        let selectedInbounds: string[] = []

        modals.openConfirmModal({
            title: t('bulk-user-actions.actions.tab.feature.change-active-inbounds'),
            centered: true,
            children: (
                <Checkbox.Group
                    description={t('create-user-modal.widget.inbounds-description')}
                    label={t('create-user-modal.widget.inbounds')}
                    onChange={(value) => {
                        selectedInbounds = value
                    }}
                >
                    <SimpleGrid
                        cols={{
                            base: 1,
                            sm: 1,
                            md: 2
                        }}
                        key={'view-user-inbounds-grid'}
                        pt="md"
                    >
                        {inbounds?.map((inbound) => (
                            <InboundCheckboxCardWidget inbound={inbound} key={inbound.uuid} />
                        ))}
                    </SimpleGrid>
                </Checkbox.Group>
            ),
            labels: {
                confirm: t('bulk-user-actions.actions.tab.feature.change'),
                cancel: t('bulk-user-actioins-modal.widget.cancel')
            },
            confirmProps: { color: 'blue' },
            onConfirm: () => {
                if (selectedInbounds.length === 0) {
                    notifications.show({
                        title: t('bulk-user-actions.actions.tab.feature.no-inbounds-selected'),
                        message: t(
                            'bulk-user-actions.actions.tab.feature.please-select-at-least-one-inbound'
                        ),
                        color: 'red'
                    })
                    return
                }
                setActiveInbounds({
                    variables: {
                        uuids,
                        activeUserInbounds: selectedInbounds
                    }
                })
            }
        })
    }

    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('bulk-user-actions.actions.tab.feature.perform-action-on-users', {
                    usersCount: actions.getUuidLenght()
                })}
            </Text>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiNotchesDuotone color="cyan" size="1.2rem" />
                            <Text>
                                {t('bulk-user-actions.actions.tab.feature.change-active-inbounds')}
                            </Text>
                        </Group>
                        <Button
                            color="cyan"
                            loading={isSetActiveInboundsPending}
                            onClick={handleChangeActiveInbounds}
                            variant="light"
                        >
                            {t('bulk-user-actions.actions.tab.feature.change')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-user-actions.actions.tab.feature.changes-the-active-inbounds-for-all-selected-users'
                        )}
                    </Text>
                </Stack>
            </Paper>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiClockClockwise color="cyan" size="1.2rem" />
                            <Text>{t('bulk-user-actions.actions.tab.feature.reset-traffic')}</Text>
                        </Group>
                        <Button
                            color="cyan"
                            loading={isResetPending}
                            onClick={handleResetTraffic}
                            variant="light"
                        >
                            {t('bulk-user-actions.actions.tab.feature.reset')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-user-actions.actions.tab.feature.resets-the-traffic-usage-to-zero-for-all-selected-users'
                        )}
                    </Text>
                </Stack>
            </Paper>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiUserMinus color="orange" size="1.2rem" />
                            <Text>
                                {t('bulk-user-actions.actions.tab.feature.revoke-subscription')}
                            </Text>
                        </Group>
                        <Button
                            color="orange"
                            loading={isRevokePending}
                            onClick={handleRevokeSubscription}
                            variant="light"
                        >
                            {t('bulk-user-actions.actions.tab.feature.revoke')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-user-actions.actions.tab.feature.revokes-subscription-for-all-selected-users'
                        )}
                    </Text>
                </Stack>
            </Paper>
        </Stack>
    )
}
