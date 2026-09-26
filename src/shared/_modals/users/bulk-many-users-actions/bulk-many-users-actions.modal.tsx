import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    Button,
    Divider,
    Group,
    Modal,
    NumberInput,
    Paper,
    Stack,
    Text,
    ThemeIcon
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { InternalSquadsListWidget } from '@widgets/dashboard/users/internal-squads-list'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TbCalendarUp,
    TbCirclesRelation,
    TbDots,
    TbRefresh,
    TbRefreshAlert,
    TbUsersMinus
} from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    useGetInternalSquads,
    useBulkDeleteUsers,
    useBulkRevokeUsersSubscription,
    useBulkResetTraffic,
    useBulkSetActiveInternalSquads,
    useBulkExtendUsersExpirationDate
} from '@shared/api/hooks'
import { ActionCardShared } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { useUsersTableSelectionStoreActions } from '@entities/dashboard/users/users-table-selection'

interface IProps {
    usersCount: number
    onClose: () => void
}

export const BulkManyUsersActionsModal = NiceModal.create((props: IProps) => {
    const { usersCount, onClose } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        onClose
    })

    const [searchQuery, setSearchQuery] = useState('')

    const actions = useUsersTableSelectionStoreActions()

    const { data: internalSquads } = useGetInternalSquads()

    const { mutate: deleteUsers, isPending: isDeletePending } = useBulkDeleteUsers()
    const { mutate: revokeUsersSubscription, isPending: isRevokePending } =
        useBulkRevokeUsersSubscription()
    const { mutate: resetTraffic, isPending: isResetPending } = useBulkResetTraffic()
    const { mutate: setActiveInternalSquads, isPending: isSetActiveInternalSquadsPending } =
        useBulkSetActiveInternalSquads()
    const { mutate: extendExpirationDate, isPending: isExtendExpirationDatePending } =
        useBulkExtendUsersExpirationDate()

    const userIds = actions.getIds()

    const form = useForm({
        name: 'change-active-internal-squads-form',
        mode: 'uncontrolled',
        initialValues: {
            activeInternalSquads: []
        }
    })

    const handleExtendExpirationDate = () => {
        let userInput = 1

        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCalendarUp}
                    iconVariant="soft"
                    title={t('bulk-user-actions.actions.tab.feature.extend-expiration-date')}
                    titleOrder={5}
                />
            ),
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
                                    userIds,
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
        <Modal
            {...modalProps}
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbDots}
                    iconVariant="soft"
                    subtitle={t('bulk-user-actions.actions.tab.feature.perform-action-on-users', {
                        usersCount
                    })}
                    title={t('common.action.bulk-actions')}
                    titleOrder={5}
                />
            }
        >
            <Stack gap="xs">
                <ActionCardShared
                    description={t(
                        'bulk-user-actions.actions.tab.feature.extend-expiration-date-description'
                    )}
                    icon={<TbCalendarUp size={20} />}
                    iconColor="cyan"
                    isLoading={isExtendExpirationDatePending}
                    onClick={handleExtendExpirationDate}
                    title={t('bulk-user-actions.actions.tab.feature.extend-expiration-date')}
                    variant="soft"
                />
                <ActionCardShared
                    description={t(
                        'bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic-description'
                    )}
                    icon={<TbRefresh size={20} />}
                    iconColor="blue"
                    isLoading={isResetPending}
                    onClick={() =>
                        resetTraffic({
                            variables: { userIds }
                        })
                    }
                    title={t('common.action.reset-traffic')}
                    variant="soft"
                    withConfirmation
                />
                <ActionCardShared
                    description={t(
                        'bulk-user-actions.actions.tab.feature.revokes-subscription-for-all-selected-users'
                    )}
                    icon={<TbRefreshAlert size={20} />}
                    iconColor="orange"
                    isLoading={isRevokePending}
                    onClick={() =>
                        revokeUsersSubscription({
                            variables: { userIds }
                        })
                    }
                    title={t('bulk-user-actions.actions.tab.feature.revoke-subscription')}
                    variant="soft"
                    withConfirmation
                />
                <ActionCardShared
                    description={t(
                        'bulk-user-actions.danger.tab.feature.permanently-deletes-all-selected-users-and-their-data'
                    )}
                    icon={<TbUsersMinus size={20} />}
                    iconColor="red"
                    isLoading={isDeletePending}
                    onClick={() =>
                        deleteUsers({
                            variables: { userIds }
                        })
                    }
                    title={t('bulk-user-actions.danger.tab.feature.delete-users')}
                    variant="soft"
                    withConfirmation
                />
                <Paper
                    bg="rgba(255, 255, 255, 0.02)"
                    p="md"
                    shadow="sm"
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    withBorder
                >
                    <Stack gap="md">
                        <Group gap="md" justify="space-between" wrap="nowrap">
                            <Group gap="md" wrap="nowrap">
                                <ThemeIcon color="cyan" radius="md" size="xl" variant="soft">
                                    <TbCirclesRelation size={20} />
                                </ThemeIcon>
                                <Stack gap={2}>
                                    <Text fw={600} size="sm">
                                        {t('common.field.internal-squads')}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'bulk-user-actions.actions.tab.feature.specify-internal-squads-that-will-be-assigned-to-the-user'
                                        )}
                                    </Text>
                                </Stack>
                            </Group>
                        </Group>

                        <InternalSquadsListWidget
                            filteredInternalSquads={filteredInternalSquads}
                            formKey={form.key('activeInternalSquads')}
                            hideEditButton={true}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            {...form.getInputProps('activeInternalSquads')}
                        />
                    </Stack>

                    <Divider mb="md" mt="xs" />

                    <Group justify="flex-end">
                        <Button
                            color="cyan"
                            loading={isSetActiveInternalSquadsPending}
                            onClick={() => {
                                setActiveInternalSquads({
                                    variables: {
                                        userIds,
                                        activeInternalSquads: form.getValues().activeInternalSquads
                                    }
                                })
                            }}
                            variant="soft"
                        >
                            {t('common.action.change')}
                        </Button>
                    </Group>
                </Paper>
            </Stack>
        </Modal>
    )
})
