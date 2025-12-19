import { Box, Card, Stack } from '@mantine/core'
import { useState } from 'react'
import clsx from 'clsx'

import { EntityCardContext } from './entity-card.context'
import classes from './entity-card.module.css'

interface EntityCardProps {
    children: React.ReactNode
    withTopAccent?: boolean
}

export function EntityCardRoot({ children, withTopAccent = true }: EntityCardProps) {
    const [menuOpened, setMenuOpened] = useState(false)

    return (
        <EntityCardContext.Provider value={{ menuOpened, setMenuOpened }}>
            <Card className={classes.card} h="100%" p="xl" shadow="sm" withBorder>
                <Box
                    className={clsx({
                        [classes.topAccent]: withTopAccent,
                        [classes.inactiveTopAccent]: !withTopAccent
                    })}
                />

                <Box className={classes.glowEffect} />

                <Stack gap="lg" justify="space-between" style={{ flex: 1 }}>
                    {children}
                </Stack>
            </Card>
        </EntityCardContext.Provider>
    )
}
