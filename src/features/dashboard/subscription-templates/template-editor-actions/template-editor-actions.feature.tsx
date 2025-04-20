import { TbClipboardCopy, TbClipboardText, TbCut, TbSelectAll } from 'react-icons/tb'
import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { ActionIcon, Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'

import { useUpdateSubscriptionTemplate } from '@shared/api/hooks'

import { Props } from './interfaces'

export function TemplateEditorActionsFeature(props: Props) {
    const { editorRef, language, templateType } = props
    const { t } = useTranslation()

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateSubscriptionTemplate()
    const clipboard = useClipboard({ timeout: 500 })

    const handleSave = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()

        if (currentValue && currentValue.trim()) {
            if (language === 'yaml') {
                updateConfig({
                    variables: {
                        templateType,
                        encodedTemplateYaml: Buffer.from(currentValue, 'utf-8').toString('base64')
                    }
                })
            }

            if (language === 'json') {
                updateConfig({
                    variables: { templateType, templateJson: JSON.parse(currentValue) }
                })
            }
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

    const formatDocument = () => {
        if (!editorRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (!('getAction' in editorRef.current)) return
        if (typeof editorRef.current.getAction !== 'function') return

        editorRef.current.getAction('editor.action.formatDocument').run()
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
                    leftSection={<PiFloppyDisk size={16} />}
                    loading={isUpdating}
                    mb="md"
                    onClick={handleSave}
                >
                    {t('config-editor-actions.feature.save')}
                </Button>
            </Group>
            <Group>
                <ActionIcon.Group mb="md">
                    <ActionIcon
                        color={clipboard.copied ? 'teal' : 'cyan'}
                        onClick={handleCopyConfig}
                        radius="md"
                        size="input-sm"
                        variant="outline"
                    >
                        <TbClipboardCopy size={20} />
                    </ActionIcon>

                    <ActionIcon
                        onClick={handleSelectAll}
                        radius="md"
                        size="input-sm"
                        variant="outline"
                    >
                        <TbSelectAll size={20} />
                    </ActionIcon>

                    <ActionIcon onClick={handleCut} radius="md" size="input-sm" variant="outline">
                        <TbCut size={20} />
                    </ActionIcon>

                    <ActionIcon onClick={handlePaste} radius="md" size="input-sm" variant="outline">
                        <TbClipboardText size={20} />
                    </ActionIcon>
                </ActionIcon.Group>
            </Group>
        </Group>
    )
}
