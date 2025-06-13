import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Checkbox,
    Code,
    CopyButton,
    Divider,
    Group,
    Modal,
    NumberInput,
    Progress,
    Select,
    Skeleton,
    Stack,
    Text,
    Textarea,
    TextInput,
    Tooltip
} from '@mantine/core'
import {
    PiCalendarDuotone,
    PiCheck,
    PiClockDuotone,
    PiCopy,
    PiEnvelopeDuotone,
    PiFloppyDiskDuotone,
    PiLinkDuotone,
    PiQrCodeDuotone,
    PiTelegramLogoDuotone
} from 'react-icons/pi'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useEffect, useMemo, useState } from 'react'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { TbDevices2 } from 'react-icons/tb'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { renderSVG } from 'uqr'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import {
    useGetInbounds,
    useGetUserByUuid,
    useGetUserTags,
    usersQueryKeys,
    useUpdateUser
} from '@shared/api/hooks'
import { GetUserSubscriptionLinksFeature } from '@features/ui/dashboard/users/get-user-subscription-links'
import { ToggleUserStatusButtonFeature } from '@features/ui/dashboard/users/toggle-user-status-button'
import { RevokeSubscriptionUserFeature } from '@features/ui/dashboard/users/revoke-subscription-user'
import { CreateableTagInputShared } from '@shared/ui/createable-tag-input/createable-tag-input'
import { GetHwidUserDevicesFeature } from '@features/ui/dashboard/users/get-hwid-user-devices'
import { ResetUsageUserFeature } from '@features/ui/dashboard/users/reset-usage-user'
import { bytesToGbUtil, gbToBytesUtil, prettyBytesUtil } from '@shared/utils/bytes'
import { GetUserUsageFeature } from '@features/ui/dashboard/users/get-user-usage'
import { DeleteUserFeature } from '@features/ui/dashboard/users/delete-user'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { resetDataStrategy } from '@shared/constants'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

import { InboundsListWidget } from '../inbounds-list'

