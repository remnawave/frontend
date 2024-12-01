import { CardSection, CardSectionProps, Group, Text, Title } from '@mantine/core'
import { forwardRef, ReactNode } from 'react'

export interface CardTitleProps extends Omit<CardSectionProps, 'c' | 'fw' | 'size' | 'tt'> {
    actions?: ReactNode
    description?: string
    title: ReactNode
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
    ({ title, description, style, actions, withBorder = true, ...props }, ref) => (
        <CardSection
            inheritPadding
            py="md"
            ref={ref}
            style={{ ...style, borderTop: 'none' }}
            withBorder={withBorder}
            {...props}
        >
            <Group justify="space-between">
                <div>
                    <Title order={5}>{title}</Title>
                    {description && (
                        <Text c="dimmed" size="xs">
                            {description}
                        </Text>
                    )}
                </div>
                {actions}
            </Group>
        </CardSection>
    )
)
