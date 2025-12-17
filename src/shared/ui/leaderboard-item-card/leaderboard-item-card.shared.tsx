import { Box, Group, Text } from '@mantine/core'
import { ReactNode } from 'react'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import styles from './leaderboard-item-card.module.css'

interface IProps {
    color: string
    countryFlag?: ReactNode
    maxTraffic: number
    name: string
    total: number
}

export const LeaderboardItemCardShared = (props: IProps) => {
    const { color, countryFlag, maxTraffic, name, total } = props

    const width = (total / maxTraffic) * 100

    return (
        <Box bdrs="sm" bg="var(--mantine-color-default-hover)" key={name} p="xs" pos="relative">
            <Box
                bdrs="sm"
                className={styles.itemBackground}
                style={{
                    width: `${width}%`,
                    background: color
                }}
            />
            <Group gap={10} justify="space-between" style={{ position: 'relative' }} wrap="nowrap">
                <Group gap={10} wrap="nowrap">
                    <Box
                        h={8}
                        style={{
                            background: color,
                            borderRadius: '50%',
                            flexShrink: 0
                        }}
                        w={8}
                    />
                    {countryFlag}
                    <Text fw={600} size="sm" truncate>
                        {name}
                    </Text>
                </Group>
                <Text fw={600} size="sm" style={{ flexShrink: 0 }}>
                    {prettyBytesToAnyUtil(total)}
                </Text>
            </Group>
        </Box>
    )
}
