import { Stack, Text } from '@mantine/core'

import classes from './entity-card.module.css'

interface ContentProps {
    children?: React.ReactNode
    subtitle?: string
    title: string
}

export function EntityCardContent({ children, title, subtitle }: ContentProps) {
    return (
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            <Text
                className={classes.title}
                ff="monospace"
                fw={700}
                lineClamp={1}
                size="lg"
                title={title}
            >
                {title}
            </Text>
            {subtitle && (
                <Text c="dimmed" className={classes.subtitle} lineClamp={1} size="xs">
                    {subtitle}
                </Text>
            )}
            {children}
        </Stack>
    )
}
