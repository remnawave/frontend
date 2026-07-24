import {
    ActionIcon,
    Box,
    Code,
    Divider,
    Group,
    HoverCard,
    Paper,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetUserByIdCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import dayjs from 'dayjs'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { PiLinkBreak, PiLinkDuotone, PiUserCircle } from 'react-icons/pi'
import {
    TbCalendar,
    TbChartArcs,
    TbDevices,
    TbFlame,
    TbJson,
    TbQrcode,
    TbRadar,
    TbServerCog,
    TbTimeline,
    TbUser,
    TbWifi
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useGetUserMetadata } from '@shared/api/hooks'
import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { prettifyBytesUtil } from '@shared/utils/bytes'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'
import { formatRelativeDateUtil, formatTimeUtil, getTimeAgoUtil } from '@shared/utils/time-utils'

interface IProps {
    cardVariants: Variants
    lastConnectedNode?: null | { countryCode: string; name: string; uuid: string }
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    user: GetUserByIdCommand.Response['response']
}

const statusIconColorMap = {
    [USERS_STATUS.ACTIVE]: 'teal',
    [USERS_STATUS.DISABLED]: 'gray',
    [USERS_STATUS.EXPIRED]: 'red',
    [USERS_STATUS.LIMITED]: 'yellow'
} as const

const getLastSeenIndicatorColor = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return 'var(--mantine-color-teal-4)'
    if (diffMinutes <= 60) return 'var(--mantine-color-yellow-4)'
    return 'var(--mantine-color-red-4)'
}

