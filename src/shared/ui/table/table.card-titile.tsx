import { CardSection, CardSectionProps, Group, Text, Title } from '@mantine/core'
import { forwardRef, ReactNode } from 'react'
import { motion } from 'motion/react'

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
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
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
            </motion.div>
        </CardSection>
    )
)
