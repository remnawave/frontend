import {
    ActionIcon,
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
import { TbCalendar, TbChartArcs, TbServerCog, TbUser, TbWifi } from 'react-icons/tb'
import { GetUserByUuidCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { PiLinkDuotone, PiQrCode, PiUserCircle } from 'react-icons/pi'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'
import { memo } from 'react'
import dayjs from 'dayjs'

import { GetUserSubscriptionRequestHistoryFeature } from '@features/ui/dashboard/users/get-user-subscription-request-history'
import { GetUserTorrentBlockerReportsFeature } from '@features/ui/dashboard/users/get-user-torrent-blocker-reports'
import { GetUserSubscriptionLinksFeature } from '@features/ui/dashboard/users/get-user-subscription-links'
import { GetUserActiveSessionsFeature } from '@features/ui/dashboard/users/get-user-active-sessions'
import { formatRelativeDateUtil, formatTimeUtil, getTimeAgoUtil } from '@shared/utils/time-utils'
import { GetHwidUserDevicesFeature } from '@features/ui/dashboard/users/get-hwid-user-devices'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { GetUserUsageFeature } from '@features/ui/dashboard/users/get-user-usage'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'
import { prettyBytesUtil } from '@shared/utils/bytes'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    cardVariants: Variants
    lastConnectedNode?: null | { countryCode: string; name: string }
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    user: GetUserByUuidCommand.Response['response']
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

    const [trafficStatisticsModalOpened, trafficStatisticsModalHandlers] = useDisclosure(false)

    const MotionWrapper = motionWrapper

    const actions = useUserModalStoreActions()
    const openModalWithData = useModalsStoreOpenWithData()

    const statusIconColor = statusIconColorMap[user.status] ?? 'gray'

    const usedBytes = user.userTraffic.usedTrafficBytes
    const limitBytes = user.trafficLimitBytes
    const lifetimeBytes = user.userTraffic.lifetimeUsedTrafficBytes
    const isUnlimited = limitBytes === 0
    const percentage = isUnlimited ? 0 : Math.floor((usedBytes * 100) / limitBytes)

    const prettyUsedData = prettyBytesUtil(usedBytes) || '0 B'
    const prettyLifetimeData = prettyBytesUtil(lifetimeBytes) || '0 B'
    const maxData = isUnlimited ? '∞' : prettyBytesUtil(limitBytes) || '∞'

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
                            subtitle={user.id.toString()}
                            title={user.username}
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
                                        const subscriptionQrCode = renderSVG(user.subscriptionUrl, {
                                            whiteColor: '#161B22',
                                            blackColor: '#3CC9DB'
                                        })
                                        modals.open({
                                            centered: true,
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="teal"
                                                    IconComponent={PiQrCode}
                                                    iconVariant="soft"
                                                    title={t(
                                                        'view-user-modal.widget.subscription-qr-code'
                                                    )}
                                                />
                                            ),
                                            children: (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: subscriptionQrCode
                                                    }}
                                                />
                                            )
                                        })
                                    }}
                                    size="lg"
                                    variant="soft"
                                >
                                    <PiQrCode size={22} />
                                </ActionIcon>
                            </Tooltip>

                            <GetUserSubscriptionLinksFeature uuid={user.uuid} />
                        </Group>

                        <Divider opacity={0.3} orientation="vertical" />

                        <Group gap={5} justify="center">
                            <Tooltip label={t('view-user-modal.widget.detailed-info')}>
                                <ActionIcon
                                    color="cyan"
                                    onClick={async () => {
                                        await actions.setDrawerUserUuid(user.uuid)
                                        actions.changeDetailedUserInfoDrawerState(true)
                                    }}
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
                                        openModalWithData(MODALS.USER_ACCESSIBLE_NODES_DRAWER, {
                                            userUuid: user.uuid
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
                            <GetUserUsageFeature
                                onClose={trafficStatisticsModalHandlers.close}
                                onOpen={trafficStatisticsModalHandlers.open}
                                opened={trafficStatisticsModalOpened}
                                userUuid={user.uuid}
                            />
                            <GetUserTorrentBlockerReportsFeature userUuid={user.uuid} />
                            <GetUserSubscriptionRequestHistoryFeature userUuid={user.uuid} />
                            <GetHwidUserDevicesFeature userUuid={user.uuid} />
                            <GetUserActiveSessionsFeature userUuid={user.uuid} />
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
