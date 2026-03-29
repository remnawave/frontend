import {
    TbClockCheck,
    TbClockExclamation,
    TbClockPause,
    TbExternalLink,
    TbId
} from 'react-icons/tb'
import { ActionIcon, Badge, Box, Group, Stack, Text, Tooltip } from '@mantine/core'
import { FetchUsersIpsResultCommand } from '@remnawave/backend-contract'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { PiEmptyDuotone, PiUserCircle } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { formatRelativeDateUtil, formatTimeUtil } from '@shared/utils/time-utils'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { openOrNavigate } from '@shared/utils/open-or-navigate'
import { SectionCard } from '@shared/ui/section-card'
import { useResolveUser } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'

interface IProps {
    user: NonNullable<FetchUsersIpsResultCommand.Response['response']['result']>['users'][number]
}

const getLastSeenIndicator = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return { color: 'var(--mantine-color-teal-6)', Icon: TbClockCheck }
    if (diffMinutes <= 60) return { color: 'var(--mantine-color-yellow-6)', Icon: TbClockPause }
    return { color: 'var(--mantine-color-red-6)', Icon: TbClockExclamation }
}

export const NodeActiveSessionItem = (props: IProps) => {
    const { user } = props

    const { t, i18n } = useTranslation()

    const navigate = useNavigate()
    const { mutateAsync: resolveUser, isPending: isLoading } = useResolveUser()

    const handleViewUser = async () => {
        const result = await resolveUser({
            variables: {
                id: Number(user.userId)
            }
        })

        if (result.uuid) {
            const searchParams = createSearchParams({
                [SEARCH_PARAMS.USER]: String(result.uuid)
            })

            const url = `${ROUTES.DASHBOARD.MANAGEMENT.USERS}?${searchParams.toString()}`
            openOrNavigate(url, navigate)
        }
    }

    return (
        <SectionCard.Root gap="sm" key={user.userId}>
            <SectionCard.Section>
                <Group gap="xs" justify="space-between">
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
                        iconColor="blue"
                        IconComponent={TbId}
                        iconVariant="soft"
                        title={user.userId}
                    />

                    <Group gap="xs">
                        <Badge color="teal" size="lg" variant="default">
                            {user.ips.length}
                        </Badge>
                    </Group>
                </Group>
            </SectionCard.Section>

            {user.ips.length === 0 && (
                <Stack align="center" gap="xs">
                    <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                    <Text c="dimmed" size="sm">
                        {t('common.nothing-found')}
                    </Text>
                </Stack>
            )}

            {user.ips.length > 0 &&
                user.ips.map((item) => (
                    <Group align="center" gap="xs" key={item.ip} wrap="nowrap">
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
                                                <Text c="white" fw={600} size="xs">
                                                    {formatRelativeDateUtil(
                                                        item.lastSeen,
                                                        t,
                                                        i18n.language
                                                    )}
                                                </Text>
                                                <Text c="dimmed" ff="monospace" size="xs">
                                                    {formatTimeUtil({
                                                        time: item.lastSeen,
                                                        template: 'TIME_FIRST_DATETIME',
                                                        language: i18n.language
                                                    })}
                                                </Text>
                                            </Stack>
                                        }
                                        radius="md"
                                    >
                                        {(() => {
                                            const { color, Icon } = getLastSeenIndicator(
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
                ))}
        </SectionCard.Root>
    )
}
