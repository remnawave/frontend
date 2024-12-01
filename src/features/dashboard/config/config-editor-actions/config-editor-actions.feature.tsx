import { PiCheckSquareOffset, PiFloppyDisk } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { Button, Group } from '@mantine/core'

import { useConfigStoreActions } from '@entitites/dashboard/config/config-store'

import { Props } from './interfaces'

export function ConfigEditorActionsFeature(props: Props) {
    const { editorRef, monacoRef, isConfigValid, isSaving, setIsSaving, setResult } = props
    const actions = useConfigStoreActions()

    const handleSave = () => {
        if (!editorRef.current) return
        if (!monacoRef.current) return
        if (typeof editorRef.current !== 'object') return
        if (typeof monacoRef.current !== 'object') return
        if (!('getValue' in editorRef.current)) return
        if (typeof editorRef.current.getValue !== 'function') return

        const currentValue = editorRef.current.getValue()
        if (currentValue) {
            setIsSaving(true)

            try {
                actions.updateConfig(JSON.parse(currentValue))
                notifications.show({
                    color: 'green',
                    message: 'Config updated successfully. All nodes will be restarted.',
                    title: 'Success'
                })
            } catch (err) {
                setResult(`Error: ${(err as Error).message}`)
                notifications.show({
                    color: 'red',
                    message: `Error: ${(err as Error).message}`,
                    title: 'Error'
                })
            } finally {
                setTimeout(() => {
                    setIsSaving(false)
                }, 300)
            }
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
                Format
            </Button>
            <Button
                disabled={!isConfigValid}
                leftSection={<PiFloppyDisk size={16} />}
                loading={isSaving}
                mb="md"
                onClick={handleSave}
            >
                Save
            </Button>
        </Group>
    )
}
