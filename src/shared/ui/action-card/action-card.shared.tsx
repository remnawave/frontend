import { Group, Paper, Stack, Text, ThemeIcon, ThemeIconProps, UnstyledButton } from '@mantine/core'
import { TbChevronRight } from 'react-icons/tb'
import clsx from 'clsx'

import styles from './action-card.module.css'

interface IProps {
    description: string
    icon: React.ReactNode
    isLoading?: boolean
    onClick: () => void
    title: string
    variant: ThemeIconProps['variant']
}

export function ActionCardShared(props: IProps) {
    const { description, icon, isLoading, onClick, title, variant } = props

    return (
        <UnstyledButton disabled={isLoading} onClick={onClick} w="100%">
            <Paper
                className={clsx(styles.card, isLoading && styles.loading)}
                p="md"
                radius="md"
                withBorder
            >
                <Group gap="md" justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap">
                        <ThemeIcon radius="md" size="xl" variant={variant}>
                            {icon}
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text fw={600} size="sm">
                                {title}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {description}
                            </Text>
                        </Stack>
                    </Group>
                    <TbChevronRight color="var(--mantine-color-dimmed)" size={20} />
                </Group>
            </Paper>
        </UnstyledButton>
    )
}
