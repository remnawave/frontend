import {
    TbClipboardCopy,
    TbClipboardText,
    TbCut,
    TbDownload,
    TbMenuDeep,
    TbSelectAll
} from 'react-icons/tb'
import { useClipboard, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { ActionIcon, Button, Group, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { useUpdateSubscriptionTemplate } from '@shared/api/hooks'

import { Props } from './interfaces'

export function TemplateEditorActionsFeature(props: Props) {
    const { editorRef, language, templateType } = props
    const { t } = useTranslation()

    const isMobile = useMediaQuery('(max-width: 48em)')
    const clipboard = useClipboard({ timeout: 500 })
    const [opened, handlers] = useDisclosure(false)

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateSubscriptionTemplate()
    const { openDownloadModal } = useDownloadTemplate(templateType, editorRef, 'SUBSCRIPTION')

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
        <Group grow={isMobile} preventGrowOverflow={false} wrap="wrap">
            <Button
                color="teal"
                leftSection={<PiFloppyDisk size={16} />}
                loading={isUpdating}
                onClick={handleSave}
                radius="md"
                variant="light"
            >
                {t('config-editor-actions.feature.save')}
            </Button>

            <Group gap={0} wrap="nowrap">
                <Menu
                    onClose={() => handlers.close()}
                    onOpen={() => handlers.open()}
                    radius="sm"
                    shadow="md"
                    trigger="click-hover"
                    withinPortal
                >
                    <Menu.Target>
                        <ActionIcon
                            radius="md"
                            size={36}
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                            variant={opened ? 'outline' : 'default'}
                        >
                            <TbMenuDeep size={20} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            color={clipboard.copied ? 'teal' : undefined}
                            leftSection={<TbClipboardCopy size={14} />}
                            onClick={handleCopyConfig}
                        >
                            {t('config-editor-actions.feature.copy-all-content')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbSelectAll size={14} />}
                            onClick={handleSelectAll}
                        >
                            {t('config-editor-actions.feature.select-all')}
                        </Menu.Item>

                        <Menu.Item leftSection={<TbCut size={14} />} onClick={handleCut}>
                            {t('config-editor-actions.feature.cut-selection')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbClipboardText size={14} />}
                            onClick={handlePaste}
                        >
                            {t('config-editor-actions.feature.paste-from-clipboard')}
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            leftSection={<TbDownload size={14} />}
                            onClick={openDownloadModal}
                        >
                            {t('config-editor-actions.feature.load-from-github')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

                <Button
                    leftSection={<PiCheckSquareOffset size={16} />}
                    onClick={formatDocument}
                    radius="md"
                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeft: 0,
                        width: '100%'
                    }}
                    variant="default"
                >
                    {t('config-editor-actions.feature.format')}
                </Button>
            </Group>
        </Group>
    )
}
