import { useVirtualizer } from '@tanstack/react-virtual'
import { Box, Checkbox } from '@mantine/core'
import { memo, useRef } from 'react'

import type { IProps } from './interfaces/props.interface'

import { InboundCheckboxCardShared } from '../inbound-checkbox-card/inbound-checkbox-card.shared'

const INBOUND_HEIGHT = 60
const MAX_VISIBLE_INBOUNDS = 6

export const VirtualizedInboundsListShared = memo((props: IProps) => {
    const { profile, selectedInbounds, onInboundToggle } = props

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: profile.inbounds.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => INBOUND_HEIGHT,
        overscan: 2
    })

    const containerHeight = Math.min(profile.inbounds.length, MAX_VISIBLE_INBOUNDS) * INBOUND_HEIGHT

    return (
        <Box
            ref={parentRef}
            style={{
                height: `${containerHeight}px`,
                overflow: 'auto'
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
                        const inbound = profile.inbounds[virtualItem.index]
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
                                    paddingBottom: '0px',
                                    cursor: 'pointer'
                                }}
                            >
                                <InboundCheckboxCardShared
                                    inbound={inbound}
                                    isSelected={isSelected}
                                    key={inbound.uuid}
                                    onInboundToggle={onInboundToggle}
                                />
                            </div>
                        )
                    })}
                </Checkbox.Group>
            </Box>
        </Box>
    )
})

VirtualizedInboundsListShared.displayName = 'VirtualizedInboundsListShared'
