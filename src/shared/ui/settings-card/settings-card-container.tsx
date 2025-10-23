import { Card, CardProps, Flex } from '@mantine/core'

type SettingsCardContainerProps = CardProps

export function SettingsCardContainer({ children, ...props }: SettingsCardContainerProps) {
    return (
        <Card
            padding="md"
            shadow="xl"
            style={{
                background:
                    'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
            }}
            withBorder
            {...props}
        >
            <Flex direction="column" gap="lg">
                {children}
            </Flex>
        </Card>
    )
}
