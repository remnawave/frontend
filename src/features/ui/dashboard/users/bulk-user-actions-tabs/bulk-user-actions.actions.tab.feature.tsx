import { PiClockClockwise, PiClockUser, PiNotchesDuotone, PiUserMinus } from 'react-icons/pi'
import { Button, Divider, Group, NumberInput, Paper, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'

import {
    useBulkExtendUsersExpirationDate,
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

    const { mutate: extendExpirationDate, isPending: isExtendExpirationDatePending } =
        useBulkExtendUsersExpirationDate({
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

    const handleExtendExpirationDate = () => {
        let userInput = 1

        modals.open({
            title: t('bulk-user-actions.actions.tab.feature.extend-expiration-date'),
            centered: true,
            children: (
                <>
                    <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        data-autofocus
                        decimalScale={0}
                        defaultValue={1}
                        description={t(
                            'bulk-user-actions.actions.tab.feature.enter-the-number-of-days-to-extend-the-expiration-date'
                        )}
                        label={t('bulk-user-actions.actions.tab.feature.extend-days')}
                        max={9999}
                        min={1}
                        onChange={(value) => {
                            userInput = Number(value)
                        }}
                        required
                        step={1}
                    />
                    <Button
                        fullWidth
                        mt="md"
                        onClick={() => {
                            modals.closeAll()
                            extendExpirationDate({
                                variables: {
                                    uuids,
                                    extendDays: userInput
                                }
                            })
                        }}
                    >
                        {t('bulk-user-actions.actions.tab.feature.extend')}
                    </Button>
                </>
            )
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

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiClockUser size={20} />
                                <Text fw={600} size="md">
                                    {t(
                                        'bulk-user-actions.actions.tab.feature.extend-expiration-date'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.actions.tab.feature.extend-expiration-date-description'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        loading={isExtendExpirationDatePending}
                        onClick={handleExtendExpirationDate}
                        size="sm"
                        style={{
                            transition: 'all 0.2s ease'
                        }}
                        variant="light"
                    >
                        {t('bulk-user-actions.actions.tab.feature.extend')}
                    </Button>
                </Group>
            </Paper>

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiClockClockwise size={20} />
                                <Text fw={600} size="md">
                                    {t('bulk-user-actions.actions.tab.feature.reset-traffic')}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.actions.tab.feature.resets-the-traffic-usage-to-zero-for-all-selected-users'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        color="cyan"
                        loading={isResetPending}
                        onClick={handleResetTraffic}
                        variant="light"
                    >
                        {t('bulk-user-actions.actions.tab.feature.reset')}
                    </Button>
                </Group>
            </Paper>

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiUserMinus size={20} />
                                <Text fw={600} size="md">
                                    {t('bulk-user-actions.actions.tab.feature.revoke-subscription')}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.actions.tab.feature.revokes-subscription-for-all-selected-users'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        color="orange"
                        loading={isRevokePending}
                        onClick={handleRevokeSubscription}
                        variant="light"
                    >
                        {t('bulk-user-actions.actions.tab.feature.revoke')}
                    </Button>
                </Group>
            </Paper>

            <Paper bg="dark.7" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiNotchesDuotone size={20} />
                                <Text fw={600} size="md">
                                    {t(
                                        'bulk-user-actions.actions.tab.feature.change-active-internal-squads'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.actions.tab.feature.changes-the-active-internal-squads-for-all-selected-users'
                                )}
                            </Text>

                            <InternalSquadsListWidget
                                description={t(
                                    'bulk-user-actions.actions.tab.feature.specify-internal-squads-that-will-be-assigned-to-the-user'
                                )}
                                filteredInternalSquads={filteredInternalSquads}
                                formKey={form.key('activeInternalSquads')}
                                hideEditButton={true}
                                label={t('bulk-user-actions.actions.tab.feature.internal-squads')}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                {...form.getInputProps('activeInternalSquads')}
                            />
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
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
            </Paper>
        </Stack>
    )
}
