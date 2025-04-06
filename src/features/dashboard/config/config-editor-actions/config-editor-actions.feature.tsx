import { PiCheck, PiCheckSquareOffset, PiCopy, PiFloppyDisk } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { Button, Group, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'

import { useUpdateConfig } from '@shared/api/hooks'

import { Props } from './interfaces'

export function ConfigEditorActionsFeature(props: Props) {
    const { editorRef, monacoRef, isConfigValid, setResult } = props
    const { t } = useTranslation()

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateConfig()
    const clipboard = useClipboard({ timeout: 500 })

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
        </Group>
    )
}
