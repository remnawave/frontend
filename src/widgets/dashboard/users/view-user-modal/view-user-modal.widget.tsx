import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    CopyButton,
    Divider,
    Group,
    Modal,
    NumberInput,
    Progress,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import {
    PiCalendarDuotone,
    PiCheck,
    PiClockDuotone,
    PiCopy,
    PiFloppyDiskDuotone,
    PiLinkDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { ToggleUserStatusButtonFeature } from '@features/ui/dashboard/users/toggle-user-status-button'
import { RevokeSubscriptionUserFeature } from '@features/ui/dashboard/users/revoke-subscription-user'
import { useGetInbounds, useGetUserByUuid, usersQueryKeys, useUpdateUser } from '@shared/api/hooks'
import { ResetUsageUserFeature } from '@features/ui/dashboard/users/reset-usage-user'
import { bytesToGbUtil, gbToBytesUtil, prettyBytesUtil } from '@shared/utils/bytes'
import { DeleteUserFeature } from '@features/ui/dashboard/users/delete-user'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@shared/constants'
import { queryClient } from '@shared/api'

import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'
import { IFormValues } from './interfaces'

export const ViewUserModal = () => {
    const { t } = useTranslation()

    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const selectedUser = useUserModalStoreUserUuid()

    const { data: inbounds } = useGetInbounds()

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser
    } = useGetUserByUuid({
        route: {
            uuid: selectedUser ?? ''
        },
        rQueryParams: {
            enabled: !!selectedUser
        }
    })

    const form = useForm<IFormValues>({
        name: 'edit-user-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateUserCommand.RequestSchema)
    })

    const {
        mutate: updateUser,
        isPending: isUpdateUserPending,
        isSuccess: isUserUpdated
    } = useUpdateUser({})

    useEffect(() => {
        if (isUserUpdated) {
            refetchUser()
            queryClient.setQueryData(
                usersQueryKeys.getUserByUuid({
                    uuid: selectedUser ?? ''
                }).queryKey,
                user
            )
        }
    }, [isUserUpdated])

    useEffect(() => {
        if (user && inbounds) {
            const activeInboundUuids = user.activeUserInbounds.map((inbound) => inbound.uuid)
            form.setValues({
                uuid: user.uuid,
                username: user.username,
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
                activeUserInbounds: activeInboundUuids,
                shortUuid: user.shortUuid,
                trojanPassword: user.trojanPassword,
                description: user.description ?? ''
            })
        }
    }, [user, inbounds])

    const usedTrafficPercentage = user ? (user.usedTrafficBytes / user.trafficLimitBytes) * 100 : 0
    const totalUsedTraffic = prettyBytesUtil(user?.usedTrafficBytes, true)

    const handleSubmit = form.onSubmit(async (values) => {
        const updateData = {
            uuid: values.uuid,
            trafficLimitStrategy: values.trafficLimitStrategy,
            trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
            expireAt: values.expireAt,
            activeUserInbounds: values.activeUserInbounds,
            description: values.description
        }

        updateUser({
            variables: updateData
        })
    })

    const handleClose = () => {
        actions.changeModalState(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
        }, 300)
    }

    const userSubscriptionUrlMemo = useMemo(
        () => user?.subscriptionUrl || '',
        [user?.subscriptionUrl]
    )

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isViewUserModalOpen}
            size="900px"
            title={t('view-user-modal.widget.edit-user')}
        >
            {isUserLoading ? (
                <LoaderModalShared h="400" text={t('view-user-modal.widget.loading-user-data')} />
            ) : (
                <form key="view-user-form" onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        {/* Left Section - User Settings */}
                        <Stack gap="md" key="view-user-details-stack" w={400}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <Text fw={500} key="view-user-details-text">
                                    {t('view-user-modal.widget.user-details')}
                                </Text>
                                {user && (
                                    <UserStatusBadge
                                        key="view-user-status-badge"
                                        status={user.status}
                                    />
                                )}
                            </Group>

                            <TextInput
                                description={t('view-user-modal.widget.username-cannot-be-changed')}
                                key={form.key('username')}
                                label={t('login-form-feature.username')}
                                {...form.getInputProps('username')}
                                disabled
                                leftSection={<PiUserDuotone size="1rem" />}
                                rightSection={
                                    <CopyButton timeout={2000} value={form.getValues().username}>
                                        {({ copied, copy }) => (
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size="1rem" />
                                                ) : (
                                                    <PiCopy size="1rem" />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </CopyButton>
                                }
                            />

                            <TextInput
                                key={form.key('shortUuid')}
                                label={t('view-user-modal.widget.subscription-short-uuid')}
                                {...form.getInputProps('shortUuid')}
                                disabled
                                leftSection={<PiLinkDuotone size="1rem" />}
                                rightSection={
                                    <CopyButton timeout={2000} value={form.getValues().shortUuid}>
                                        {({ copied, copy }) => (
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size="1rem" />
                                                ) : (
                                                    <PiCopy size="1rem" />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </CopyButton>
                                }
                            />

                            <TextInput
                                disabled
                                label={t('view-user-modal.widget.subscription-url')}
                                leftSection={<PiLinkDuotone size="1rem" />}
                                rightSection={
                                    <CopyButton
                                        timeout={2000}
                                        value={userSubscriptionUrlMemo || ''}
                                    >
                                        {({ copied, copy }) => (
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size="1rem" />
                                                ) : (
                                                    <PiCopy size="1rem" />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </CopyButton>
                                }
                                value={userSubscriptionUrlMemo || ''}
                            />

                            <TextInput
                                disabled
                                label={t('use-table-columns.created-at')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                                value={
                                    user?.createdAt
                                        ? dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')
                                        : ''
                                }
                            />

                            <TextInput
                                disabled
                                label={t('view-user-modal.widget.last-traffic-reset-at')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                                value={
                                    user?.lastTrafficResetAt
                                        ? dayjs(user.lastTrafficResetAt).format('DD/MM/YYYY HH:mm')
                                        : t('view-user-modal.widget.never')
                                }
                            />

                            <Textarea
                                description={t('create-user-modal.widget.user-description')}
                                key={form.key('description')}
                                label={t('use-table-columns.description')}
                                resize="vertical"
                                {...form.getInputProps('description')}
                            />
                        </Stack>

                        <Divider orientation="vertical" />

                        {/* Right Section - Connection Details */}
                        <Stack gap="md" w={400}>
                            <Text fw={500}>{t('view-user-modal.widget.connection-details')}</Text>

                            <NumberInput
                                allowDecimal={false}
                                decimalScale={0}
                                description={t('create-user-modal.widget.data-limit-description')}
                                key={form.key('trafficLimitBytes')}
                                label={t('create-user-modal.widget.data-limit')}
                                leftSection={
                                    <>
                                        <Text
                                            display="flex"
                                            size="0.75rem"
                                            style={{ justifyContent: 'center' }}
                                            ta="center"
                                            w={26}
                                        >
                                            GB
                                        </Text>
                                        <Divider orientation="vertical" />
                                    </>
                                }
                                {...form.getInputProps('trafficLimitBytes')}
                            />

                            <Box>
                                <Progress
                                    color={usedTrafficPercentage > 100 ? 'yellow.9' : 'teal.9'}
                                    size="xl"
                                    striped
                                    value={usedTrafficPercentage}
                                />
                                <Group gap="xs" justify="center" mt={2}>
                                    <Text c="white" fw={500} size="sm">
                                        {totalUsedTraffic === '0' ? '' : totalUsedTraffic}
                                    </Text>
                                </Group>
                            </Box>

                            <Select
                                allowDeselect={false}
                                data={resetDataStrategy}
                                defaultValue={form.values.trafficLimitStrategy}
                                description={t(
                                    'create-user-modal.widget.traffic-reset-strategy-description'
                                )}
                                key={form.key('trafficLimitStrategy')}
                                label={t('create-user-modal.widget.traffic-reset-strategy')}
                                leftSection={<PiClockDuotone size="1rem" />}
                                placeholder={t('create-user-modal.widget.pick-value')}
                                {...form.getInputProps('trafficLimitStrategy')}
                            />

                            <DateTimePicker
                                key={form.key('expireAt')}
                                label={t('create-user-modal.widget.expiry-date')}
                                valueFormat="MMMM D, YYYY - HH:mm"
                                {...form.getInputProps('expireAt')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                            />

                            <Checkbox.Group
                                key={form.key('activeUserInbounds')}
                                {...form.getInputProps('activeUserInbounds')}
                                description={t('create-user-modal.widget.inbounds-description')}
                                label={t('create-user-modal.widget.inbounds')}
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
                                        <InboundCheckboxCardWidget
                                            inbound={inbound}
                                            key={inbound.uuid}
                                        />
                                    ))}
                                </SimpleGrid>
                            </Checkbox.Group>
                        </Stack>
                    </Group>

                    <Group justify="space-between" mt="xl">
                        <Group>
                            <ActionIcon.Group>
                                <DeleteUserFeature userUuid={user?.uuid ?? ''} />
                                <ResetUsageUserFeature userUuid={user?.uuid ?? ''} />
                                <RevokeSubscriptionUserFeature userUuid={user?.uuid ?? ''} />
                            </ActionIcon.Group>
                        </Group>
                        <Group>
                            {user && <ToggleUserStatusButtonFeature user={user} />}
                            <Button
                                color="blue"
                                leftSection={<PiFloppyDiskDuotone size="1rem" />}
                                loading={isUpdateUserPending}
                                size="md"
                                type="submit"
                                variant="outline"
                            >
                                {t('view-user-modal.widget.edit-user')}
                            </Button>
                        </Group>
                    </Group>
                </form>
            )}
        </Modal>
    )
}
