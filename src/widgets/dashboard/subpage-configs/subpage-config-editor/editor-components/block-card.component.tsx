import { TSubscriptionPageBlockConfig } from '@remnawave/subscription-page-types'
import { IconArrowDown, IconArrowUp, IconTrash } from '@tabler/icons-react'
import { ActionIcon, Badge, Card, Group, Text } from '@mantine/core'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    block: TSubscriptionPageBlockConfig
    canMoveDown: boolean
    canMoveUp: boolean
    index: number
    onDelete: () => void
    onEdit: () => void
    onMoveDown: () => void
    onMoveUp: () => void
}

export function BlockCard(props: IProps) {
    const { block, canMoveDown, canMoveUp, index, onDelete, onEdit, onMoveDown, onMoveUp } = props

    return (
        <Card className={styles.interactiveCard} onClick={onEdit} p="sm" radius="md">
            <Group justify="space-between" wrap="nowrap">
                <Text c="white" fw={500} size="sm" style={{ flex: 1 }} truncate="end">
                    {block.title.en || `Block ${index + 1}`}
                </Text>

                <Group gap={4} wrap="nowrap">
                    <Badge color="teal" size="xs" variant="light" visibleFrom="sm">
                        {block.buttons.length} buttons
                    </Badge>

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
                        <IconArrowUp size={14} />
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
                        <IconArrowDown size={14} />
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
                        <IconTrash size={14} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    )
}
