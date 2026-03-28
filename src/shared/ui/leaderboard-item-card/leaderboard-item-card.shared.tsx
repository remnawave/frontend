import { Box, Group, Text } from '@mantine/core'
import { ReactNode } from 'react'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import styles from './leaderboard-item-card.module.css'

interface IProps {
    color: string
    countryFlag?: ReactNode
    formatValue?: (value: number) => string
    name: string
    onItemClick?: () => void
    total: number
    uuid?: string
    value: number
}

export const LeaderboardItemCardShared = (props: IProps) => {
    const { color, countryFlag, formatValue, value, name, total, uuid, onItemClick } = props

    const width = (total / value) * 100

    return (
        <Box
            bdrs="sm"
            bg="var(--mantine-color-default-hover)"
            className={`${styles.item} ${onItemClick ? styles.clickable : ''}`}
            key={uuid ?? name}
            onClick={onItemClick}
            p="xs"
            pos="relative"
        >
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
                    {formatValue ? formatValue(total) : prettyBytesToAnyUtil(total)}
                </Text>
            </Group>
        </Box>
    )
}
