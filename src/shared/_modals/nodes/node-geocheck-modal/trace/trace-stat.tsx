import { Stack, Text } from '@mantine/core'

import classes from './Trace.module.css'

interface IProps {
    color?: string
    label: string
    value: string
}

export const TraceStat = (props: IProps) => {
    const { color, label, value } = props

    return (
        <Stack gap={2}>
            <span className={classes.microLabel}>{label}</span>
            <Text c={color} ff="monospace" fw={600} lh={1} size="sm">
                {value}
            </Text>
        </Stack>
    )
}
