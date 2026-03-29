import {
    TbClockCheck,
    TbClockExclamation,
    TbClockPause,
    TbExternalLink,
    TbFingerprint,
    TbId,
    TbServer,
    TbSum
} from 'react-icons/tb'
import {
    ActionIcon,
    Badge,
    Box,
    Divider,
    Group,
    ScrollArea,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PiUserCircle } from 'react-icons/pi'
import { memo } from 'react'
import clsx from 'clsx'

import { formatRelativeDateUtil, formatTimeUtil } from '@shared/utils/time-utils'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { isPwa } from '@shared/utils/open-or-navigate'
import { SectionCard } from '@shared/ui/section-card'
import { useResolveUser } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'

import type { AggregatedUser } from './use-sessions-explorer'

import styles from './sessions-explorer.module.css'

interface IProps {
    highThreshold: number
    ipSearchQuery?: string
    midThreshold: number
    user: AggregatedUser
}

function getIpCountColor(count: number, mid: number, high: number): string {
    if (count >= high) return 'red'
    if (count >= mid) return 'yellow'
    return 'teal'
}

const getLastSeenIndicator = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return { color: 'var(--mantine-color-teal-6)', Icon: TbClockCheck }
    if (diffMinutes <= 60) return { color: 'var(--mantine-color-yellow-6)', Icon: TbClockPause }
    return { color: 'var(--mantine-color-red-6)', Icon: TbClockExclamation }
}

export const SessionsExplorerCard = memo(
    ({ user, midThreshold, highThreshold, ipSearchQuery }: IProps) => {
        const { t, i18n } = useTranslation()
        const { mutateAsync: resolveUser, isPending: isLoading } = useResolveUser()
        const navigate = useNavigate()

        const userModalActions = useUserModalStoreActions()

        const handleViewUser = async () => {
            const result = await resolveUser({
                variables: {
                    id: Number(user.userId)
                }
            })

            if (result.uuid) {
                if (isPwa()) {
                    const searchParams = createSearchParams({
                        [SEARCH_PARAMS.USER]: String(result.uuid)
                    })

                    navigate(`${ROUTES.DASHBOARD.MANAGEMENT.USERS}?${searchParams.toString()}`)
                }
                await userModalActions.setUserUuid(result.uuid)
                userModalActions.changeModalState(true)
            }
        }

        return (
            <SectionCard.Root dividerOpacity={0} gap="xs">
                <SectionCard.Section>
                    <Group gap="xs" justify="space-between" wrap="nowrap">
                        <BaseOverlayHeader
                            hideIcon
                            icon={
                                <Tooltip label={t('node-active-session.item.widget.view-user')}>
                                    <ActionIcon
                                        color="cyan"
                                        loading={isLoading}
                                        onClick={handleViewUser}
                                        size="lg"
                                        variant="soft"
                                    >
                                        <PiUserCircle size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            }
                            IconComponent={TbId}
                            iconVariant="soft"
                            title={user.userId}
                            titleOrder={5}
                            truncateTitle
                        />

                        <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                            <Tooltip label={t('sessions-explorer.widget.unique-ips')}>
                                <Badge
                                    color={getIpCountColor(
                                        user.uniqueIps,
                                        midThreshold,
                                        highThreshold
                                    )}
                                    leftSection={<TbFingerprint size={16} />}
                                    size="lg"
                                    variant="soft"
                                >
                                    {user.uniqueIps}
                                </Badge>
                            </Tooltip>

                            <Tooltip label={t('sessions-explorer.widget.total-ips')}>
                                <Badge
                                    leftSection={<TbSum size={16} />}
                                    size="lg"
                                    variant="default"
                                >
                                    {user.totalIps}
                                </Badge>
                            </Tooltip>
                        </Group>
                    </Group>
                </SectionCard.Section>

                <ScrollArea.Autosize mah={400} mih={400}>
                    {user.nodes.map((nodeData) => (
                        <SectionCard.Root
                            dividerOpacity={0}
                            gap={4}
                            key={nodeData.nodeUuid}
                            mb="xs"
                        >
                            <SectionCard.Section>
                                <Group justify="space-between">
                                    <BaseOverlayHeader
                                        countryCode={nodeData.countryCode}
                                        hideIcon={true}
                                        iconColor="blue"
                                        IconComponent={TbServer}
                                        iconVariant="soft"
                                        title={nodeData.nodeName}
                                        titleOrder={6}
                                    />

                                    <Badge color="teal" size="lg" variant="default">
                                        {nodeData.ips.length}
                                    </Badge>
                                </Group>
                            </SectionCard.Section>

                            <Divider opacity={0.3} />

                            {nodeData.ips.map((item) => {
                                const isMatch = !!ipSearchQuery && item.ip.includes(ipSearchQuery)

                                return (
                                    <SectionCard.Section
                                        className={clsx(isMatch && styles.ipHighlight)}
                                        key={`${nodeData.nodeUuid}-${item.ip}`}
                                    >
                                        <Group align="center" gap="xs" wrap="nowrap">
                                            <ActionIcon
                                                color="cyan"
                                                component="a"
                                                href={`https://ipinfo.io/${item.ip}`}
                                                rel="noopener noreferrer"
                                                size="input-sm"
                                                target="_blank"
                                                variant="soft"
                                            >
                                                <TbExternalLink size={18} />
                                            </ActionIcon>

                                            <Box style={{ flex: 1 }}>
                                                <CopyableFieldShared
                                                    leftSection={
                                                        <Tooltip
                                                            label={
                                                                <Stack gap={2} p={4}>
                                                                    <Text
                                                                        c="white"
                                                                        fw={600}
                                                                        size="xs"
                                                                    >
                                                                        {formatRelativeDateUtil(
                                                                            item.lastSeen,
                                                                            t,
                                                                            i18n.language
                                                                        )}
                                                                    </Text>
                                                                    <Text
                                                                        c="dimmed"
                                                                        ff="monospace"
                                                                        size="xs"
                                                                    >
                                                                        {formatTimeUtil({
                                                                            time: item.lastSeen,
                                                                            template:
                                                                                'TIME_FIRST_DATETIME',
                                                                            language: i18n.language
                                                                        })}
                                                                    </Text>
                                                                </Stack>
                                                            }
                                                            radius="md"
                                                        >
                                                            {(() => {
                                                                const { color, Icon } =
                                                                    getLastSeenIndicator(
                                                                        item.lastSeen
                                                                    )
                                                                return (
                                                                    <Box
                                                                        style={{
                                                                            display: 'flex',
                                                                            cursor: 'help',
                                                                            color
                                                                        }}
                                                                    >
                                                                        <Icon size={16} />
                                                                    </Box>
                                                                )
                                                            })()}
                                                        </Tooltip>
                                                    }
                                                    size="sm"
                                                    value={item.ip}
                                                />
                                            </Box>
                                        </Group>
                                    </SectionCard.Section>
                                )
                            })}
                        </SectionCard.Root>
                    ))}
                </ScrollArea.Autosize>
            </SectionCard.Root>
        )
    }
)