export const UserIdentificationCard = memo((props: IProps) => {
    const { t, i18n } = useTranslation()

    const { cardVariants, lastConnectedNode, motionWrapper, user } = props

    const MotionWrapper = motionWrapper

    const { data: metadata, isLoading: isMetadataLoading } = useGetUserMetadata({
        route: { userId: user.id }
    })

    const statusIconColor = statusIconColorMap[user.status] ?? 'gray'

    const usedBytes = user.userTraffic.usedTrafficBytes
    const limitBytes = user.trafficLimitBytes
    const lifetimeBytes = user.userTraffic.lifetimeUsedTrafficBytes
    const isUnlimited = limitBytes === 0
    const percentage = isUnlimited ? 0 : Math.floor((usedBytes * 100) / limitBytes)

    const prettyUsedData = prettifyBytesUtil(usedBytes) || '0 B'
    const prettyLifetimeData = prettifyBytesUtil(lifetimeBytes) || '0 B'
    const maxData = isUnlimited ? '∞' : prettifyBytesUtil(limitBytes) || '∞'

    const getProgressColor = () => {
        if (isUnlimited) return 'teal'
        if (percentage > 95) return 'red'
        if (percentage > 80) return 'yellow.4'
        return 'teal'
    }

    const expireDate = dayjs(user.expireAt)
    const daysLeft = expireDate.diff(dayjs(), 'day')
    const isExpired = daysLeft !== null && daysLeft <= 0
    const expirationFormattedDate = expireDate?.format('DD.MM.YYYY HH:mm')

    const getExpirationStyle = () => {
        if (isExpired) {
            return {
                bg: 'rgba(239, 68, 68, 0.08)',
                border: 'rgba(239, 68, 68, 0.2)',
                color: 'red.5',
                iconColor: 'var(--mantine-color-red-5)'
            }
        }
        if (daysLeft !== null && daysLeft <= 7) {
            return {
                bg: 'rgba(251, 191, 36, 0.10)',
                border: 'rgba(251, 191, 36, 0.2)',
                color: 'yellow.4',
                iconColor: 'var(--mantine-color-yellow-4)'
            }
        }
        return {
            bg: 'rgba(45, 212, 191, 0.08)',
            border: 'rgba(45, 212, 191, 0.2)',
            color: 'teal.5',
            iconColor: 'var(--mantine-color-teal-5)'
        }
    }

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <Group align="flex-center" justify="space-between">
                        <BaseOverlayHeader
                            iconColor={statusIconColor}
                            IconComponent={TbUser}
                            iconSize={20}
                            iconVariant="soft"
                            title={user.id.toString()}
                            subtitle={user.username}
                            titleOrder={5}
                            withCopy
                        />

                        <Group gap="xs">
                            <UserStatusBadge
                                h={28}
                                key="view-user-status-badge"
                                size="lg"
                                status={user.status}
                            />
                        </Group>
                    </Group>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Group gap="xs" justify="flex-end">
                        <Group gap={5} justify="center">
                            <Tooltip label={t('view-user-modal.widget.qr-code')}>
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        showModal('users_subscriptionQrCodeModal', {
                                            subscriptionUrl: user.subscriptionUrl,
                                            username: user.username
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbQrcode size={22} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip
                                label={t('get-user-subscription-links.feature.connection-keys')}
                            >
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        showModal('users_connectionKeysDrawer', {
                                            userId: user.id,
                                            shortUuid: user.shortUuid
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <PiLinkBreak size="22px" />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Metadata">
                                <ActionIcon
                                    color="teal"
                                    disabled={!metadata}
                                    loading={isMetadataLoading}
                                    onClick={() => {
                                        if (!metadata) return
                                        modals.open({
                                            centered: true,
                                            size: 'auto',
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="teal"
                                                    IconComponent={TbJson}
                                                    iconVariant="soft"
                                                    title="Metadata"
                                                />
                                            ),
                                            children: (
                                                <Box>
                                                    <JsonEditor
                                                        collapse={3}
                                                        data={metadata.metadata as object}
                                                        indent={4}
                                                        maxWidth="100%"
                                                        rootName=""
                                                        theme={githubDarkTheme}
                                                        viewOnly
                                                    />
                                                </Box>
                                            )
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbJson size={22} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <Divider opacity={0.3} orientation="vertical" />

                        <Group gap={5} justify="center">
                            <Tooltip label={t('view-user-modal.widget.detailed-info')}>
                                <ActionIcon
                                    color="cyan"
                                    onClick={() =>
                                        showModal('users_detailedUserInfoDrawer', {
                                            userId: user.id
                                        })
                                    }
                                    size="lg"
                                    variant="soft"
                                >
                                    <PiUserCircle size={22} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('view-user-modal.widget.accessible-nodes')}>
                                <ActionIcon
                                    color="cyan"
                                    onClick={() => {
                                        showModal('users_userAccessibleNodesModal', {
                                            userId: user.id
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbServerCog size={22} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <Divider opacity={0.3} orientation="vertical" />

                        <Group gap={5} justify="center">
                            <Tooltip label={t('common.usage-stats')}>
                                <ActionIcon
                                    color="indigo"
                                    onClick={() => {
                                        showModal('users_userUsageModal', {
                                            userId: user.id
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbChartArcs size="24px" />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip
                                label={t(
                                    'get-user-torrent-blocker-reports.feature.blocker-reports'
                                )}
                            >
                                <ActionIcon
                                    color="indigo"
                                    onClick={() =>
                                        showModal('users_userTorrentBlockerReportsModal', {
                                            userId: user.id
                                        })
                                    }
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbFlame size="22px" />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip
                                label={t(
                                    'get-user-subscription-request-history.feature.request-history'
                                )}
                            >
                                <ActionIcon
                                    color="indigo"
                                    onClick={() =>
                                        showModal('users_userSubscriptionRequestsModal', {
                                            userId: user.id
                                        })
                                    }
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbTimeline size="22px" />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('get-hwid-user-devices.feature.hwid-devices')}>
                                <ActionIcon
                                    color="indigo"
                                    onClick={() => {
                                        showModal('users_userHwidDevicesModal', {
                                            userId: user.id
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbDevices size="22px" />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('common.active-sessions')}>
                                <ActionIcon
                                    color="indigo"
                                    onClick={() => {
                                        showModal('users_userActiveSessionDrawer', {
                                            userId: user.id
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <TbRadar size="22px" />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Group gap="xs" justify="space-between" mb={6}>
                        <Group gap={6}>
                            <Text c="gray.3" ff="monospace" fw={600} size="sm">
                                {prettyUsedData}
                            </Text>
                        </Group>
                        <Text c="dimmed" size="xs">
                            {maxData}
                        </Text>
                    </Group>

                    <Progress
                        color={getProgressColor()}
                        radius="sm"
                        size="sm"
                        value={isUnlimited ? 100 : percentage}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <SimpleGrid
                        cols={{
                            base: 1,
                            xs: 2,
                            sm: 2
                        }}
                        spacing="xs"
                    >
                        <Paper
                            bd={`1px solid ${getExpirationStyle().border}`}
                            bg={getExpirationStyle().bg}
                            p="xs"
                            radius="md"
                        >
                            <Tooltip label={t('create-user-modal.widget.expiry-date')}>
                                <Group gap="xs" justify="center">
                                    <TbCalendar color={getExpirationStyle().iconColor} size={18} />
                                    <Text c={getExpirationStyle().color} fw={600} size="sm">
                                        {expirationFormattedDate}
                                    </Text>
                                </Group>
                            </Tooltip>
                        </Paper>

                        <Paper
                            bd="1px solid rgba(99, 102, 241, 0.2)"
                            bg="rgba(99, 102, 241, 0.08)"
                            p="xs"
                            radius="md"
                        >
                            <Tooltip
                                label={t('detailed-user-info-drawer.widget.lifetime-used-traffic')}
                            >
                                <Group gap="xs" justify="center">
                                    <TbChartArcs color="var(--mantine-color-indigo-5)" size={18} />
                                    <Text c="indigo.5" fw={600} size="sm">
                                        {prettyLifetimeData}
                                    </Text>
                                </Group>
                            </Tooltip>
                        </Paper>

                        {user.userTraffic.onlineAt && (
                            <Paper
                                bd="1px solid rgba(139, 92, 246, 0.2)"
                                bg="rgba(139, 92, 246, 0.08)"
                                p="xs"
                                radius="md"
                            >
                                <Tooltip
                                    label={
                                        <Stack gap={2} p={4}>
                                            <Text c="white" fw={600} size="xs">
                                                {t('detailed-user-info-drawer.widget.last-online')}
                                            </Text>
                                            <Text c="white" fw={600} size="xs">
                                                {formatRelativeDateUtil(
                                                    user.userTraffic.onlineAt,
                                                    t,
                                                    i18n.language
                                                )}
                                            </Text>
                                            <Text c="dimmed" ff="monospace" size="xs">
                                                {formatTimeUtil({
                                                    time: user.userTraffic.onlineAt,
                                                    template: 'TIME_FIRST_DATETIME',
                                                    language: i18n.language
                                                })}
                                            </Text>
                                        </Stack>
                                    }
                                >
                                    <Group gap="xs" justify="center" wrap="nowrap">
                                        <TbWifi
                                            color={getLastSeenIndicatorColor(
                                                user.userTraffic.onlineAt
                                            )}
                                            size={18}
                                        />
                                        <Text c="violet.4" fw={600} size="xs" truncate>
                                            {getTimeAgoUtil(
                                                user.userTraffic.onlineAt,
                                                t,
                                                i18n.language
                                            )}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}

                        {lastConnectedNode && (
                            <Paper
                                bd="1px solid rgba(6, 182, 212, 0.2)"
                                bg="rgba(6, 182, 212, 0.08)"
                                p="xs"
                                radius="md"
                                onClick={() => {
                                    showModal('nodes_editNodeModal', {
                                        nodeUuid: lastConnectedNode.uuid
                                    })
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <Tooltip
                                    label={t(
                                        'detailed-user-info-drawer.widget.last-connected-node'
                                    )}
                                >
                                    <Group align="center" gap="xs" justify="center" wrap="nowrap">
                                        {resolveCountryCode(lastConnectedNode.countryCode, 20)}

                                        <Text c="cyan.5" fw={600} size="sm" truncate>
                                            {lastConnectedNode.name}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}
                    </SimpleGrid>
                </SectionCard.Section>

                <SectionCard.Section>
                    <CopyableFieldShared
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={500} fz="sm">
                                    {t('view-user-modal.widget.subscription-url')}
                                </Text>
                                <HoverCard shadow="md" width={280} withArrow>
                                    <HoverCard.Target>
                                        <ActionIcon color="gray" mb={2} size="xs" variant="subtle">
                                            <HiQuestionMarkCircle size={16} />
                                        </ActionIcon>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Stack gap="sm">
                                            <Text fw={600} size="sm">
                                                {t('view-user-modal.widget.subscription-url')}
                                            </Text>
                                            <Text c="dimmed" size="sm">
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-1'
                                                )}{' '}
                                                <Code bg="gray.1" c="dark.4" fw={700}>
                                                    SUB_PUBLIC_DOMAIN
                                                </Code>
                                                <br />
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-2'
                                                )}
                                            </Text>
                                            <CopyableCodeBlock value="docker compose down && docker compose up -d" />
                                        </Stack>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Group>
                        }
                        leftSection={<PiLinkDuotone size="16px" />}
                        value={user.subscriptionUrl}
                    />
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
})
