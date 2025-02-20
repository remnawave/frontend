import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'

import { useUpdateConfig } from '@shared/api/hooks'

import { Props } from './interfaces'

export function ConfigEditorActionsFeature(props: Props) {
    const { editorRef, monacoRef, isConfigValid, setResult } = props
    const { t } = useTranslation()

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateConfig()

    const handleSave = () => {
        if (!editorRef.current) return
        if (!monacoRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (typeof monacoRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()

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
                disabled={!isConfigValid}
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
