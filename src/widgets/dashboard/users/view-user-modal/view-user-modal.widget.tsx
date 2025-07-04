import {
    ActionIcon,
    Anchor,
    Badge,
    Box,
    Button,
    Checkbox,
    Code,
    CopyButton,
    Divider,
    em,
    Fieldset,
    Group,
    HoverCard,
    Menu,
    Modal,
    NumberInput,
    Progress,
    Select,
    Skeleton,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title
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
import {
    TbChartLine,
    TbDevices2,
    TbDots,
    TbMail,
    TbServerCog,
    TbSettings,
    TbShield
} from 'react-icons/tb'
import { HiIdentification, HiQuestionMarkCircle } from 'react-icons/hi'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useEffect, useMemo, useState } from 'react'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { motion } from 'motion/react'
import { renderSVG } from 'uqr'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import {
    useGetInternalSquads,
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
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { resetDataStrategy } from '@shared/constants'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

import { InternalSquadsListWidget } from '../internal-squads-list'

const MotionWrapper = motion.div
const MotionStack = motion(Stack)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

export const ViewUserModal = () => {
    const { t } = useTranslation()

    const [searchQuery, setSearchQuery] = useState('')

    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const selectedUser = useUserModalStoreUserUuid()

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

    const { open: openModal, setInternalData } = useModalsStore()

    const { data: internalSquads } = useGetInternalSquads()

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
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: usersQueryKeys.getUserAccessibleNodes({
                        uuid: selectedUser ?? ''
                    }).queryKey
                })
            },

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
        if (user && internalSquads) {
            const activeInternalSquads = user.activeInternalSquads.map(
                (internalSquad) => internalSquad.uuid
            )
            form.setValues({
                uuid: user.uuid,
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
                activeInternalSquads,
                description: user.description ?? '',
                telegramId: user.telegramId ?? undefined,
                email: user.email ?? undefined,
                hwidDeviceLimit: user.hwidDeviceLimit ?? undefined,
                tag: user.tag ?? undefined
            })
        }
    }, [user, internalSquads])

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
                activeInternalSquads: dirtyFields.activeInternalSquads
                    ? values.activeInternalSquads
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
            centered
            onClose={() => actions.changeModalState(false)}
            onExitTransitionEnd={handleClose}
            opened={isViewUserModalOpen}
            size="1000px"
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
                        <Skeleton height={60} width={150} />
                        <Skeleton height={60} width={250} />
                    </Group>
                </Stack>
            ) : (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeInOut'
                    }}
                >
                    <form key="view-user-form" onSubmit={handleSubmit}>
                        <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                            <MotionStack
                                animate="visible"
                                gap="lg"
                                initial="hidden"
                                style={{ flex: '1 1 450px' }}
                                variants={containerVariants}
                            >
                                <MotionWrapper variants={cardVariants}>
                                    <Fieldset
                                        legend={
                                            <Group gap="xs" mb="xs">
                                                <HiIdentification
                                                    size={20}
                                                    style={{
                                                        color: 'var(--mantine-color-blue-4)'
                                                    }}
                                                />
                                                <Title c="blue.4" order={4}>
                                                    User Identity
                                                </Title>
                                            </Group>
                                        }
                                    >
                                        <Stack gap="md">
                                            <Group gap="xs" justify="space-between" w="100%">
                                                <Title
                                                    fw={500}
                                                    key="view-user-details-text"
                                                    order={4}
                                                >
                                                    {user.username}
                                                </Title>

                                                <UserStatusBadge
                                                    key="view-user-status-badge"
                                                    status={user.status}
                                                />
                                            </Group>

                                            <TextInput
                                                disabled
                                                label={t(
                                                    'view-user-modal.widget.subscription-short-uuid'
                                                )}
                                                leftSection={<PiLinkDuotone size="1rem" />}
                                                rightSection={
                                                    <CopyButton
                                                        timeout={2000}
                                                        value={user.shortUuid}
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
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                                value={user.shortUuid}
                                            />

                                            <TextInput
                                                disabled
                                                label={
                                                    <Group gap={4} justify="flex-start">
                                                        <Text fw={500}>
                                                            {t(
                                                                'view-user-modal.widget.subscription-url'
                                                            )}
                                                        </Text>
                                                        <HoverCard
                                                            shadow="md"
                                                            width={280}
                                                            withArrow
                                                        >
                                                            <HoverCard.Target>
                                                                <ActionIcon
                                                                    color="gray"
                                                                    size="xs"
                                                                    variant="subtle"
                                                                >
                                                                    <HiQuestionMarkCircle
                                                                        size={16}
                                                                    />
                                                                </ActionIcon>
                                                            </HoverCard.Target>
                                                            <HoverCard.Dropdown>
                                                                <Stack gap="sm">
                                                                    <Text fw={600} size="sm">
                                                                        {t(
                                                                            'view-user-modal.widget.subscription-url'
                                                                        )}
                                                                    </Text>
                                                                    <Text c="dimmed" size="sm">
                                                                        {t(
                                                                            'view-user-modal.widget.subscription-url-description-line-1'
                                                                        )}
                                                                        <Code
                                                                            bg="gray.1"
                                                                            c="dark.4"
                                                                            fw={700}
                                                                        >
                                                                            SUB_PUBLIC_DOMAIN
                                                                        </Code>
                                                                        <br />
                                                                        {t(
                                                                            'view-user-modal.widget.subscription-url-description-line-2'
                                                                        )}
                                                                    </Text>
                                                                    <Code
                                                                        bg="gray.1"
                                                                        block
                                                                        c="dark.4"
                                                                        fw={700}
                                                                    >
                                                                        docker compose down &&
                                                                        docker compose up -d
                                                                    </Code>
                                                                </Stack>
                                                            </HoverCard.Dropdown>
                                                        </HoverCard>
                                                    </Group>
                                                }
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
                                        </Stack>
                                    </Fieldset>
                                </MotionWrapper>

                                <MotionWrapper variants={cardVariants}>
                                    <Fieldset
                                        legend={
                                            <Group gap="xs" mb="xs">
                                                <TbMail
                                                    size={20}
                                                    style={{
                                                        color: 'var(--mantine-color-teal-6)'
                                                    }}
                                                />
                                                <Title c="teal.6" order={5}>
                                                    Contact Information
                                                </Title>
                                            </Group>
                                        }
                                    >
                                        <Stack gap="md">
                                            <NumberInput
                                                allowDecimal={false}
                                                allowNegative={false}
                                                hideControls
                                                key={form.key('telegramId')}
                                                label="Telegram ID"
                                                leftSection={<PiTelegramLogoDuotone size="1rem" />}
                                                placeholder="Enter user's Telegram ID (optional)"
                                                {...form.getInputProps('telegramId')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />

                                            <TextInput
                                                key={form.key('email')}
                                                label="Email"
                                                leftSection={<PiEnvelopeDuotone size="1rem" />}
                                                placeholder="Enter user's email (optional)"
                                                {...form.getInputProps('email')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />
                                        </Stack>
                                    </Fieldset>
                                </MotionWrapper>

                                <MotionWrapper variants={cardVariants}>
                                    <Fieldset
                                        legend={
                                            <Group gap="xs" mb="xs">
                                                <TbSettings
                                                    size={20}
                                                    style={{
                                                        color: 'var(--mantine-color-orange-4)'
                                                    }}
                                                />
                                                <Title c="orange.4" order={5}>
                                                    Device & Tag Settings
                                                </Title>
                                            </Group>
                                        }
                                    >
                                        <Stack gap="md">
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
                                                            checked={
                                                                form.getValues().hwidDeviceLimit ===
                                                                0
                                                            }
                                                            label={t(
                                                                'create-user-modal.widget.disable-hwid-limit'
                                                            )}
                                                            mb={'xs'}
                                                            mt={'xs'}
                                                            onChange={(event) => {
                                                                const { checked } =
                                                                    event.currentTarget
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
                                                label={t(
                                                    'create-user-modal.widget.hwid-device-limit'
                                                )}
                                                leftSection={<TbDevices2 size="1rem" />}
                                                placeholder="HWID_FALLBACK_DEVICE_LIMIT in use"
                                                {...form.getInputProps('hwidDeviceLimit')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />

                                            <CreateableTagInputShared
                                                key={form.key('tag')}
                                                {...form.getInputProps('tag')}
                                                tags={tags?.tags ?? []}
                                                value={form.getValues().tag}
                                            />

                                            <Textarea
                                                description={t(
                                                    'create-user-modal.widget.user-description'
                                                )}
                                                key={form.key('description')}
                                                label={t('use-table-columns.description')}
                                                resize="vertical"
                                                {...form.getInputProps('description')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />
                                        </Stack>
                                    </Fieldset>
                                </MotionWrapper>
                            </MotionStack>

                            <MotionStack
                                animate="visible"
                                gap="lg"
                                initial="hidden"
                                style={{ flex: '1 1 450px' }}
                                variants={containerVariants}
                            >
                                <MotionWrapper variants={cardVariants}>
                                    <Fieldset
                                        legend={
                                            <Group gap="xs" mb="xs">
                                                <TbChartLine
                                                    size={20}
                                                    style={{
                                                        color: 'var(--mantine-color-indigo-6)'
                                                    }}
                                                />
                                                <Title c="indigo.6" order={4}>
                                                    Traffic & Limits
                                                </Title>
                                                <Badge color="indigo" size="sm" variant="light">
                                                    {totalUsedTraffic === '0'
                                                        ? '0'
                                                        : totalUsedTraffic}
                                                </Badge>
                                            </Group>
                                        }
                                    >
                                        <Stack gap="md">
                                            <NumberInput
                                                allowDecimal={false}
                                                decimalScale={0}
                                                description={t(
                                                    'create-user-modal.widget.data-limit-description'
                                                )}
                                                key={form.key('trafficLimitBytes')}
                                                label={t('create-user-modal.widget.data-limit')}
                                                leftSection={
                                                    <Badge color="blue" size="xs" variant="light">
                                                        GB
                                                    </Badge>
                                                }
                                                {...form.getInputProps('trafficLimitBytes')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />

                                            <Box>
                                                <Progress
                                                    color={
                                                        usedTrafficPercentage > 100
                                                            ? 'yellow.9'
                                                            : 'teal.9'
                                                    }
                                                    size="xl"
                                                    striped
                                                    value={usedTrafficPercentage}
                                                />
                                                <Group gap="xs" justify="center" mt={2}>
                                                    <Text c="dimmed" fw={500} size="sm">
                                                        {totalUsedTraffic === '0'
                                                            ? ''
                                                            : totalUsedTraffic}
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
                                                label={t(
                                                    'create-user-modal.widget.traffic-reset-strategy'
                                                )}
                                                leftSection={<PiClockDuotone size="1rem" />}
                                                placeholder={t(
                                                    'create-user-modal.widget.pick-value'
                                                )}
                                                {...form.getInputProps('trafficLimitStrategy')}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />
                                        </Stack>
                                    </Fieldset>
                                </MotionWrapper>

                                <MotionWrapper variants={cardVariants}>
                                    <Fieldset
                                        legend={
                                            <Group gap="xs" mb="xs">
                                                <TbShield
                                                    size={20}
                                                    style={{
                                                        color: 'var(--mantine-color-purple-6)'
                                                    }}
                                                />
                                                <Title c="purple.6" order={4}>
                                                    Access Settings
                                                </Title>
                                            </Group>
                                        }
                                    >
                                        <Stack gap="md">
                                            <DateTimePicker
                                                highlightToday
                                                key={form.key('expireAt')}
                                                label={t('create-user-modal.widget.expiry-date')}
                                                minDate={new Date()}
                                                valueFormat="MMMM D, YYYY - HH:mm"
                                                {...form.getInputProps('expireAt')}
                                                description={t(
                                                    'create-user-modal.widget.expire-at-description'
                                                )}
                                                leftSection={<PiCalendarDuotone size="1rem" />}
                                                onChange={(date) => {
                                                    const formInputProps =
                                                        form.getInputProps('expireAt')
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
                                                        const currentDate =
                                                            form.values.expireAt || new Date()
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
                                                        label: t(
                                                            'create-user-modal.widget.3-months'
                                                        )
                                                    },
                                                    {
                                                        value: dayjs()
                                                            .add(1, 'year')
                                                            .format('YYYY-MM-DD HH:mm:ss'),
                                                        label: t('create-user-modal.widget.1-year')
                                                    },
                                                    {
                                                        value: dayjs()
                                                            .year(2099)
                                                            .format('YYYY-MM-DD HH:mm:ss'),
                                                        label: t(
                                                            'create-user-modal.widget.2099-year'
                                                        )
                                                    }
                                                ]}
                                                styles={{
                                                    label: { fontWeight: 500 }
                                                }}
                                            />

                                            <InternalSquadsListWidget
                                                description={t(
                                                    'create-user-modal.widget.internal-squads-description'
                                                )}
                                                filteredInternalSquads={filteredInternalSquads}
                                                formKey={form.key('activeInternalSquads')}
                                                label={t(
                                                    'create-user-modal.widget.internal-squads'
                                                )}
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                                {...form.getInputProps('activeInternalSquads')}
                                            />
                                        </Stack>
                                    </Fieldset>
                                </MotionWrapper>
                            </MotionStack>
                        </Group>

                        <Modal.Header
                            bottom={10}
                            component={'footer'}
                            h={'auto'}
                            mt="md"
                            pos={'sticky'}
                            style={{
                                bottom: 0,
                                borderTop: 'none',
                                borderBottom: 'none',
                                borderRadius: '20px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(15px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
                                padding: '10px'
                            }}
                        >
                            <Group
                                gap="md"
                                grow={!!isMobile}
                                justify="flex-end"
                                preventGrowOverflow={false}
                                w="100%"
                                wrap="wrap"
                            >
                                <Menu keepMounted={true} position="top-end" shadow="md">
                                    <Menu.Target>
                                        <Button
                                            leftSection={<TbDots size="1.2rem" />}
                                            size="sm"
                                            variant="outline"
                                        >
                                            More Actions
                                        </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>Quick Actions</Menu.Label>
                                        <Menu.Item
                                            leftSection={<PiQrCodeDuotone size={14} />}
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
                                        >
                                            {t('view-user-modal.widget.subscription-qr-code')}
                                        </Menu.Item>
                                        <GetUserSubscriptionLinksFeature
                                            shortUuid={user.shortUuid}
                                        />
                                        <GetHwidUserDevicesFeature userUuid={user.uuid} />
                                        <GetUserUsageFeature userUuid={user.uuid} />
                                        <Menu.Item
                                            leftSection={<TbServerCog size={14} />}
                                            onClick={() => {
                                                setInternalData({
                                                    internalState: {
                                                        userUuid: user.uuid
                                                    },
                                                    modalKey: MODALS.USER_ACCESSIBLE_NODES_DRAWER
                                                })
                                                openModal(MODALS.USER_ACCESSIBLE_NODES_DRAWER)
                                            }}
                                        >
                                            {t('view-user-modal.widget.view-accessible-nodes')}
                                        </Menu.Item>

                                        <Menu.Divider />
                                        <Menu.Label>Management</Menu.Label>

                                        <ResetUsageUserFeature userUuid={user.uuid} />

                                        <RevokeSubscriptionUserFeature userUuid={user.uuid} />

                                        <ToggleUserStatusButtonFeature user={user} />

                                        <Menu.Divider />
                                        <DeleteUserFeature userUuid={user.uuid} />
                                    </Menu.Dropdown>
                                </Menu>
                                <Button
                                    color="teal"
                                    leftSection={<PiFloppyDiskDuotone size="1rem" />}
                                    loading={isUpdateUserPending}
                                    size="sm"
                                    type="submit"
                                    variant="light"
                                >
                                    {t('view-user-modal.widget.edit-user')}
                                </Button>
                            </Group>
                        </Modal.Header>
                    </form>
                </motion.div>
            )}
        </Modal>
    )
}
