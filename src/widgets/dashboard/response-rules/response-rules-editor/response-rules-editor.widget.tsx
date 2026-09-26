import type { editor } from 'monaco-editor'

import { MonacoSetupResponseRulesFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { ResponseRulesEditorActionsFeature } from '@features/dashboard/response-rules/response-rules-editor-actions'
import { Box, Paper, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Monaco } from '@monaco-editor/react'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle } from 'react-icons/tb'
import { useBlocker } from 'react-router'

import { usePseudoFullscreen, useViewportFillHeight } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { preventBackScroll } from '@shared/utils/misc'
import { setupSuggestWidget } from '@shared/utils/setup-monaco/setup-suggest-monaco'

import { IProps } from './interfaces'
import styles from './ResponseRulesEditor.module.css'

export function ResponseRulesEditorWidget(props: IProps) {
    const { t } = useTranslation()

    const { groupedTemplates, responseRules, subscriptionSettingsUuid } = props

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()
    const { containerRef: editorWrapperRef, footerRef } = useViewportFillHeight({
        enabled: !isFullscreen
    })

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState<string>(
        JSON.stringify(responseRules, null, 2) || ''
    )

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
    )

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

    const handleEditorDidMount = () => {
        MonacoSetupResponseRulesFeature.setup(groupedTemplates)
    }

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

    return (
        <Box className={clsx(styles.container, isFullscreen && fullscreenClasses.overlay)}>
            <Paper
                className={clsx(
                    styles.editorWrapper,
                    !isFullscreen && editorClasses.editorAttached,
                    isFullscreen && fullscreenClasses.fill
                )}
                p={0}
                ref={editorWrapperRef}
                pos="relative"
                style={{
                    direction: 'ltr'
                }}
                withBorder
            >
                {isFullscreen && (
                    <FullscreenToggleButton
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                    />
                )}

                <CodeEditor
                    footer={
                        result && (
                            <EditorStatusBar status={isConfigValid ? 'success' : 'error'}>
                                {result}
                            </EditorStatusBar>
                        )
                    }
                    beforeMount={handleEditorDidMount}
                    className={styles.monacoEditor}
                    defaultLanguage="json"
                    onChange={() => {
                        checkForChanges()
                    }}
                    onMount={(editor, monaco) => {
                        editorRef.current = editor
                        monacoRef.current = monaco

                        setupSuggestWidget(editor)
                    }}
                    path="response-rules://*"
                    value={JSON.stringify(responseRules, null, 2)}
                />
            </Paper>

            {!isFullscreen && (
                <EditorFooter ref={footerRef}>
                    <FullscreenToggleButton
                        floating={false}
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                        size={36}
                    />

                    <Stack gap="md">
                        <ResponseRulesEditorActionsFeature
                            editorRef={editorRef}
                            hasUnsavedChanges={hasUnsavedChanges}
                            isResponseRulesValid={isConfigValid}
                            monacoRef={monacoRef}
                            originalValue={originalValue}
                            responseRules={responseRules}
                            setHasUnsavedChanges={setHasUnsavedChanges}
                            setIsResponseRulesValid={setIsConfigValid}
                            setOriginalValue={setOriginalValue}
                            setResult={setResult}
                            subscriptionSettingsUuid={subscriptionSettingsUuid}
                        />
                    </Stack>
                </EditorFooter>
            )}
        </Box>
    )
}
