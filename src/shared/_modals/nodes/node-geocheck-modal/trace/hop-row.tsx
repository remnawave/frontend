import type { IGeocheckHop } from './trace.types'

import { Box, Text } from '@mantine/core'

import { TraceLink } from './trace-link'
import classes from './Trace.module.css'
import { isTimedOutHop } from './trace.types'

const JUMP_THRESHOLD_MS = 20

const formatMs = (value: number): string => (value >= 100 ? value.toFixed(0) : value.toFixed(2))

const formatLoss = (loss: number): string => `${Math.round(loss * 100)}%`

interface IProps {
    hop: IGeocheckHop
    previousMs: null | number
    scale: number
}

export const HopRow = (props: IProps) => {
    const { hop, previousMs, scale } = props

    const isTimedOut = isTimedOutHop(hop)
    const delta = previousMs === null ? null : hop.avg_ms - previousMs
    const hasJump = !isTimedOut && delta !== null && delta >= JUMP_THRESHOLD_MS

    return (
        <Box className={classes.hopRow} data-timeout={isTimedOut || undefined}>
            <Text c="dimmed" ff="monospace" size="11px" ta="right">
                {hop.ttl}
            </Text>

            <Box miw={0}>
                <Text ff="monospace" size="12px" truncate>
                    {hop.addr ? (
                        <TraceLink kind="ip" value={hop.addr}>
                            {hop.addr}
                        </TraceLink>
                    ) : (
                        '* * *'
                    )}
                </Text>
                {hop.host && (
                    <Text c="dimmed" size="10px" truncate>
                        {hop.host}
                    </Text>
                )}
            </Box>

            <Box className={classes.hopBarTrack}>
                <Box
                    className={classes.hopBarFill}
                    style={{
                        width: `${Math.min(100, (hop.avg_ms / scale) * 100)}%`,
                        ...(hasJump && { '--bar-color': 'var(--mantine-color-orange-5)' })
                    }}
                />
            </Box>

            <Text c={hasJump ? 'orange' : undefined} ff="monospace" size="11px" ta="right">
                {isTimedOut ? '—' : `${formatMs(hop.avg_ms)} ms`}
                {hasJump && delta !== null && (
                    <Text c="orange" component="span" size="10px">
                        {' '}
                        +{formatMs(delta)}
                    </Text>
                )}
            </Text>

            <Text
                c={hop.loss > 0 ? 'yellow' : 'dimmed'}
                ff="monospace"
                size="11px"
                ta="right"
                title={`${hop.recv}/${hop.sent}`}
            >
                {formatLoss(hop.loss)}
            </Text>
        </Box>
    )
}
