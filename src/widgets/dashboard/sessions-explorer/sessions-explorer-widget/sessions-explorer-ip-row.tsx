import { TbClockCheck, TbClockExclamation, TbClockPause, TbExternalLink } from 'react-icons/tb'
import { ActionIcon, Box, Group, Stack, Text, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import clsx from 'clsx'

import { formatRelativeDateUtil, formatTimeUtil } from '@shared/utils/time-utils'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'

import type { AggregatedUserNode } from './use-sessions-explorer'

import styles from './sessions-explorer.module.css'

interface IProps {
    ip: AggregatedUserNode['ips'][number]
    isMatch: boolean
}

const getLastSeenIndicator = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return { color: 'var(--mantine-color-teal-6)', Icon: TbClockCheck }
    if (diffMinutes <= 60) return { color: 'var(--mantine-color-yellow-6)', Icon: TbClockPause }
    return { color: 'var(--mantine-color-red-6)', Icon: TbClockExclamation }
}

export const SessionsExplorerIpRow = memo(({ ip, isMatch }: IProps) => {
    const { t, i18n } = useTranslation()
    const { color, Icon } = getLastSeenIndicator(ip.lastSeen)

    return (
        <Box py={4}>
            <Box className={clsx(styles.ipRow, isMatch && styles.ipHighlight)}>
                <Group align="center" gap="xs" wrap="nowrap">
                    <ActionIcon
                        color="cyan"
                        component="a"
                        href={`https://ipinfo.io/${ip.ip}`}
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
                                                    ip.lastSeen,
                                                    t,
                                                    i18n.language
                                                )}
                                            </Text>
                                            <Text c="dimmed" ff="monospace" size="xs">
                                                {formatTimeUtil({
                                                    time: ip.lastSeen,
                                                    template: 'TIME_FIRST_DATETIME',
                                                    language: i18n.language
                                                })}
                                            </Text>
                                        </Stack>
                                    }
                                    radius="md"
                                >
                                    <Box style={{ display: 'flex', cursor: 'help', color }}>
                                        <Icon size={16} />
                                    </Box>
                                </Tooltip>
                            }
                            size="sm"
                            value={ip.ip}
                        />
                    </Box>
                </Group>
            </Box>
        </Box>
    )
})

SessionsExplorerIpRow.displayName = 'SessionsExplorerIpRow'
