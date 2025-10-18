import {
    TbBraces,
    TbClipboardCopy,
    TbClipboardText,
    TbCut,
    TbDownload,
    TbMenuDeep,
    TbSelectAll,
    TbTools
} from 'react-icons/tb'
import { PiCheck, PiCheckSquareOffset, PiCopy, PiFloppyDisk } from 'react-icons/pi'
import { ActionIcon, Button, CopyButton, Group, Menu, Text } from '@mantine/core'
import { useClipboard, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { UpdateConfigProfileCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'

import { KeypairGeneratorWidget } from '@widgets/dashboard/config-profiles/keypair-generator/keypair-generator.widget'
import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useUpdateConfigProfile } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { Props } from './interfaces'

export function ConfigEditorActionsFeature(props: Props) {
    const {
        editorRef,
        monacoRef,
        isConfigValid,
        setResult,
        setIsConfigValid,
        configProfile,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        setOriginalValue
    } = props
    const { t } = useTranslation()

    const isMobile = useMediaQuery('(max-width: 48em)')
    const clipboard = useClipboard({ timeout: 500 })

    const modalsStore = useModalsStore()
    const { open, close, setInternalData } = modalsStore

    const [opened, handlers] = useDisclosure(false)

    const isSnippetsOpen =
        modalsStore.modals[MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER]?.isOpen || false

    const { mutate: updateConfig, isPending: isUpdating } = useUpdateConfigProfile({
        mutationFns: {
            onSuccess: async (
                updatedConfigProfile: UpdateConfigProfileCommand.Response['response']
            ) => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
                })

                setIsConfigValid(true)
                setHasUnsavedChanges(false)

                const newValue = JSON.stringify(updatedConfigProfile.config, null, 2)

                if (editorRef.current) {
                    editorRef.current.setValue(newValue)
                    setOriginalValue(newValue)
                }

                await queryClient.setQueryData(
                    QueryKeys.configProfiles.getConfigProfile({
                        uuid: configProfile.uuid
                    }).queryKey,
                    updatedConfigProfile
                )
            },
            onError: (error) => {
                setIsConfigValid(false)
                setResult(error.message)
            }
        }
    })

    const { openDownloadModal } = useDownloadTemplate('XRAY_JSON', editorRef, 'XRAY_CORE')

    const handleSave = () => {
        if (!editorRef.current) return
        if (!monacoRef.current) return

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
                variables: {
                    uuid: configProfile.uuid,
                    config: JSON.parse(currentValue)
                }
            })
        }
    }

    const handleCopyConfig = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue()
        clipboard.copy(currentValue)
    }

    const handleSelectAll = () => {
        if (!editorRef.current) return

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

        const selection = editorRef.current.getSelection()
        const model = editorRef.current.getModel()
        if (!selection || !model) return

        const selectedText = model.getValueInRange(selection)
        clipboard.copy(selectedText)

        editorRef.current.executeEdits('', [{ range: selection, text: '' }])
    }

    const handlePaste = () => {
        if (!editorRef.current) return

        const position = editorRef.current.getPosition()
        if (!position) return

        navigator.clipboard.readText().then((text) => {
            if (!editorRef.current) return
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

        editorRef.current.getAction('editor.action.formatDocument')?.run()
    }

    return (
        <Group grow={isMobile} preventGrowOverflow={false} wrap="wrap">
            <Button
                color={!hasUnsavedChanges ? 'gray' : 'teal'}
                disabled={!isConfigValid && !hasUnsavedChanges}
                leftSection={<PiFloppyDisk size={16} />}
                loading={isUpdating}
                onClick={handleSave}
            >
                {t('config-editor-actions.feature.save')}
            </Button>

            {!isConfigValid && !isUpdating && (
                <Button
                    color="red"
                    disabled={isConfigValid || isUpdating}
                    leftSection={<PiFloppyDisk size={16} />}
                    loading={isUpdating}
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
            )}

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
                        <CopyButton timeout={2000} value={configProfile.uuid}>
                            {({ copied, copy }) => (
                                <Menu.Item
                                    color={copied ? 'teal' : undefined}
                                    leftSection={
                                        copied ? <PiCheck size={14} /> : <PiCopy size={14} />
                                    }
                                    onClick={copy}
                                >
                                    {t('config-profiles-grid.widget.copy-uuid')}
                                </Menu.Item>
                            )}
                        </CopyButton>

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
                            leftSection={<TbTools size={14} />}
                            onClick={() => {
                                modals.open({
                                    title: t('config-editor-actions.feature.tools'),
                                    centered: true,
                                    children: <KeypairGeneratorWidget />
                                })
                            }}
                        >
                            {t('config-editor-actions.feature.generate-keypair')}
                        </Menu.Item>

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
                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 0,
                        borderLeft: 0,
                        width: '100%'
                    }}
                    variant="default"
                >
                    {t('config-editor-actions.feature.format')}
                </Button>

                <ActionIcon
                    onClick={() => {
                        if (isSnippetsOpen) {
                            close(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)
                        } else {
                            setInternalData({
                                internalState: undefined,
                                modalKey: MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER
                            })
                            open(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)
                        }
                    }}
                    size={36}
                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    }}
                    variant={isSnippetsOpen ? 'filled' : 'default'}
                >
                    <TbBraces size={20} />
                </ActionIcon>
            </Group>
        </Group>
    )
}
