import type { IGeocheckTarget } from './trace.types'

import { Badge, Box, Group, Text, UnstyledButton } from '@mantine/core'

import classes from './Trace.module.css'
import { resolveVerdictColor } from './trace.types'

const formatMs = (value: number): string => (value >= 100 ? value.toFixed(0) : value.toFixed(2))

interface IProps {
    onSelect: (targetId: string) => void
    selectedId: string | undefined
    targets: IGeocheckTarget[]
}

export const TargetList = (props: IProps) => {
    const { onSelect, selectedId, targets } = props

    return (
        <Box className={classes.targets}>
            {targets.map((target) => (
                <UnstyledButton
                    className={classes.targetRow}
                    data-active={target.id === selectedId || undefined}
                    key={target.id}
                    onClick={() => onSelect(target.id)}
                >
                    <Group gap={6} wrap="nowrap">
                        <Badge
                            color={resolveVerdictColor(target.verdict)}
                            h={6}
                            p={0}
                            radius="sm"
                            size="xs"
                            variant="filled"
                            w={6}
                        />
                        <Text fw={500} miw={0} size="xs" truncate>
                            {target.name}
                        </Text>
                        <Text c="dimmed" ff="monospace" ml="auto" size="10px">
                            {formatMs(target.rtt_ms)} ms
                        </Text>
                    </Group>

                    <Text c="dimmed" pl={12} size="10px" truncate>
                        {target.verdict}
                        {target.transits && target.transits.length > 0
                            ? ` · ${target.transits.map((transit) => transit.name).join(', ')}`
                            : ''}
                    </Text>
                </UnstyledButton>
            ))}
        </Box>
    )
}