export const ViewUserModal = () => {
    const { t } = useTranslation()

    const [searchQuery, setSearchQuery] = useState('')

    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const selectedUser = useUserModalStoreUserUuid()

    const { data: inbounds } = useGetInbounds()

    const form = useForm<UpdateUserCommand.Request>({
        name: 'edit-user-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            UpdateUserCommand.RequestSchema.omit({
                expireAt: true,
                email: true,
                telegramId: true,
                hwidDeviceLimit: true
            })
        )
    })

    const isQueryEnabled = !!selectedUser && !form.isTouched()

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser
    } = useGetUserByUuid({
        route: {
            uuid: selectedUser ?? ''
        },
        rQueryParams: {
            enabled: isQueryEnabled
        }
    })

    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()

    const {
        mutate: updateUser,
        isPending: isUpdateUserPending,
        isSuccess: isUserUpdated
    } = useUpdateUser({
        mutationFns: {
            onError: (error) => {
                handleFormErrors(form, error)
            }
        }
    })

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
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
                activeUserInbounds: activeInboundUuids,
                description: user.description ?? '',
                telegramId: user.telegramId ?? undefined,
                email: user.email ?? undefined,
                hwidDeviceLimit: user.hwidDeviceLimit ?? undefined,
                tag: user.tag ?? undefined
            })
        }
    }, [user, inbounds])

    const usedTrafficPercentage = user ? (user.usedTrafficBytes / user.trafficLimitBytes) * 100 : 0
    const totalUsedTraffic = prettyBytesUtil(user?.usedTrafficBytes, true)

    const handleSubmit = form.onSubmit(async (values) => {
        const dirtyFields = form.getDirty()

        updateUser({
            variables: {
                uuid: values.uuid,
                trafficLimitStrategy: dirtyFields.trafficLimitStrategy
                    ? values.trafficLimitStrategy
                    : undefined,
                trafficLimitBytes: dirtyFields.trafficLimitBytes
                    ? gbToBytesUtil(values.trafficLimitBytes)
                    : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                expireAt: dirtyFields.expireAt ? dayjs(values.expireAt).toISOString() : undefined,
                activeUserInbounds: dirtyFields.activeUserInbounds
                    ? values.activeUserInbounds
                    : undefined,
                description: dirtyFields.description ? values.description : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                telegramId: values.telegramId === '' ? null : values.telegramId,
                email: values.email === '' ? null : values.email,
                // @ts-expect-error - TODO: fix ZOD schema
                hwidDeviceLimit: values.hwidDeviceLimit === '' ? null : values.hwidDeviceLimit,
                // eslint-disable-next-line no-nested-ternary
                tag: dirtyFields.tag ? (values.tag === '' ? null : values.tag) : undefined
            }
        })
    })

    const handleClose = (closeModal: boolean = false) => {
        if (closeModal) {
            actions.changeModalState(false)
        }

        actions.clearModalState()

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const userSubscriptionUrlMemo = useMemo(
        () => user?.subscriptionUrl || '',
        [user?.subscriptionUrl]
    )

    const filteredInbounds = useMemo(() => {
        const allInbounds = inbounds || []
        if (!searchQuery.trim()) return allInbounds

        const query = searchQuery.toLowerCase().trim()
        return allInbounds.filter(
            (inbound) =>
                inbound.tag?.toLowerCase().includes(query) ||
                inbound.type?.toLowerCase().includes(query) ||
                inbound.port?.toString().includes(query)
        )
    }, [inbounds, searchQuery])

    return (
        <Modal
            centered
            onClose={() => actions.changeModalState(false)}
            onExitTransitionEnd={handleClose}
            opened={isViewUserModalOpen}
            size="900px"
            title={t('view-user-modal.widget.edit-user-headline')}
        >
            {isUserLoading || isTagsLoading || !user ? (
                <Stack>
                    <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <Skeleton height={26} width={150} />
                                <Skeleton height={26} width={80} />
                            </Group>
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                        </Stack>

                        <Divider
                            className="responsive-divider"
                            orientation="vertical"
                            visibleFrom="md"
                        />

                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
                            <Skeleton height={24} width={150} />
                            <Skeleton height={80} />
                            <Skeleton height={36} />
                            <Skeleton height={80} />
                            <Skeleton height={102} />
                            <Skeleton height={102} />
                            <Skeleton height={180} />
                        </Stack>
                    </Group>

                    <Group justify="space-between" mt={0}>
                        <Skeleton height={40} width={150} />
                        <Skeleton height={40} width={250} />
                    </Group>
                </Stack>
            ) : (
                <form key="view-user-form" onSubmit={handleSubmit}>
                    <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                        {/* Left Section - User Settings */}
                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <Text fw={500} key="view-user-details-text">
                                    {user.username}
                                </Text>

                                <UserStatusBadge
                                    key="view-user-status-badge"
                                    status={user.status}
                                />
                            </Group>

                            <TextInput
                                disabled
                                label={t('view-user-modal.widget.subscription-short-uuid')}
                                leftSection={<PiLinkDuotone size="1rem" />}
                                rightSection={
                                    <CopyButton timeout={2000} value={user.shortUuid}>
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
                                value={user.shortUuid}
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

                            <NumberInput
                                allowDecimal={false}
                                allowNegative={false}
                                hideControls
                                key={form.key('telegramId')}
                                label="Telegram ID"
                                leftSection={<PiTelegramLogoDuotone size="1rem" />}
                                placeholder="Enter user's Telegram ID (optional)"
                                {...form.getInputProps('telegramId')}
                            />

                            <TextInput
                                key={form.key('email')}
                                label="Email"
                                leftSection={<PiEnvelopeDuotone size="1rem" />}
                                placeholder="Enter user's email (optional)"
                                {...form.getInputProps('email')}
                            />

                            <Stack gap="xs">
                                <NumberInput
                                    allowDecimal={false}
                                    allowNegative={false}
                                    description={
                                        <>
                                            <Text c="dimmed" size="0.75rem">
                                                {t(
                                                    'create-user-modal.widget.hwid-user-limit-line-1'
                                                )}{' '}
                                                <Code>HWID_DEVICE_LIMIT_ENABLED</Code>{' '}
                                                {t(
                                                    'create-user-modal.widget.hwid-user-limit-line-2'
                                                )}{' '}
                                                <Code>true</Code>.{' '}
                                                <Anchor
                                                    href="https://remna.st/docs/features/hwid-device-limit"
                                                    target="_blank"
                                                >
                                                    {t(
                                                        'create-user-modal.widget.hwid-user-limit-line-3'
                                                    )}
                                                </Anchor>
                                            </Text>
                                            <Checkbox
                                                checked={form.getValues().hwidDeviceLimit === 0}
                                                label={t(
                                                    'create-user-modal.widget.disable-hwid-limit'
                                                )}
                                                mb={'xs'}
                                                mt={'xs'}
                                                onChange={(event) => {
                                                    const { checked } = event.currentTarget
                                                    form.setFieldValue(
                                                        'hwidDeviceLimit',
                                                        checked ? 0 : null
                                                    )
                                                }}
                                            />
                                        </>
                                    }
                                    descriptionProps={{
                                        component: 'div'
                                    }}
                                    disabled={form.getValues().hwidDeviceLimit === 0}
                                    hideControls
                                    key={form.key('hwidDeviceLimit')}
                                    label={t('create-user-modal.widget.hwid-device-limit')}
                                    leftSection={<TbDevices2 size="1rem" />}
                                    placeholder="HWID_FALLBACK_DEVICE_LIMIT in use"
                                    {...form.getInputProps('hwidDeviceLimit')}
                                />

                                <Stack gap="xs"></Stack>

                                <CreateableTagInputShared
                                    key={form.key('tag')}
                                    {...form.getInputProps('tag')}
                                    tags={tags?.tags ?? []}
                                    value={form.getValues().tag}
                                />
                            </Stack>

                            <Textarea
                                description={t('create-user-modal.widget.user-description')}
                                key={form.key('description')}
                                label={t('use-table-columns.description')}
                                resize="vertical"
                                {...form.getInputProps('description')}
                            />
                        </Stack>

                        <Divider
                            className="responsive-divider"
                            orientation="vertical"
                            visibleFrom="md"
                        />

                        {/* Right Section - Connection Details */}
                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
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
                                data={resetDataStrategy(t)}
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
                                highlightToday
                                key={form.key('expireAt')}
                                label={t('create-user-modal.widget.expiry-date')}
                                minDate={new Date()}
                                valueFormat="MMMM D, YYYY - HH:mm"
                                {...form.getInputProps('expireAt')}
                                description={t('create-user-modal.widget.expire-at-description')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                                onChange={(date) => {
                                    const formInputProps = form.getInputProps('expireAt')
                                    if (formInputProps.onChange) {
                                        formInputProps.onChange(date)
                                    }

                                    if (date === 'Invalid Date') {
                                        notifications.show({
                                            title: 'Invalid date',
                                            message:
                                                'Please select a valid date. Defaulting to 1 month from now.',
                                            color: 'red'
                                        })
                                        const currentDate = form.values.expireAt || new Date()
                                        const newDate = new Date(currentDate)
                                        newDate.setMonth(newDate.getMonth() + 1)
                                        form.setFieldValue('expireAt', newDate)
                                    }
                                }}
                                presets={[
                                    {
                                        value: dayjs()
                                            .add(1, 'month')
                                            .format('YYYY-MM-DD HH:mm:ss'),
                                        label: t('create-user-modal.widget.1-month')
                                    },
                                    {
                                        value: dayjs()
                                            .add(3, 'months')
                                            .format('YYYY-MM-DD HH:mm:ss'),
                                        label: t('create-user-modal.widget.3-months')
                                    },
                                    {
                                        value: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
                                        label: t('create-user-modal.widget.1-year')
                                    },
                                    {
                                        value: dayjs().year(2099).format('YYYY-MM-DD HH:mm:ss'),
                                        label: t('create-user-modal.widget.2099-year')
                                    }
                                ]}
                            />

                            <InboundsListWidget
                                checkboxLogic="include"
                                description={t('create-user-modal.widget.inbounds-description')}
                                filteredInbounds={filteredInbounds}
                                formKey={form.key('activeUserInbounds')}
                                handleIncludedInboundsChange={() => {}}
                                includedInbounds={inbounds?.map((inbound) => inbound.uuid) ?? []}
                                label={t('create-user-modal.widget.inbounds')}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                {...form.getInputProps('activeUserInbounds')}
                            />
                        </Stack>
                    </Group>

                    <Group justify="space-between" mt="xl">
                        <Group>
                            <ActionIcon.Group>
                                <DeleteUserFeature userUuid={user?.uuid ?? ''} />
                                <ResetUsageUserFeature userUuid={user?.uuid ?? ''} />
                                <RevokeSubscriptionUserFeature userUuid={user?.uuid ?? ''} />
                                {user && <ToggleUserStatusButtonFeature user={user} />}
                            </ActionIcon.Group>
                        </Group>
                        <Group grow preventGrowOverflow={false} wrap="wrap">
                            <ActionIcon.Group>
                                <Tooltip label={t('view-user-modal.widget.subscription-qr-code')}>
                                    <ActionIcon
                                        color="cyan"
                                        onClick={() => {
                                            const subscriptionQrCode = renderSVG(
                                                user.subscriptionUrl,
                                                {
                                                    whiteColor: '#161B22',
                                                    blackColor: '#3CC9DB'
                                                }
                                            )
                                            modals.open({
                                                centered: true,
                                                title: t(
                                                    'view-user-modal.widget.subscription-qr-code'
                                                ),
                                                children: (
                                                    <>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: subscriptionQrCode
                                                            }}
                                                        />
                                                        <Button
                                                            fullWidth
                                                            mt="md"
                                                            onClick={() => modals.closeAll()}
                                                        >
                                                            {t('view-user-modal.widget.close')}
                                                        </Button>
                                                    </>
                                                )
                                            })
                                        }}
                                        size="xl"
                                    >
                                        <PiQrCodeDuotone size="1.5rem" />
                                    </ActionIcon>
                                </Tooltip>
                                {user && (
                                    <GetUserSubscriptionLinksFeature shortUuid={user.shortUuid} />
                                )}
                                {user && <GetHwidUserDevicesFeature userUuid={user.uuid} />}
                            </ActionIcon.Group>
                            {user && <GetUserUsageFeature userUuid={user.uuid} />}
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
