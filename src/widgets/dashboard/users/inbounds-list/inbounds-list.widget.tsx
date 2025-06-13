import { Checkbox, Stack, Text, TextInput } from '@mantine/core'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PiEmpty } from 'react-icons/pi'
import { memo, useRef } from 'react'

import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'
import { IProps } from './interfaces'

export const InboundsListWidget = memo((props: IProps) => {
    const {
        filteredInbounds,
        formKey,
        handleIncludedInboundsChange,
        includedInbounds,
        searchQuery,
        setSearchQuery,
        label,
        description,
        checkboxLogic,
        ...rest
    } = props

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: filteredInbounds.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 10
    })

    return (
        <Stack gap="md" mt={10}>
            <Stack gap={0}>
                <Text fw={600} size="sm">
                    {label}
                </Text>

                <Text c="dimmed" size="sm">
                    {description}
                </Text>
            </Stack>

            <TextInput
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inbounds..."
                value={searchQuery}
            />

            <Checkbox.Group
                key={formKey}
                onChange={checkboxLogic === 'exclude' ? handleIncludedInboundsChange : undefined}
                value={checkboxLogic === 'exclude' ? includedInbounds : undefined}
                {...rest}
            >
                <div
                    ref={parentRef}
                    style={{
                        height:
                            filteredInbounds.length === 0
                                ? 200
                                : Math.min(200, filteredInbounds.length * 80),
                        overflow: 'auto',
                        border: '1px solid var(--mantine-color-gray-7)',
                        borderRadius: '8px',
                        padding: '8px'
                    }}
                >
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        {virtualizer.getVirtualItems().length === 0 && (
                            <div
                                key="no-inbounds-found"
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    paddingTop: '80px'
                                }}
                            >
                                <Stack align="center" gap="md">
                                    <PiEmpty size={48} />
                                    <Text c="dimmed" size="sm" ta="center">
                                        No inbounds found
                                    </Text>
                                </Stack>
                            </div>
                        )}
                        {virtualizer.getVirtualItems().map((virtualRow) => {
                            const inbound = filteredInbounds[virtualRow.index]
                            return (
                                <div
                                    key={inbound.uuid}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        paddingBottom: '0px'
                                    }}
                                >
                                    <InboundCheckboxCardWidget
                                        inbound={inbound}
                                        key={inbound.uuid}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Checkbox.Group>
        </Stack>
    )
})
