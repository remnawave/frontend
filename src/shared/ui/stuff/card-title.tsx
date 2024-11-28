import { forwardRef, ReactNode } from 'react'

import { CardSection, CardSectionProps, Group, Text, Title } from '@mantine/core'

export interface CardTitleProps extends Omit<CardSectionProps, 'size' | 'c' | 'fw' | 'tt'> {
    title: ReactNode
    description?: string
    actions?: ReactNode
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
    ({ title, description, style, actions, withBorder = true, ...props }, ref) => (
        <CardSection
            ref={ref}
            py="md"
            withBorder={withBorder}
            inheritPadding
            style={{ ...style, borderTop: 'none' }}
            {...props}
        >
            <Group justify="space-between">
                <div>
                    <Title order={5}>{title}</Title>
                    {description && (
                        <Text size="xs" c="dimmed">
                            {description}
                        </Text>
                    )}
                </div>
                {actions}
            </Group>
        </CardSection>
    )
)
