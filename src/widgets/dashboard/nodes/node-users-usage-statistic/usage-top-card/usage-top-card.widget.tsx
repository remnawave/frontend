import { Box, Card, Center, Group, ScrollArea, Skeleton, Stack, Text } from '@mantine/core'
import { GetStatsNodeUsersUsageCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import styles from './usage-top-card.module.css'

interface IProps {
    isLoading: boolean
    topUsers: GetStatsNodeUsersUsageCommand.Response['response']['topUsers'] | undefined
}

export const NodeUsersTopCardWidget = (props: IProps) => {
    const { topUsers, isLoading } = props

    const { t } = useTranslation()

    let maxTraffic = 1
    if (topUsers && topUsers.length > 0) {
        maxTraffic = topUsers[0].total
    }

    return (
        <Card p="md" withBorder>
            <Stack gap="sm">
                {isLoading && (
                    <Stack gap={6}>
                        {Array.from({ length: 25 }, (_, i) => (
                            <Skeleton height={40} key={i} />
                        ))}
                    </Stack>
                )}
                {!isLoading && topUsers && topUsers.length > 0 && (
                    <ScrollArea h={500} type="always">
                        <Stack gap={6}>
                            {topUsers.map((user, index) => {
                                return (
                                    <Box
                                        bdrs="sm"
                                        bg="var(--mantine-color-default-hover)"
                                        key={user.username}
                                        p="xs"
                                        pos="relative"
                                    >
                                        <Box
                                            bdrs="sm"
                                            className={styles.itemBackground}
                                            style={{
                                                width: `${(user.total / maxTraffic) * 100}%`,
                                                background: user.color
                                            }}
                                        />
                                        <Group
                                            gap={10}
                                            justify="space-between"
                                            style={{ position: 'relative' }}
                                            wrap="nowrap"
                                        >
                                            <Group gap={10} wrap="nowrap">
                                                <Box
                                                    h={8}
                                                    style={{
                                                        background: user.color,
                                                        borderRadius: '50%',
                                                        flexShrink: 0
                                                    }}
                                                    w={8}
                                                />
                                                <Text
                                                    fw={index === 0 ? 600 : 400}
                                                    size="sm"
                                                    truncate
                                                >
                                                    {user.username}
                                                </Text>
                                            </Group>
                                            <Text fw={600} size="sm" style={{ flexShrink: 0 }}>
                                                {prettyBytesToAnyUtil(user.total)}
                                            </Text>
                                        </Group>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </ScrollArea>
                )}
                {!isLoading && topUsers && topUsers.length === 0 && (
                    <Center h={200}>
                        <Stack align="center" gap={8}>
                            <PiEmpty size="32px" style={{ opacity: 0.5 }} />
                            <Text c="dimmed" size="sm">
                                {t('node-users-usage-drawer.widget.no-data-available')}
                            </Text>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Card>
    )
}
