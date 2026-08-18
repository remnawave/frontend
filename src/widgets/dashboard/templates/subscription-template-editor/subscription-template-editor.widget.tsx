import type { editor } from 'monaco-editor'

import { TemplateEditorActionsFeature } from '@features/dashboard/subscription-templates/template-editor-actions'
import { Box, Paper } from '@mantine/core'
import { Monaco } from '@monaco-editor/react'
import 'monaco-yaml/yaml.worker.js'
import { GetHostsCommand, GetSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import { decode } from '@stablelib/base64'
import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

import { usePseudoFullscreen, useViewportFillHeight } from '@shared/hooks'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui'
import { CodeEditor, editorClasses, EditorFooter } from '@shared/ui/code-editor'
import { preventBackScroll } from '@shared/utils/misc'

import styles from './SubscriptionTemplateEditor.module.css'
import { configureMonaco, getTemplateModelPath } from './utils/setup-template-monaco'

interface Props {
    editorType: 'json' | 'yaml'
    hosts: GetHostsCommand.Response['response']
    template: GetSubscriptionTemplateCommand.Response['response']
}

export function SubscriptionTemplateEditorWidget(props: Props) {
    const { editorType, hosts, template } = props

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()
    const { containerRef: editorWrapperRef, footerRef } = useViewportFillHeight({
        enabled: !isFullscreen
    })

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const monacoRef = useRef<Monaco | null>(null)

    const getConfig = () => {
        if (editorType === 'yaml') {
            return template.encodedTemplateYaml
                ? new TextDecoder().decode(decode(template.encodedTemplateYaml))
                : ''
        }
        return JSON.stringify(template.templateJson, null, 2)
    }

    const handleEditorWillMount = (monaco: Monaco) => {
        configureMonaco(monaco, editorType, hosts, template.templateType)
    }

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
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

            if (suggestWidget && suggestWidget._persistedSize) {
                suggestWidget._persistedSize.store({ width: 400, height: 256 })
            }
        }
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
                    beforeMount={handleEditorWillMount}
                    className={styles.monacoEditor}
                    defaultLanguage={editorType}
                    onMount={handleEditorDidMount}
                    options={{
                        renderValidationDecorations: 'on',
                        quickSuggestions: {
                            strings: true,
                            comments: true,
                            other: true
                        }
                    }}
                    path={getTemplateModelPath(template.templateType)}
                    value={getConfig() || ''}
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

                    <TemplateEditorActionsFeature
                        editorRef={editorRef}
                        editorType={editorType}
                        template={template}
                    />
                </EditorFooter>
            )}
        </Box>
    )
}
