import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { MonacoSetupHostMapperEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Group, Modal, Paper } from '@mantine/core'
import { Monaco, useMonaco } from '@monaco-editor/react'
import { HostMapperSchema } from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowsExchange } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { THostForm } from '@shared/ui/forms/hosts/base-host-form/host-form.types'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'
import { formatFirstErrorMarker } from '@shared/utils/monaco/markers'
import { setupSuggestWidget } from '@shared/utils/setup-monaco/setup-suggest-monaco'

import classes from './HostMapperModal.module.css'

const EMPTY_MAPPER = JSON.stringify({ xrayJson: [], mihomo: [], base64: [] }, null, 2)

interface IProps {
    form: THostForm
    rawInbound?: unknown
}

export const HostMapperModal = NiceModal.create((props: IProps) => {
    const { form, rawInbound } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const monaco = useMonaco()
    const monacoRef = useRef<Monaco | null>(null)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const [error, setError] = useState<null | string>(null)

    const currentMapper = form.getValues().mapper

    const initialValue =
        currentMapper && Object.keys(currentMapper).length > 0
            ? JSON.stringify(currentMapper, null, 2)
            : EMPTY_MAPPER

    useEffect(() => {
        if (!monaco) return

        MonacoSetupHostMapperEditorFeature.setup(rawInbound)
    }, [monaco, rawInbound])

    const handleSave = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue().trim()

        if (currentValue === '') {
            form.setFieldValue('mapper', {})
            hide()
            return
        }

        let parsed: unknown

        try {
            parsed = JSON.parse(currentValue)
        } catch {
            setError(t('common.message.invalid-json'))
            return
        }

        const result = HostMapperSchema.safeParse(parsed)

        if (!result.success) {
            const issue = result.error.issues[0]
            setError(`${issue.path.join('.') || 'mapper'}: ${issue.message}`)
            return
        }

        form.setFieldValue('mapper', result.data)
        hide()
    }

    return (
        <Modal
            {...modalProps}
            classNames={{ header: classes.header }}
            size="90%"
            transitionProps={{ transition: 'fade', duration: 200 }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbArrowsExchange}
                    iconVariant="soft"
                    title={t('base-host-form.mapper')}
                />
            }
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
                        footer={error && <EditorStatusBar status="error">{error}</EditorStatusBar>}
                        className={classes.monacoEditor}
                        defaultLanguage="json"
                        value={initialValue}
                        onChange={() => setError(null)}
                        onValidate={(markers) => setError(formatFirstErrorMarker(markers))}
                        onMount={(editor, monaco) => {
                            editorRef.current = editor
                            monacoRef.current = monaco

                            forceMonacoRetokenize(editor)
                            setupSuggestWidget(editor)
                        }}
                        options={COMPACT_MONACO_OPTIONS}
                        path="host-mapper://*"
                    />
                </Paper>

                <EditorFooter className={clsx(error && classes.footerError)}>
                    <Group gap="sm" ml="auto">
                        <Button onClick={handleSave} variant="soft">
                            {t('common.action.save')}
                        </Button>
                        <FullscreenToggleButton
                            floating={false}
                            isFullscreen={isFullscreen}
                            onToggle={toggleFullscreen}
                            size={36}
                        />
                    </Group>
                </EditorFooter>
            </Box>
        </Modal>
    )
})
