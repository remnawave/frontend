import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Drawer,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { TSubscriptionPageSvgLibrary } from '@remnawave/subscription-page-types'
import { IconPhoto, IconPlus, IconTrash } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    onChange: (library: TSubscriptionPageSvgLibrary) => void
    onClose: () => void
    opened: boolean
    svgLibrary: TSubscriptionPageSvgLibrary
}

export function SvgLibraryModal(props: IProps) {
    const { onChange, onClose, opened, svgLibrary } = props
    const { t } = useTranslation()

    const [addDrawerOpened, { close: closeAddDrawer, open: openAddDrawer }] = useDisclosure(false)
    const [editingKey, setEditingKey] = useState<null | string>(null)
    const [newKey, setNewKey] = useState('')
    const [newSvg, setNewSvg] = useState('')

    const libraryEntries = Object.entries(svgLibrary)

    const handleAdd = () => {
        if (!newKey.trim() || !newSvg.trim()) return
        if (!/^[A-Za-z]+$/.test(newKey)) return

        onChange({ ...svgLibrary, [newKey]: newSvg })
        setNewKey('')
        setNewSvg('')
        closeAddDrawer()
    }

    const handleUpdate = () => {
        if (!editingKey || !newSvg.trim()) return

        onChange({ ...svgLibrary, [editingKey]: newSvg })
        setEditingKey(null)
        setNewSvg('')
        closeAddDrawer()
    }

    const handleDelete = (key: string) => {
        const newLibrary = { ...svgLibrary }
        delete newLibrary[key]
        onChange(newLibrary)
    }

    const handleEdit = (key: string) => {
        setEditingKey(key)
        setNewKey(key)
        setNewSvg(svgLibrary[key])
        openAddDrawer()
    }

    const handleOpenAdd = () => {
        setEditingKey(null)
        setNewKey('')
        setNewSvg('')
        openAddDrawer()
    }

    const isValidSvg = (svg: string) => {
        const trimmed = svg.trim()
        return trimmed.startsWith('<svg') && trimmed.includes('</svg>')
    }

    return (
        <>
            <Drawer
                keepMounted={false}
                onClose={onClose}
                opened={opened}
                position="right"
                size="xl"
                title={
                    <BaseOverlayHeader
                        IconComponent={IconPhoto}
                        iconVariant="gradient-violet"
                        subtitle={`${libraryEntries.length} icons`}
                        title={t('svg-library-modal.component.svg-library')}
                    />
                }
            >
                <Stack gap="md">
                    <Button
                        className={styles.addButton}
                        fullWidth
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenAdd}
                        variant="default"
                    >
                        {t('svg-library-modal.component.add-icon')}
                    </Button>

                    {libraryEntries.length === 0 ? (
                        <div className={styles.emptyState}>
                            <IconPhoto size={32} stroke={1.5} />
                            <Text mt="sm" size="sm">
                                {t('svg-icon-select.component.no-icons-in-library')}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {t(
                                    'svg-library-modal.component.add-icons-to-use-them-in-blocks-and-buttons'
                                )}
                            </Text>
                        </div>
                    ) : (
                        <SimpleGrid cols={2} spacing="sm">
                            {libraryEntries.map(([key, svg]) => (
                                <Card
                                    className={styles.interactiveCard}
                                    key={key}
                                    onClick={() => handleEdit(key)}
                                    p="sm"
                                    radius="md"
                                >
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="sm" wrap="nowrap">
                                            <div className={styles.svgPreviewBox}>
                                                {isValidSvg(svg) ? (
                                                    <ThemeIcon
                                                        color="cyan"
                                                        radius="xl"
                                                        size={44}
                                                        style={{
                                                            background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                                            flexShrink: 0
                                                        }}
                                                        variant="light"
                                                    >
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: svg
                                                            }}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        />
                                                    </ThemeIcon>
                                                ) : (
                                                    <IconPhoto
                                                        color="var(--mantine-color-dimmed)"
                                                        size={24}
                                                    />
                                                )}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <Text c="white" fw={500} size="sm" truncate="end">
                                                    {key}
                                                </Text>
                                                <Badge color="violet" size="xs" variant="light">
                                                    SVG
                                                </Badge>
                                            </div>
                                        </Group>
                                        <ActionIcon
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(key)
                                            }}
                                            size="sm"
                                            variant="subtle"
                                        >
                                            <IconTrash size={14} />
                                        </ActionIcon>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Stack>
            </Drawer>

            <Drawer
                keepMounted={false}
                onClose={closeAddDrawer}
                opened={addDrawerOpened}
                position="right"
                size="md"
                title={
                    <BaseOverlayHeader
                        IconComponent={editingKey ? IconPhoto : IconPlus}
                        iconVariant="gradient-cyan"
                        title={
                            editingKey
                                ? t('svg-library-modal.component.edit-icon')
                                : t('svg-library-modal.component.add-icon')
                        }
                    />
                }
            >
                <Stack gap="md">
                    <TextInput
                        classNames={{ input: styles.inputDark }}
                        description={t(
                            'svg-library-modal.component.only-latin-characters-no-spaces'
                        )}
                        disabled={!!editingKey}
                        error={
                            newKey && !/^[A-Za-z]+$/.test(newKey)
                                ? t('svg-library-modal.component.only-latin-characters-allowed')
                                : undefined
                        }
                        label={t('svg-library-modal.component.icon-key')}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="MyIconName"
                        value={newKey}
                    />

                    <Stack gap="xs">
                        <Text fw={500} size="sm">
                            {t('svg-library-modal.component.svg-code')}
                        </Text>
                        <Stack gap="sm">
                            <Textarea
                                classNames={{ input: styles.inputDark }}
                                onChange={(e) => setNewSvg(e.target.value)}
                                placeholder="<svg>...</svg>"
                                rows={12}
                                value={newSvg}
                            />
                            <Card className={styles.sectionCard} p="sm" radius="md">
                                <Stack align="center" gap="xs">
                                    <Text c="dimmed" size="xs">
                                        {t('svg-library-modal.component.preview')}
                                    </Text>
                                    <div className={styles.svgPreviewBox}>
                                        {isValidSvg(newSvg) ? (
                                            <ThemeIcon
                                                color="cyan"
                                                radius="xl"
                                                size={44}
                                                style={{
                                                    background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                                                    border: '1px solid rgba(34, 211, 238, 0.3)',
                                                    flexShrink: 0
                                                }}
                                                variant="light"
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: newSvg
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                />
                                            </ThemeIcon>
                                        ) : (
                                            <IconPhoto
                                                color="var(--mantine-color-dimmed)"
                                                size={24}
                                            />
                                        )}
                                    </div>
                                </Stack>
                            </Card>
                        </Stack>
                    </Stack>

                    <Button
                        disabled={
                            !newSvg.trim() ||
                            (!editingKey && (!newKey.trim() || !/^[A-Za-z]+$/.test(newKey)))
                        }
                        fullWidth
                        onClick={editingKey ? handleUpdate : handleAdd}
                    >
                        {editingKey ? t('common.update') : t('common.add')}
                    </Button>
                </Stack>
            </Drawer>
        </>
    )
}
