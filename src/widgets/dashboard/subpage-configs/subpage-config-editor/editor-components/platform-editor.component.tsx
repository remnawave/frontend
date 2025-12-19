import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageLanguageCode,
    TSubscriptionPagePlatformKey,
    TSubscriptionPagePlatformSchema,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import { Accordion, ActionIcon, Button, Center, Divider, Drawer, Group, Stack } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { AppEditorDrawerContent } from './app-editor-drawer-content.component'
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../subpage-config.constants'
import { LocalizedTextEditor } from './localized-text-editor.component'
import styles from '../subpage-config-visual-editor.module.css'
import { SvgIconSelect } from './svg-icon-select.component'
import { AppCard } from './app-card.component'

interface IProps {
    enabledLocales: TSubscriptionPageLanguageCode[]
    onChange: (platform: TSubscriptionPagePlatformSchema) => void
    onDelete: () => void
    platform: TSubscriptionPagePlatformSchema
    platformKey: TSubscriptionPagePlatformKey
    svgLibrary: TSubscriptionPageSvgLibrary
}

export function PlatformEditor(props: IProps) {
    const { enabledLocales, onChange, onDelete, platform, platformKey, svgLibrary } = props
    const { t } = useTranslation()

    const [drawerOpened, { close: closeDrawer, open: openDrawer }] = useDisclosure(false)
    const [editingAppIndex, setEditingAppIndex] = useState<null | number>(null)

    const handleAddApp = () => {
        const newApp: TSubscriptionPageAppConfig = {
            blocks: [],
            featured: false,
            name: ''
        }
        onChange({ ...platform, apps: [...platform.apps, newApp] })
    }

    const handleAppChange = (appIndex: number, updatedApp: TSubscriptionPageAppConfig) => {
        const newApps = [...platform.apps]
        newApps[appIndex] = updatedApp
        onChange({ ...platform, apps: newApps })
    }

    const handleAppDelete = (appIndex: number) => {
        const newApps = platform.apps.filter((_, i) => i !== appIndex)
        onChange({ ...platform, apps: newApps })
        if (editingAppIndex === appIndex) {
            closeDrawer()
            setEditingAppIndex(null)
        }
    }

    const handleAppMoveUp = (appIndex: number) => {
        if (appIndex === 0) return
        const newApps = [...platform.apps]
        ;[newApps[appIndex - 1], newApps[appIndex]] = [newApps[appIndex], newApps[appIndex - 1]]
        onChange({ ...platform, apps: newApps })
    }

    const handleAppMoveDown = (appIndex: number) => {
        if (appIndex >= platform.apps.length - 1) return
        const newApps = [...platform.apps]
        ;[newApps[appIndex], newApps[appIndex + 1]] = [newApps[appIndex + 1], newApps[appIndex]]
        onChange({ ...platform, apps: newApps })
    }

    const handleEditApp = (appIndex: number) => {
        setEditingAppIndex(appIndex)
        openDrawer()
    }

    const handleCloseDrawer = () => {
        closeDrawer()
        setEditingAppIndex(null)
    }

    const editingApp = editingAppIndex !== null ? platform.apps[editingAppIndex] : null

    return (
        <>
            <Accordion.Item className={styles.accordionItem} value={platformKey}>
                <Center>
                    <Accordion.Control className={styles.accordionControl}>
                        <Group gap="sm">
                            <BaseOverlayHeader
                                IconComponent={PLATFORM_ICONS[platformKey]}
                                iconVariant="gradient-violet"
                                subtitle={`${platform.apps.length} app(s) configured`}
                                title={PLATFORM_LABELS[platformKey]}
                                titleOrder={5}
                            />
                        </Group>
                    </Accordion.Control>
                    <ActionIcon
                        className={styles.deleteButton}
                        color="red"
                        mr="sm"
                        onClick={onDelete}
                        size="lg"
                        variant="subtle"
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Center>
                <Accordion.Panel>
                    <Stack gap="md">
                        <SvgIconSelect
                            label={t('platform-editor.component.platform-svg-icon')}
                            onChange={(svgIconKey) => onChange({ ...platform, svgIconKey })}
                            svgLibrary={svgLibrary}
                            value={platform.svgIconKey}
                        />

                        <LocalizedTextEditor
                            enabledLocales={enabledLocales}
                            label={t('platform-editor.component.display-name')}
                            onChange={(displayName) => onChange({ ...platform, displayName })}
                            value={platform.displayName}
                        />

                        <Divider
                            className={styles.divider}
                            label={t('platform-editor.component.apps')}
                            labelPosition="left"
                        />

                        <Stack gap="sm">
                            {platform.apps.map((app, appIndex) => (
                                <AppCard
                                    app={app}
                                    canMoveDown={appIndex < platform.apps.length - 1}
                                    canMoveUp={appIndex > 0}
                                    index={appIndex}
                                    key={appIndex}
                                    onDelete={() => handleAppDelete(appIndex)}
                                    onEdit={() => handleEditApp(appIndex)}
                                    onMoveDown={() => handleAppMoveDown(appIndex)}
                                    onMoveUp={() => handleAppMoveUp(appIndex)}
                                    svgLibrary={svgLibrary}
                                />
                            ))}

                            <Button
                                className={styles.addButton}
                                fullWidth
                                leftSection={<IconPlus size={14} />}
                                onClick={handleAddApp}
                                variant="default"
                            >
                                {t('platform-editor.component.add-app')}
                            </Button>
                        </Stack>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>

            <Drawer
                keepMounted={false}
                onClose={handleCloseDrawer}
                opened={drawerOpened}
                position="right"
                size="lg"
                title={
                    <BaseOverlayHeader
                        IconComponent={IconEdit}
                        iconVariant="gradient-cyan"
                        subtitle={editingApp?.name || t('platform-editor.component.unnamed-app')}
                        title={t('platform-editor.component.edit-app')}
                        titleOrder={5}
                    />
                }
            >
                {editingApp && editingAppIndex !== null && (
                    <AppEditorDrawerContent
                        app={editingApp}
                        enabledLocales={enabledLocales}
                        onChange={(updatedApp) => handleAppChange(editingAppIndex, updatedApp)}
                        svgLibrary={svgLibrary}
                    />
                )}
            </Drawer>
        </>
    )
}
