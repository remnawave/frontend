import type { editor } from 'monaco-editor'

import { ConfigEditorActionsFeature } from '@features/dashboard/config-profiles/config-editor-actions'
import { ConfigValidationFeature } from '@features/dashboard/config-profiles/config-validation'
import { MonacoSetupFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Card, Code, Group, Loader, Paper } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMonaco } from '@monaco-editor/react'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle } from 'react-icons/tb'
import { useBlocker } from 'react-router'

import { usePseudoFullscreen, useViewportFillHeight } from '@shared/hooks'
import { CodeEditor, EditorStatusBar } from '@shared/ui/code-editor'
import { FullscreenToggleButton, fullscreenClasses } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './ConfigEditor.module.css'
import { IProps } from './interfaces'

export function ConfigEditorWidget(props: IProps) {
    const { t, i18n } = useTranslation()
    const monaco = useMonaco()

    const { configProfile, isWasmCrashed, isWasmRestarting, onRestartWasm, snippets } = props

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(true)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState<string>(
        JSON.stringify(configProfile.config, null, 2) || ''
    )

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const wasWasmRestarting = useRef(false)

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()
    const { containerRef: editorWrapperRef, footerRef } = useViewportFillHeight({
        enabled: !isFullscreen
    })

    useEffect(() => {
        if (!monaco) return

        MonacoSetupFeature.setup(monaco, i18n.language, snippets.snippets)
    }, [i18n.language, snippets, monaco])

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    )

    const snippetMap = new Map(snippets.snippets.map((s) => [s.name, s.snippet]))

    useEffect(() => {
        if (wasWasmRestarting.current && !isWasmRestarting && !isWasmCrashed && editorRef.current) {
            ConfigValidationFeature.validate(editorRef, setResult, setIsConfigValid, snippetMap)
        }
        wasWasmRestarting.current = isWasmRestarting
    }, [isWasmRestarting, isWasmCrashed])

    const checkForChanges = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue()
        const hasChanges = currentValue !== originalValue
        setHasUnsavedChanges(hasChanges)
    }

    useLayoutEffect(() => {
        document.body.addEventListener('wheel', preventBackScroll, {
            passive: false
        })
        return () => {
            document.body.removeEventListener('wheel', preventBackScroll)
        }
    }, [])

    useEffect(() => {
        if (blocker.state === 'blocked') {
            modals.openConfirmModal({
                title: (
                    <BaseOverlayHeader
                        iconColor="red"
                        IconComponent={TbAlertTriangle}
                        iconSize={20}
                        iconVariant="soft"
                        title={t('config-editor.widget.unsaved-changes')}
                    />
                ),
                children: t(
                    'config-editor.widget.your-changes-will-be-lost-if-you-leave-this-page-without-saving'
                ),
                centered: true,
                labels: {
                    confirm: t('config-editor.widget.leave'),
                    cancel: t('config-editor.widget.stay')
                },

                confirmProps: {
                    color: 'red',
                    variant: 'soft'
                },
                cancelProps: {
                    variant: 'light'
                },
                onConfirm: () => {
                    blocker.proceed()
                },
                onCancel: () => {
                    blocker.reset()
                },
                closeOnConfirm: true,
                closeOnCancel: true
            })
        }
    }, [blocker])

    const statusBar = (result || isWasmRestarting || isWasmCrashed) && (
        <EditorStatusBar
            status={isWasmCrashed || isWasmRestarting || !isConfigValid ? 'error' : 'success'}
        >
            {isWasmRestarting && (
                <Group gap="xs">
                    <Loader color="orange" size="xs" />
                    <Code className={styles.statusCode} color="orange">
                        Xray Core (WASM) is restarting...
                    </Code>
                </Group>
            )}
            {!isWasmRestarting && isWasmCrashed && (
                <Group gap="sm">
                    <Code className={styles.statusCode} color="red">
                        Xray Core (WASM) crashed. Validation is unavailable.
                    </Code>
                    <Button color="red" onClick={onRestartWasm} size="compact-xs" variant="light">
                        {t('restart-node-button.feature.restart')}
                    </Button>
                </Group>
            )}
            {!isWasmRestarting && !isWasmCrashed && result}
        </EditorStatusBar>
    )

    return (
        <Box className={clsx(styles.container, isFullscreen && fullscreenClasses.overlay)}>
            <Paper
                className={clsx(styles.editorWrapper, isFullscreen && fullscreenClasses.fill)}
                p={0}
                pos="relative"
                ref={editorWrapperRef}
                style={{
                    direction: 'ltr'
                }}
                withBorder
            >
                <FullscreenToggleButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />

                <CodeEditor
                    footer={statusBar}
                    className={styles.monacoEditor}
                    defaultLanguage="json"
                    loading={t('config-editor.widget.loading-editor')}
                    onChange={() => {
                        if (!isWasmCrashed && !isWasmRestarting) {
                            ConfigValidationFeature.validate(
                                editorRef,
                                setResult,
                                setIsConfigValid,
                                snippetMap
                            )
                        }

                        checkForChanges()
                    }}
                    onMount={(editor) => {
                        editorRef.current = editor

                        editor.getAction('editor.foldLevel7')?.run()

                        ConfigValidationFeature.validate(
                            editorRef,
                            setResult,
                            setIsConfigValid,
                            snippetMap
                        )
                    }}
                    options={{
                        stickyScroll: { enabled: false }
                    }}
                    path="xray-config://*"
                    value={JSON.stringify(configProfile.config, null, 2)}
                />
            </Paper>

            {!isFullscreen && (
                <Card className={styles.footer} h="auto" m="0" pos="sticky" ref={footerRef}>
                    <ConfigEditorActionsFeature
                        configProfile={configProfile}
                        editorRef={editorRef}
                        hasUnsavedChanges={hasUnsavedChanges}
                        isConfigValid={isConfigValid}
                        originalValue={originalValue}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        setIsConfigValid={setIsConfigValid}
                        setOriginalValue={setOriginalValue}
                        setResult={setResult}
                    />
                </Card>
            )}
        </Box>
    )
}
