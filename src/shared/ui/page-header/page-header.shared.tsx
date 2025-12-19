import { ActionIcon, Box, Card, CardProps, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { forwardRef, ReactNode } from 'react'
import { useClipboard } from '@mantine/hooks'
import { motion } from 'motion/react'

import classes from './page-header.module.css'

export interface PageHeaderSharedProps extends Omit<CardProps, 'c' | 'fw' | 'size' | 'tt'> {
    actions?: ReactNode
    description?: string
    icon: ReactNode
    title: ReactNode
}

export const PageHeaderShared = forwardRef<HTMLDivElement, PageHeaderSharedProps>(
    ({ icon, title, description, actions, withBorder = true, ...props }, ref) => {
        const { copy } = useClipboard()
        const { t } = useTranslation()

        const handleCopy = () => {
            if (description) {
                copy(description)
                notifications.show({
                    message: description,
                    title: t('common.copied'),
                    color: 'teal'
                })
            }
        }

        return (
            <Card
                className={classes.card}
                mb="md"
                padding="md"
                ref={ref}
                shadow="xl"
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
                                            <Text
                                                c="dimmed"
                                                fz="sm"
                                                onClick={handleCopy}
                                                style={{ cursor: 'copy' }}
                                            >
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
            </Card>
        )
    }
)
