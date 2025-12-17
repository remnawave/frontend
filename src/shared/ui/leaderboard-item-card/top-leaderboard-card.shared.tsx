import { Card, Center, ScrollArea, Skeleton, Stack, Text } from '@mantine/core'
import { PiEmpty } from 'react-icons/pi'
import { ReactNode } from 'react'

import { LeaderboardItemCardShared } from './leaderboard-item-card.shared'

export interface ITopLeaderboardItem {
    color: string
    countryCode?: string
    name: string
    total: number
}

interface IProps<T extends ITopLeaderboardItem> {
    emptyText: string
    isLoading: boolean
    items: T[] | undefined
    maxHeight?: number
    renderCountryFlag?: (item: T) => ReactNode
    skeletonCount?: number
}

export function TopLeaderboardCardShared<T extends ITopLeaderboardItem>(props: IProps<T>) {
    const { items, isLoading, emptyText, renderCountryFlag, maxHeight, skeletonCount = 5 } = props

    let maxTraffic = 1
    if (items && items.length > 0) {
        maxTraffic = items[0].total
    }

    const content = (
        <Stack gap={6}>
            {items?.map((item) => (
                <LeaderboardItemCardShared
                    color={item.color}
                    countryFlag={renderCountryFlag?.(item)}
                    key={item.name}
                    maxTraffic={maxTraffic}
                    name={item.name}
                    total={item.total}
                />
            ))}
        </Stack>
    )

    return (
        <Card p="md" withBorder>
            <Stack gap="sm">
                {isLoading && (
                    <Stack gap={6}>
                        {Array.from({ length: skeletonCount }, (_, i) => (
                            <Skeleton height={40} key={i} />
                        ))}
                    </Stack>
                )}

                {!isLoading && items && items.length > 0 && (
                    <>
                        {maxHeight ? (
                            <ScrollArea.Autosize
                                mah={maxHeight}
                                styles={{ scrollbar: { width: '10px' } }}
                                type="hover"
                            >
                                {content}
                            </ScrollArea.Autosize>
                        ) : (
                            content
                        )}
                    </>
                )}

                {!isLoading && items && items.length === 0 && (
                    <Center h={200}>
                        <Stack align="center" gap={8}>
                            <PiEmpty size="32px" style={{ opacity: 0.5 }} />
                            <Text c="dimmed" size="sm">
                                {emptyText}
                            </Text>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Card>
    )
}
