import { IconArrowDown, IconArrowUp, IconStar, IconTrash } from '@tabler/icons-react'
import { TSubscriptionPageAppConfig } from '@remnawave/subscription-page-types'
import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    app: TSubscriptionPageAppConfig
    canMoveDown: boolean
    canMoveUp: boolean
    index: number
    onDelete: () => void
    onEdit: () => void
    onMoveDown: () => void
    onMoveUp: () => void
}

export function AppCard(props: IProps) {
    const { app, canMoveDown, canMoveUp, index, onDelete, onEdit, onMoveDown, onMoveUp } = props

    return (
        <Card className={styles.interactiveCard} onClick={onEdit} p="sm" radius="md">
            <Group justify="space-between">
                <Group gap="sm">
                    <Text c="white" fw={600} size="sm">
                        {app.name || `App ${index + 1}`}
                    </Text>
                    {app.featured && (
                        <ActionIcon color="yellow" size="sm" variant="subtle">
                            <IconStar size={16} />
                        </ActionIcon>
                    )}
                    <Badge color="violet" size="xs" variant="light">
                        {app.blocks.length} blocks
                    </Badge>
                </Group>
                <Group gap={4}>
                    <ActionIcon
                        color="gray"
                        disabled={!canMoveUp}
                        onClick={(e) => {
                            e.stopPropagation()
                            onMoveUp()
                        }}
                        size="sm"
                        variant="subtle"
                    >
                        <IconArrowUp size={20} />
                    </ActionIcon>
                    <ActionIcon
                        color="gray"
                        disabled={!canMoveDown}
                        onClick={(e) => {
                            e.stopPropagation()
                            onMoveDown()
                        }}
                        size="sm"
                        variant="subtle"
                    >
                        <IconArrowDown size={20} />
                    </ActionIcon>
                    <ActionIcon
                        className={styles.deleteButton}
                        color="red"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                        size="sm"
                        variant="subtle"
                    >
                        <IconTrash size={20} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    )
}
