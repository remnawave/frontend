import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Box, Button, Modal, Paper, SegmentedControl } from '@mantine/core'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbBinary } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { decodeBase64, encodeBase64 } from '@shared/utils/misc/base64'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './Base64EditorModal.module.css'

const INVALID_BASE64_MESSAGE = 'Value is not valid base64'

const LANGUAGES = [
    { label: 'JSON', value: 'json' },
    { label: 'YAML', value: 'yaml' },
    { label: 'Text', value: 'plaintext' }
]

const detectLanguage = (value: string): string => {
    const trimmed = value.trim()

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
            JSON.parse(trimmed)
            return 'json'
        } catch {
            return 'plaintext'
        }
    }

    return 'plaintext'
}

interface IProps {
    label?: string
    onSave: (encoded: string) => void
    value: string
}

export const Base64EditorModal = NiceModal.create((props: IProps) => {
    const { label, onSave, value } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const initialDecoded = decodeBase64(value) ?? ''

    const [decoded, setDecoded] = useState(initialDecoded)
    const [encoded, setEncoded] = useState(value)
    const [error, setError] = useState<null | string>(null)
    const [language, setLanguage] = useState(detectLanguage(initialDecoded))

    const handleDecodedChange = (nextValue: string | undefined) => {
        const nextDecoded = nextValue ?? ''

        setDecoded(nextDecoded)
        setEncoded(encodeBase64(nextDecoded))
        setError(null)
    }

    const handleEncodedChange = (nextValue: string | undefined) => {
        const nextEncoded = (nextValue ?? '').trim()

        setEncoded(nextEncoded)

        const nextDecoded = decodeBase64(nextEncoded)

        if (nextDecoded === null) {
            setError(INVALID_BASE64_MESSAGE)
            return
        }

        setDecoded(nextDecoded)
        setError(null)
    }

    const handleSave = () => {
        if (decodeBase64(encoded) === null) {
            setError(INVALID_BASE64_MESSAGE)
            return
        }

        onSave(encoded)
        hide()
    }

    const renderEditor = (
        paneLanguage: string,
        paneValue: string,
        onChange: (nextValue: string | undefined) => void,
        withError?: boolean
    ) => (
        <Box className={classes.pane}>
            <Paper
                className={clsx(
                    classes.editorWrapper,
                    editorClasses.editorAttached,
                    withError && error && classes.editorWrapperError,
                    isFullscreen && fullscreenClasses.fill
                )}
                p={0}
                pos="relative"
                withBorder
            >
                <CodeEditor
                    language={paneLanguage}
                    onChange={onChange}
                    onMount={(editorInstance: editor.IStandaloneCodeEditor) =>
                        forceMonacoRetokenize(editorInstance)
                    }
                    options={{ ...COMPACT_MONACO_OPTIONS, wordWrap: 'on' }}
                    value={paneValue}
                    withJsonPath={false}
                />
            </Paper>
        </Box>
    )

    return (
        <Modal
            {...modalProps}
            size="90%"
            title={
                <BaseOverlayHeader
                    iconColor="grape"
                    IconComponent={TbBinary}
                    iconVariant="soft"
                    subtitle={label}
                    title="Base64 editor"
                />
            }
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <Box className={clsx(classes.container, isFullscreen && fullscreenClasses.overlay)}>
                <Box className={clsx(classes.panes, isFullscreen && classes.panesFill)}>
                    {renderEditor(language, decoded, handleDecodedChange)}
                    {renderEditor('plaintext', encoded, handleEncodedChange, true)}
                </Box>

                {error && <EditorStatusBar status="error">{error}</EditorStatusBar>}

                <EditorFooter className={clsx(error && classes.footerError)}>
                    <FullscreenToggleButton
                        floating={false}
                        isFullscreen={isFullscreen}
                        onToggle={toggleFullscreen}
                        size={36}
                    />

                    <Button onClick={handleSave} variant="soft">
                        {t('common.action.save')}
                    </Button>

                    <SegmentedControl
                        data={LANGUAGES}
                        onChange={setLanguage}
                        size="xs"
                        value={language}
                    />
                </EditorFooter>
            </Box>
        </Modal>
    )
})
