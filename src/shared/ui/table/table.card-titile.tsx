import {
    ActionIcon,
    Box,
    CardSection,
    CardSectionProps,
    Group,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { forwardRef, ReactNode } from 'react'
import { motion } from 'motion/react'

import classes from './table.module.css'

export interface CardTitleProps extends Omit<CardSectionProps, 'c' | 'fw' | 'size' | 'tt'> {
    actions?: ReactNode
    description?: string
    icon: ReactNode
    title: ReactNode
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
    ({ title, description, style, actions, withBorder = true, icon, ...props }, ref) => (
        <CardSection
            className={classes.card}
            inheritPadding
            py="md"
            ref={ref}
            style={{
                ...style
            }}
            withBorder={withBorder}
            {...props}
        >
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -10 }}
                style={{ position: 'relative', zIndex: 1 }}
                transition={{ duration: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
            >
                <Box className={classes.headerWrapper}>
                    <Box className={classes.contentSection}>
                        <Group align="center" gap="md" wrap="nowrap">
                            <motion.div
                                animate={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: -10 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0, 0.71, 0.2, 1.01]
                                }}
                            >
                                <ActionIcon
                                    className={classes.actionIcon}
                                    color="cyan"
                                    size="input-md"
                                    variant="light"
                                >
                                    {icon}
                                </ActionIcon>
                            </motion.div>

                            <Stack gap={0}>
                                <motion.div
                                    animate={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0, 0.71, 0.2, 1.01]
                                    }}
                                >
                                    <Title order={4} pt={0}>
                                        {title}
                                    </Title>
                                </motion.div>
                                {description && (
                                    <motion.div
                                        animate={{ opacity: 1, y: 0 }}
                                        initial={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0, 0.71, 0.2, 1.01]
                                        }}
                                    >
                                        <Text c="dimmed" fz="sm">
                                            {description}
                                        </Text>
                                    </motion.div>
                                )}
                            </Stack>
                        </Group>
                    </Box>

                    {actions && (
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className={classes.actionsSection}
                            initial={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.5,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}
                        >
                            <Group align="flex-end" gap="sm" wrap="nowrap">
                                {actions}
                            </Group>
                        </motion.div>
                    )}
                </Box>
            </motion.div>
        </CardSection>
    )
)
