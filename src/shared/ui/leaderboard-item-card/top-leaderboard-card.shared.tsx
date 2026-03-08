import { Card, Center, ScrollArea, Skeleton, Stack, Text } from '@mantine/core'
import { PiEmpty } from 'react-icons/pi'
import { ReactNode } from 'react'

import { LeaderboardItemCardShared } from './leaderboard-item-card.shared'

export interface ITopLeaderboardItem {
    color: string
    countryCode?: string
    name: string
    total: number
    uuid?: string
}

interface IProps<T extends ITopLeaderboardItem> {
    emptyText: string
    formatValue?: (value: number) => string
    isLoading: boolean
    items: T[] | undefined
    maxHeight?: number
    onItemClick?: (item: T) => void
    renderCountryFlag?: (item: T) => ReactNode
    skeletonCount?: number
    wrapper?: (children: ReactNode) => ReactNode
}

export function TopLeaderboardCardShared<T extends ITopLeaderboardItem>(props: IProps<T>) {
    const {
        items,
        onItemClick,
        isLoading,
        emptyText,
        renderCountryFlag,
        maxHeight,
        skeletonCount = 5,
        formatValue,
        wrapper
    } = props

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
                    formatValue={formatValue}
                    key={item.name}
                    name={item.name}
                    onItemClick={onItemClick ? () => onItemClick(item) : undefined}
                    total={item.total}
                    uuid={item.uuid}
                    value={maxTraffic}
                />
            ))}
        </Stack>
    )

    const contentMinHeight = skeletonCount * 40 + (skeletonCount - 1) * 6

    const innerContent = (
        <Stack gap="sm" mih={contentMinHeight}>
            <Stack gap="sm" mih={contentMinHeight}>
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
                    <Center flex={1}>
                        <Stack align="center" gap={8}>
                            <PiEmpty size="32px" style={{ opacity: 0.5 }} />
                            <Text c="dimmed" size="sm">
                                {emptyText}
                            </Text>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Stack>
    )

    const defaultWrapper = (children: ReactNode) => (
        <Card p="md" withBorder>
            {children}
        </Card>
    )

    return wrapper ? wrapper(innerContent) : defaultWrapper(innerContent)
}
