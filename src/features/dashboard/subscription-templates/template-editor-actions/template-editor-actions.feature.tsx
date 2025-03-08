import { PiCheck, PiCheckSquareOffset, PiCopy, PiFloppyDisk } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'
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

        if (currentValue) {
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

    return (
        <Group>
            <Button
                leftSection={<PiCheckSquareOffset size={16} />}
                mb="md"
                onClick={formatDocument}
            >
                {t('config-editor-actions.feature.format')}
            </Button>
            <Button
                color={clipboard.copied ? 'teal' : 'gray'}
                leftSection={
                    clipboard.copied ? <PiCheck size={'1.25rem'} /> : <PiCopy size={'1.25rem'} />
                }
                mb="md"
                onClick={handleCopyConfig}
                variant="outline"
            >
                {t('config-editor-actions.feature.copy-config')}
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
    )
}
