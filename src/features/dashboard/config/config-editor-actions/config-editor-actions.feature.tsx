import {
    TbClipboardCopy,
    TbClipboardText,
    TbCut,
    TbDownload,
    TbSelectAll,
    TbTools
} from 'react-icons/tb'
import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { ActionIcon, Button, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'

import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { KeypairWidget } from '@widgets/dashboard/config/keypair'
import { useUpdateConfig } from '@shared/api/hooks'

import { Props } from './interfaces'

export function ConfigEditorActionsFeature(props: Props) {
    const { editorRef, monacoRef, isConfigValid, setResult } = props
    const { t } = useTranslation()

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateConfig()
    const clipboard = useClipboard({ timeout: 500 })

    const { openDownloadModal } = useDownloadTemplate('XRAY_JSON', editorRef, 'XRAY_CORE')

    const handleSave = () => {
        if (!editorRef.current) return
        if (!monacoRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (typeof monacoRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()

        try {
            JSON.parse(currentValue)
        } catch (error) {
            consola.error(error)
            notifications.show({
                color: 'red',
                message: t('config-editor-actions.feature.failed-to-save-invalid-json'),
                title: t('config-editor-actions.feature.error')
            })
            return
        }

        if (currentValue) {
            updateConfig({
                variables: JSON.parse(currentValue),
                mutationFns: {
                    onError: (error) => {
                        setResult(error.message)
                    }
                }
            })
        }
    }

    const handleCopyConfig = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()
        clipboard.copy(currentValue)
    }

    const handleSelectAll = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getModel' in editorRef.current)) return
        if (typeof editorRef.current.getModel !== 'function') return

        const model = editorRef.current.getModel()
        if (!model) return

        editorRef.current.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: model.getLineCount(),
            endColumn: model.getLineMaxColumn(model.getLineCount())
        })
    }

    const handleCut = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getSelection' in editorRef.current)) return
        if (typeof editorRef.current.getSelection !== 'function') return
        if (!('getModel' in editorRef.current)) return
        if (typeof editorRef.current.getModel !== 'function') return

        const selection = editorRef.current.getSelection()
        const model = editorRef.current.getModel()
        if (!selection || !model) return

        const selectedText = model.getValueInRange(selection)
        clipboard.copy(selectedText)

        editorRef.current.executeEdits('', [{ range: selection, text: '' }])
    }

    const handlePaste = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getPosition' in editorRef.current)) return
        if (typeof editorRef.current.getPosition !== 'function') return

        const position = editorRef.current.getPosition()
        if (!position) return

        navigator.clipboard.readText().then((text) => {
            editorRef.current.executeEdits('', [
                {
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    },
                    text
                }
            ])
        })
    }

    const formatDocument = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getAction' in editorRef.current)) return
        if (typeof editorRef.current.getAction !== 'function') return

        editorRef.current.getAction('editor.action.formatDocument').run()
    }

    return (
        <Group>
            <Group grow preventGrowOverflow={false} wrap="wrap">
                <Button
                    leftSection={<PiCheckSquareOffset size={16} />}
                    mb="md"
                    onClick={formatDocument}
                >
                    {t('config-editor-actions.feature.format')}
                </Button>

                <Button
                    disabled={!isConfigValid}
                    leftSection={<PiFloppyDisk size={16} />}
                    loading={isUpdating}
                    mb="md"
                    onClick={handleSave}
                >
                    {t('config-editor-actions.feature.save')}
                </Button>

                <Button
                    color="red"
                    disabled={isConfigValid || isUpdating}
                    leftSection={<PiFloppyDisk size={16} />}
                    loading={isUpdating}
                    mb="md"
                    onClick={() => {
                        modals.openConfirmModal({
                            title: t('config-editor-actions.feature.save-anyway-title'),
                            children: (
                                <Text>
                                    {t('config-editor-actions.feature.save-anyway-description')}
                                </Text>
                            ),
                            centered: true,
                            labels: {
                                confirm: t('config-editor-actions.feature.save'),
                                cancel: t('config-editor-actions.feature.cancel')
                            },
                            confirmProps: {
                                color: 'red'
                            },
                            onConfirm: handleSave
                        })
                    }}
                >
                    {t('config-editor-actions.feature.save-anyway')}
                </Button>

                <Button
                    leftSection={<TbTools size={16} />}
                    mb="md"
                    onClick={() => {
                        modals.open({
                            title: 'Tools',
                            centered: true,
                            children: <KeypairWidget />
                        })
                    }}
                >
                    {t('config-editor-actions.feature.tools')}
                </Button>
            </Group>
            <Group>
                <ActionIcon.Group mb="md">
                    <ActionIcon
                        color={clipboard.copied ? 'teal' : 'cyan'}
                        onClick={handleCopyConfig}
                        size="input-sm"
                        variant="outline"
                    >
                        <TbClipboardCopy size={20} />
                    </ActionIcon>

                    <ActionIcon onClick={handleSelectAll} size="input-sm" variant="outline">
                        <TbSelectAll size={20} />
                    </ActionIcon>

                    <ActionIcon onClick={handleCut} size="input-sm" variant="outline">
                        <TbCut size={20} />
                    </ActionIcon>

                    <ActionIcon onClick={handlePaste} size="input-sm" variant="outline">
                        <TbClipboardText size={20} />
                    </ActionIcon>
                </ActionIcon.Group>
            </Group>

            <Group grow preventGrowOverflow={false} wrap="wrap">
                <Button
                    leftSection={<TbDownload size={16} />}
                    loading={isUpdating}
                    mb="md"
                    onClick={openDownloadModal}
                    variant="light"
                >
                    {t('config-editor-actions.feature.load-from-github')}
                </Button>
            </Group>
        </Group>
    )
}
