import {
    IconArrowDown,
    IconArrowUp,
    IconCopy,
    IconPhoto,
    IconStar,
    IconTrash
} from '@tabler/icons-react'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import { ActionIcon, Badge, Box, Card, Group, Text } from '@mantine/core'
import isSvg from 'is-svg'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    app: TSubscriptionPageAppConfig
    canMoveDown: boolean
    canMoveUp: boolean
    index: number
    onClone: () => void
    onDelete: () => void
    onEdit: () => void
    onMoveDown: () => void
    onMoveUp: () => void
    svgLibrary: TSubscriptionPageSvgLibrary
}

export function AppCard(props: IProps) {
    const {
        app,
        canMoveDown,
        canMoveUp,
        index,
        onClone,
        onDelete,
        onEdit,
        onMoveDown,
        onMoveUp,
        svgLibrary
    } = props

    const svgContent = app.svgIconKey ? svgLibrary[app.svgIconKey] : null
    const hasValidIcon = svgContent && isSvg(svgContent)

    return (
        <Card className={styles.interactiveCard} onClick={onEdit} p="sm" radius="md">
            <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                    <Box className={styles.appIconPreview} visibleFrom="sm">
                        {hasValidIcon ? (
                            <Box
                                className={styles.appIconSvg}
                                dangerouslySetInnerHTML={{ __html: svgContent }}
                            />
                        ) : (
                            <IconPhoto color="var(--mantine-color-dimmed)" size={18} />
                        )}
                    </Box>
                    <Text c="white" fw={600} size="sm" truncate>
                        {app.name || `App ${index + 1}`}
                    </Text>
                    {app.featured && (
                        <ActionIcon color="yellow" size="sm" variant="subtle">
                            <IconStar size={16} />
                        </ActionIcon>
                    )}
                </Group>
                <Group gap={4} wrap="nowrap">
                    <Badge color="violet" size="xs" variant="light">
                        {app.blocks.length} blocks
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
                        color="gray"
                        onClick={(e) => {
                            e.stopPropagation()
                            onClone()
                        }}
                        size="sm"
                        variant="subtle"
                    >
                        <IconCopy size={20} />
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
