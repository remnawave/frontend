import type { editor } from 'monaco-editor'

import { MonacoSetupNodePluginEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { NodePluginsEditorActionsFeature } from '@features/dashboard/node-plugins/node-plugins-editor-actions'
import { Box, Paper } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Monaco } from '@monaco-editor/react'
import { GetNodePluginCommand } from '@remnawave/backend-contract'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle } from 'react-icons/tb'
import { useBlocker } from 'react-router'

import { useGetSharedLists } from '@shared/api/hooks'
import { usePseudoFullscreen, useViewportFillHeight } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './NodePluginEditor.module.css'

interface IProps {
    nodePlugin: GetNodePluginCommand.Response['response']['pluginConfig']
    pluginUuid: string
}

export function NodePluginEditorWidget(props: IProps) {
    const { t } = useTranslation()

    const { nodePlugin, pluginUuid } = props

    const { data: sharedLists } = useGetSharedLists()

    const [result, setResult] = useState('')
    const [isConfigValid, setIsConfigValid] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [originalValue, setOriginalValue] = useState<string>(
        JSON.stringify(nodePlugin, null, 2) || ''
    )

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()
    const { containerRef: editorWrapperRef, footerRef } = useViewportFillHeight({
        enabled: !isFullscreen
    })

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

    const sharedListsData = useMemo(() => sharedLists?.sharedLists ?? [], [sharedLists])

    useEffect(() => {
        MonacoSetupNodePluginEditorFeature.setup(sharedListsData)
    }, [sharedListsData])

    const handleEditorDidMount = () => {
        MonacoSetupNodePluginEditorFeature.setup(sharedListsData)
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
            <div style={{ position: 'absolute', opacity: 0, height: 0, overflow: 'hidden' }}>
                <input aria-hidden="true" name="fake-login" tabIndex={-1} type="text" />
                <input aria-hidden="true" name="fake-password" tabIndex={-1} type="password" />
            </div>

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
                                suggestWidget._persistedSize.store({ width: 300, height: 300 })
                            }
                        }
                    }}
                    path="node-plugin://*"
                    value={JSON.stringify(nodePlugin, null, 2)}
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

                    <NodePluginsEditorActionsFeature
                        editorRef={editorRef}
                        hasUnsavedChanges={hasUnsavedChanges}
                        isNodePluginValid={isConfigValid}
                        monacoRef={monacoRef}
                        originalValue={originalValue}
                        pluginUuid={pluginUuid}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        setIsNodePluginValid={setIsConfigValid}
                        setOriginalValue={setOriginalValue}
                        setResult={setResult}
                    />
                </EditorFooter>
            )}
        </Box>
    )
}
