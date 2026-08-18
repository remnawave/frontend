import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { MonacoSetupHostMapperEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Group, Modal, Paper } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { Monaco, useMonaco } from '@monaco-editor/react'
import {
    CreateHostCommand,
    HostMapperSchema,
    UpdateHostCommand,
    UpdateManyHostsCommand
} from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowsExchange } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './HostMapperModal.module.css'

const EMPTY_MAPPER = JSON.stringify({ xrayJson: [], mihomo: [], base64: [] }, null, 2)

interface IProps {
    form: UseFormReturnType<
        | CreateHostCommand.RequestBody
        | UpdateHostCommand.RequestBody
        | UpdateManyHostsCommand.RequestBody
    >
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
            form.setFieldValue('mapper', undefined)
            hide()
            return
        }

        let parsed: unknown

        try {
            parsed = JSON.parse(currentValue)
        } catch {
            setError(t('base-host-form.invalid-json'))
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
                        isFullscreen && fullscreenClasses.fill
                    )}
                    p={0}
                    pos="relative"
                    style={{
                        border: error
                            ? '1px solid var(--mantine-color-red-5)'
                            : '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <CodeEditor
                        footer={error && <EditorStatusBar status="error">{error}</EditorStatusBar>}
                        className={classes.monacoEditor}
                        defaultLanguage="json"
                        value={initialValue}
                        onChange={() => setError(null)}
                        onMount={(editor, monaco) => {
                            editorRef.current = editor
                            monacoRef.current = monaco

                            forceMonacoRetokenize(editor)

                            const contribution = editor.getContribution(
                                'editor.contrib.suggestController'
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            ) as any

                            if (contribution && contribution.widget) {
                                const suggestWidget = contribution.widget.value
                                if (suggestWidget?._setDetailsVisible) {
                                    suggestWidget._setDetailsVisible(true)
                                }
                                if (suggestWidget?._persistedSize) {
                                    suggestWidget._persistedSize.store({
                                        width: 300,
                                        height: 300
                                    })
                                }
                            }
                        }}
                        options={COMPACT_MONACO_OPTIONS}
                        path="host-mapper://*"
                    />
                </Paper>

                <EditorFooter className={clsx(error && classes.footerError)}>
                    <FullscreenToggleButton
                        floating={false}
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                        size={36}
                    />

                    <Group gap="sm">
                        <Button onClick={handleSave} variant="soft">
                            {t('common.save')}
                        </Button>
                        <Button onClick={hide} variant="subtle">
                            {t('common.cancel')}
                        </Button>
                    </Group>
                </EditorFooter>
            </Box>
        </Modal>
    )
})
