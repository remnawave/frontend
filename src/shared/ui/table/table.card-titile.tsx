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
            style={{
                ...style,
                borderTop: 'none',
                background: `linear-gradient(
                    135deg,
                    var(--mantine-color-dark-8) 0%,
                    var(--mantine-color-dark-7) 100%
                )`,
                boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.1),
                    0 2px 8px rgba(0, 0, 0, 0.05)
                `,
                position: 'relative',
                cursor: 'default'
            }}
            withBorder={withBorder}
            {...props}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
                    pointerEvents: 'none',
                    zIndex: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            />
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                style={{ position: 'relative', zIndex: 1 }}
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
