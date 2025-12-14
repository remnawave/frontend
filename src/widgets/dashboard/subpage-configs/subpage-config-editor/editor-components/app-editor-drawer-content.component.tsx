import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageBlockConfig,
    TSubscriptionPageLocales,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import { Button, Card, Group, Stack, Switch, TextInput } from '@mantine/core'
import { IconChevronRight, IconPlus, IconStar } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { BlockEditorModal } from './block-editor.modal.component'
import styles from '../subpage-config-visual-editor.module.css'
import { BlockCard } from './block-card.component'

interface IProps {
    app: TSubscriptionPageAppConfig
    enabledLocales: TSubscriptionPageLocales[]
    onChange: (app: TSubscriptionPageAppConfig) => void
    svgLibrary: TSubscriptionPageSvgLibrary
}

export function AppEditorDrawerContent(props: IProps) {
    const { app, enabledLocales, onChange, svgLibrary } = props
    const { t } = useTranslation()

    const [blockModalOpened, { close: closeBlockModal, open: openBlockModal }] =
        useDisclosure(false)
    const [editingBlockIndex, setEditingBlockIndex] = useState<null | number>(null)

    const handleAddBlock = () => {
        const newBlock: TSubscriptionPageBlockConfig = {
            buttons: [],
            description: { en: '' },
            svgIconColor: 'cyan',
            svgIconKey: '',
            title: { en: '' }
        }
        onChange({ ...app, blocks: [...app.blocks, newBlock] })
    }

    const handleBlockChange = (blockIndex: number, updatedBlock: TSubscriptionPageBlockConfig) => {
        const newBlocks = [...app.blocks]
        newBlocks[blockIndex] = updatedBlock
        onChange({ ...app, blocks: newBlocks })
    }

    const handleBlockDelete = (blockIndex: number) => {
        const newBlocks = app.blocks.filter((_, i) => i !== blockIndex)
        onChange({ ...app, blocks: newBlocks })
        if (editingBlockIndex === blockIndex) {
            closeBlockModal()
            setEditingBlockIndex(null)
        }
    }

    const handleBlockMoveUp = (blockIndex: number) => {
        if (blockIndex === 0) return
        const newBlocks = [...app.blocks]
        ;[newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [
            newBlocks[blockIndex],
            newBlocks[blockIndex - 1]
        ]
        onChange({ ...app, blocks: newBlocks })
    }

    const handleBlockMoveDown = (blockIndex: number) => {
        if (blockIndex >= app.blocks.length - 1) return
        const newBlocks = [...app.blocks]
        ;[newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
            newBlocks[blockIndex + 1],
            newBlocks[blockIndex]
        ]
        onChange({ ...app, blocks: newBlocks })
    }

    const handleEditBlock = (blockIndex: number) => {
        setEditingBlockIndex(blockIndex)
        openBlockModal()
    }

    const handleCloseBlockModal = () => {
        closeBlockModal()
    }

    const handleBlockModalExited = () => {
        setEditingBlockIndex(null)
    }

    const editingBlock = editingBlockIndex !== null ? app.blocks[editingBlockIndex] : null

    return (
        <>
            <Stack gap="md">
                <Card className={styles.sectionCard} p="md" radius="md">
                    <Stack gap="md">
                        <Group gap="sm" justify="space-between">
                            <BaseOverlayHeader
                                IconComponent={IconStar}
                                iconSize={16}
                                iconVariant="gradient-cyan"
                                title={t('app-editor-drawer-content.component.app-settings')}
                                titleOrder={5}
                            />

                            <Switch
                                checked={app.featured}
                                color="teal"
                                label={t('app-editor-drawer-content.component.featured')}
                                onChange={(e) =>
                                    onChange({
                                        ...app,
                                        featured: e.currentTarget.checked
                                    })
                                }
                            />
                        </Group>

                        <TextInput
                            classNames={{ input: styles.inputDark }}
                            label={t('app-editor-drawer-content.component.app-name')}
                            onChange={(e) => onChange({ ...app, name: e.target.value })}
                            placeholder={t('app-editor-drawer-content.component.app-name')}
                            value={app.name}
                        />
                    </Stack>
                </Card>

                <Card className={styles.sectionCard} p="md" radius="md">
                    <Stack gap="md">
                        <BaseOverlayHeader
                            IconComponent={IconChevronRight}
                            iconSize={16}
                            iconVariant="gradient-violet"
                            subtitle={`${app.blocks.length} blocks`}
                            title={t('app-editor-drawer-content.component.blocks')}
                            titleOrder={5}
                        />

                        <Stack gap="xs">
                            {app.blocks.map((block, blockIndex) => (
                                <BlockCard
                                    block={block}
                                    canMoveDown={blockIndex < app.blocks.length - 1}
                                    canMoveUp={blockIndex > 0}
                                    index={blockIndex}
                                    key={blockIndex}
                                    onDelete={() => handleBlockDelete(blockIndex)}
                                    onEdit={() => handleEditBlock(blockIndex)}
                                    onMoveDown={() => handleBlockMoveDown(blockIndex)}
                                    onMoveUp={() => handleBlockMoveUp(blockIndex)}
                                />
                            ))}

                            <Button
                                className={styles.addButton}
                                fullWidth
                                leftSection={<IconPlus size={14} />}
                                onClick={handleAddBlock}
                                size="xs"
                                variant="default"
                            >
                                {t('app-editor-drawer-content.component.add-block')}
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>

            <BlockEditorModal
                block={editingBlock}
                enabledLocales={enabledLocales}
                onChange={(updatedBlock) => {
                    if (editingBlockIndex !== null) {
                        handleBlockChange(editingBlockIndex, updatedBlock)
                    }
                }}
                onClose={handleCloseBlockModal}
                onExited={handleBlockModalExited}
                opened={blockModalOpened}
                svgLibrary={svgLibrary}
            />
        </>
    )
}
