import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Box,
    Button,
    Group,
    Modal,
    Paper,
    ThemeIconProps,
    Tooltip
} from '@mantine/core'
import { useMonaco } from '@monaco-editor/react'
import clsx from 'clsx'
import { ComponentType, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowUp, TbBook, TbBraces } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'
import { formatFirstErrorMarker } from '@shared/utils/monaco/markers'

import classes from './JsonEditorModal.module.css'

export interface IJsonEditorModalProps {
    docsUrl?: string
    iconColor?: ThemeIconProps['color']
    IconComponent?: ComponentType<{ size: number }>
    initialValue: string
    onSave: (value: string) => void
    path: string
    sample?: string
    setupSchema?: () => Promise<void> | void
    title: string
}

export const JsonEditorModal = NiceModal.create((props: IJsonEditorModalProps) => {
    const {
        docsUrl,
        iconColor = 'teal',
        IconComponent = TbBraces,
        initialValue,
        onSave,
        path,
        sample,
        setupSchema,
        title
    } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const monaco = useMonaco()
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        if (!monaco || !setupSchema) return

        setupSchema()
    }, [monaco])

    const handleSave = () => {
        const currentValue = editorRef.current?.getValue().trim() ?? ''

        if (currentValue !== '') {
            try {
                JSON.parse(currentValue)
            } catch {
                setError(t('common.message.invalid-json'))
                return
            }
        }

        onSave(currentValue)
        hide()
    }

    return (
        <Modal
            {...modalProps}
            size="900px"
            title={
                <BaseOverlayHeader
                    iconColor={iconColor}
                    IconComponent={IconComponent}
                    iconVariant="soft"
                    title={title}
                />
            }
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <Box className={clsx(classes.container, isFullscreen && fullscreenClasses.overlay)}>
                <Paper
                    className={clsx(
                        classes.editorWrapper,
                        editorClasses.editorAttached,
                        error && classes.editorWrapperError,
                        isFullscreen && fullscreenClasses.fill
                    )}
                    p={0}
                    pos="relative"
                    withBorder
                >
                    <CodeEditor
                        defaultLanguage="json"
                        footer={error && <EditorStatusBar status="error">{error}</EditorStatusBar>}
                        onMount={(editorInstance) => {
                            editorRef.current = editorInstance

                            forceMonacoRetokenize(editorInstance)
                        }}
                        onValidate={(markers) => setError(formatFirstErrorMarker(markers))}
                        options={COMPACT_MONACO_OPTIONS}
                        path={path}
                        value={initialValue}
                    />
                </Paper>

                <EditorFooter className={clsx(error && classes.footerError)}>
                    <FullscreenToggleButton
                        floating={false}
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                        size={36}
                    />

                    {docsUrl && (
                        <Tooltip label={t('common.action.documentation')}>
                            <ActionIcon
                                color="gray"
                                component="a"
                                href={docsUrl}
                                rel="noopener noreferrer"
                                size={36}
                                target="_blank"
                                variant="soft"
                            >
                                <TbBook size={18} />
                            </ActionIcon>
                        </Tooltip>
                    )}

                    {sample && (
                        <Button
                            color="gray"
                            leftSection={<TbArrowUp size={18} />}
                            onClick={() => editorRef.current?.setValue(sample)}
                            variant="soft"
                        >
                            {t('common.action.paste-default')}
                        </Button>
                    )}

                    <Group gap="sm" ml="auto">
                        <Button onClick={hide} variant="subtle">
                            {t('common.action.cancel')}
                        </Button>
                        <Button onClick={handleSave} variant="soft" disabled={!!error}>
                            {t('common.action.save')}
                        </Button>
                    </Group>
                </EditorFooter>
            </Box>
        </Modal>
    )
})
