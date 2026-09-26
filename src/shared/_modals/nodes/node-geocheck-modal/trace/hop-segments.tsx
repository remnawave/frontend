import type { IGeocheckHop } from './trace.types'

import { Box, Stack, Text } from '@mantine/core'
import ColorHash from 'color-hash'
import { useMemo } from 'react'

import { HopRow } from './hop-row'
import { TraceLink } from './trace-link'
import classes from './Trace.module.css'
import { groupHopsByAs, isTimedOutHop } from './trace.types'

const colorHash = new ColorHash({ lightness: [0.68, 0.68, 0.68] })

const resolveAsColor = (asn: null | number): string =>
    asn === null ? 'var(--mantine-color-dark-4)' : colorHash.hex(String(asn))

interface IProps {
    hops: IGeocheckHop[]
    scale: number
}

export const HopSegments = (props: IProps) => {
    const { hops, scale } = props

    const segments = useMemo(() => groupHopsByAs(hops), [hops])

    const previousByTtl = useMemo(() => {
        const result = new Map<number, null | number>()
        let previous: null | number = null

        for (const hop of hops) {
            result.set(hop.ttl, previous)
            if (!isTimedOutHop(hop)) previous = hop.avg_ms
        }

        return result
    }, [hops])

    return (
        <Stack gap="xs">
            {segments.map((segment, index) => (
                <Box
                    className={classes.segment}
                    key={`${segment.asn}-${index}`}
                    style={{ '--as-color': resolveAsColor(segment.asn) }}
                >
                    <Text c="dimmed" mb={2} size="10px" truncate>
                        {segment.asn === null ? (
                            '—'
                        ) : (
                            <TraceLink kind="as" value={segment.asn}>
                                AS{segment.asn} · {segment.asName || '—'}
                            </TraceLink>
                        )}
                    </Text>

                    {segment.hops.map((hop) => (
                        <HopRow
                            hop={hop}
                            key={hop.ttl}
                            previousMs={previousByTtl.get(hop.ttl) ?? null}
                            scale={scale}
                        />
                    ))}
                </Box>
            ))}
        </Stack>
    )
}
