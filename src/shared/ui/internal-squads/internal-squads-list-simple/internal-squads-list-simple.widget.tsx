import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { Stack, Text } from '@mantine/core'
import { PiEmpty } from 'react-icons/pi'
import { memo, useRef } from 'react'

import { InternalSquadCardShared } from '../internal-squad-card'
import { IProps } from './interfaces'

export const InternalSquadsListSimpleWidgetShared = memo((props: IProps) => {
    const { filteredInternalSquads } = props

    const { t } = useTranslation()

    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: filteredInternalSquads.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 10
    })

    return (
        <Stack gap="md" mt={10}>
            <div
                ref={parentRef}
                style={{
                    height:
                        filteredInternalSquads.length === 0
                            ? 100
                            : Math.min(200, filteredInternalSquads.length * 80),
                    overflow: 'auto',
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
                            key="no-squads-found"
                            style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: '40px'
                            }}
                        >
                            <Stack align="center" gap="md">
                                <PiEmpty size={48} />
                                <Text c="dimmed" size="sm" ta="center">
                                    {t('internal-squads-list.widget.no-squads-found')}
                                </Text>
                            </Stack>
                        </div>
                    )}

                    {virtualizer.getVirtualItems().map((virtualRow) => {
                        const internalSquad = filteredInternalSquads[virtualRow.index]
                        return (
                            <div
                                key={internalSquad.uuid}
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
                                <InternalSquadCardShared internalSquad={internalSquad} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Stack>
    )
})
