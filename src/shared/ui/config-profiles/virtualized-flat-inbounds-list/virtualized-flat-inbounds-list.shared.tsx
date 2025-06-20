import { Box, Center, Checkbox, Text } from '@mantine/core'
import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useEffect, useMemo, useRef } from 'react'

import type { IProps } from './interfaces/props.interface'

import { FlatInboundCheckboxCardShared } from '../flat-inbound-checkbox-card/flat-inbound-checkbox-card.shared'

const INBOUND_HEIGHT = 60

export const VirtualizedFlatInboundsListShared = memo((props: IProps) => {
    const { allInbounds, selectedInbounds, onInboundToggle, filterType } = props

    const filteredInbounds = useMemo(() => {
        switch (filterType) {
            case 'selected':
                return allInbounds.filter(({ inbound }) => selectedInbounds.has(inbound.uuid))
            case 'unselected':
                return allInbounds.filter(({ inbound }) => !selectedInbounds.has(inbound.uuid))
            default:
                return allInbounds
        }
    }, [allInbounds, selectedInbounds, filterType])

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: filteredInbounds.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => INBOUND_HEIGHT,
        overscan: 5
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            virtualizer.measure()
        }, 0)
        return () => clearTimeout(timer)
    }, [virtualizer])

    if (filteredInbounds.length === 0) {
        return (
            <Center h="100%">
                <Text c="dimmed" size="sm" ta="center">
                    No inbounds found
                </Text>
            </Center>
        )
    }

    return (
        <Box
            ref={parentRef}
            style={{
                height: '500px',
                overflow: 'auto',
                border: '1px solid var(--mantine-color-gray-7)',
                borderRadius: '8px',
                padding: '8px'
            }}
        >
            <Box
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative'
                }}
            >
                <Checkbox.Group>
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const { inbound, profileName } = filteredInbounds[virtualItem.index]
                        const isSelected = selectedInbounds.has(inbound.uuid)

                        return (
                            <div
                                key={inbound.uuid}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                    paddingBottom: '4px'
                                }}
                            >
                                <FlatInboundCheckboxCardShared
                                    inbound={inbound}
                                    isSelected={isSelected}
                                    onInboundToggle={onInboundToggle}
                                    profileName={profileName}
                                />
                            </div>
                        )
                    })}
                </Checkbox.Group>
            </Box>
        </Box>
    )
})

VirtualizedFlatInboundsListShared.displayName = 'VirtualizedFlatInboundsListShared'
