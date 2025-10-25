import { Card, CardProps, Flex } from '@mantine/core'

import classes from './settings-card.module.css'

type SettingsCardContainerProps = CardProps

export function SettingsCardContainer({ children, ...props }: SettingsCardContainerProps) {
    return (
        <Card className={classes.container} padding="md" shadow="xl" withBorder {...props}>
            <Flex direction="column" gap="xs">
                {children}
            </Flex>
        </Card>
    )
}
