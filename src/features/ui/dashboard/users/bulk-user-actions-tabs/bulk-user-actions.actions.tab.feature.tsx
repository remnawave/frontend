import { PiClockClockwise, PiNotchesDuotone, PiUserMinus } from 'react-icons/pi'
import { Button, Group, Paper, px, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'

import {
    useBulkResetTraffic,
    useBulkRevokeUsersSubscription,
    useBulkSetActiveInternalSquads,
    useGetInternalSquads
} from '@shared/api/hooks'
import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { InternalSquadsListWidget } from '@widgets/dashboard/users/internal-squads-list'

import { IProps } from './interfaces/props.interface'

export const BulkUserActionsActionsTabFeature = (props: IProps) => {
    const { t } = useTranslation()

    const actions = useBulkUsersActionsStoreActions()
    const uuids = actions.getUuids()
    const { cleanUpDrawer } = props

    const { data: internalSquads } = useGetInternalSquads()

    const form = useForm({
        name: 'change-active-internal-squads-form',
        mode: 'uncontrolled',
        initialValues: {
            activeInternalSquads: []
        }
    })

    const [searchQuery, setSearchQuery] = useState('')

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

    const { mutate: setActiveInternalSquads, isPending: isSetActiveInternalSquadsPending } =
        useBulkSetActiveInternalSquads({
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
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('bulk-user-actions.actions.tab.feature.revoke'),
                cancel: t('common.cancel')
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
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('bulk-user-actions.actions.tab.feature.reset'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'blue' },
            onConfirm: () => {
                resetTraffic({
                    variables: { uuids }
                })
            }
        })
    }

    const filteredInternalSquads = useMemo(() => {
        const allInternalSquads = internalSquads?.internalSquads || []
        if (!searchQuery.trim()) return allInternalSquads

        const query = searchQuery.toLowerCase().trim()
        return allInternalSquads.filter((internalSquad) =>
            internalSquad.name?.toLowerCase().includes(query)
        )
    }, [internalSquads, searchQuery])

    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('bulk-user-actions.actions.tab.feature.perform-action-on-users', {
                    usersCount: actions.getUuidLength()
                })}
            </Text>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiNotchesDuotone color="cyan" size={px('1.2rem')} />
                            <Text>
                                {t(
                                    'bulk-user-actions.actions.tab.feature.change-active-internal-squads'
                                )}
                            </Text>
                        </Group>
                        <InternalSquadsListWidget
                            description={t(
                                'bulk-user-actions.actions.tab.feature.specify-internal-squads-that-will-be-assigned-to-the-user'
                            )}
                            filteredInternalSquads={filteredInternalSquads}
                            formKey={form.key('activeInternalSquads')}
                            label={t('bulk-user-actions.actions.tab.feature.internal-squads')}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            {...form.getInputProps('activeInternalSquads')}
                        />

                        <Button
                            color="cyan"
                            loading={isSetActiveInternalSquadsPending}
                            onClick={() => {
                                setActiveInternalSquads({
                                    variables: {
                                        uuids,
                                        activeInternalSquads: form.getValues().activeInternalSquads
                                    }
                                })
                            }}
                            variant="light"
                        >
                            {t('common.change')}
                        </Button>
                    </Group>
                    <Text c="dimmed" size="xs">
                        {t(
                            'bulk-user-actions.actions.tab.feature.changes-the-active-internal-squads-for-all-selected-users'
                        )}
                    </Text>
                </Stack>
            </Paper>

            <Paper p="md" withBorder>
                <Stack>
                    <Group justify="apart">
                        <Group>
                            <PiClockClockwise color="cyan" size={px('1.2rem')} />
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
                            <PiUserMinus color="orange" size={px('1.2rem')} />
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
