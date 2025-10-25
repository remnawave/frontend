import {
    REMNAWAVE_CLIENT_TYPE_BROWSER,
    REMNAWAVE_CLIENT_TYPE_HEADER,
    TestSrrMatcherCommand,
    UpdateSubscriptionSettingsCommand
} from '@remnawave/backend-contract'
import {
    TbBug,
    TbClipboardCopy,
    TbClipboardText,
    TbCut,
    TbDownload,
    TbMenuDeep,
    TbSelectAll
} from 'react-icons/tb'
import {
    ActionIcon,
    Anchor,
    Button,
    CopyButton,
    Group,
    Menu,
    Stack,
    Text,
    Textarea
} from '@mantine/core'
import { PiCheck, PiCheckSquareOffset, PiCopy, PiFloppyDisk } from 'react-icons/pi'
import { useClipboard, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'

import { useDownloadTemplate } from '@shared/ui/load-templates/use-download-template'
import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { useToken } from '@entities/auth/session-store/use-session-store'
import { queryClient } from '@shared/api'

import { Props } from './interfaces'

export function ResponseRulesEditorActionsFeature(props: Props) {
    const {
        editorRef,
        monacoRef,
        isResponseRulesValid,
        setResult,
        setIsResponseRulesValid,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        setOriginalValue,
        subscriptionSettingsUuid
    } = props
    const { t } = useTranslation()
    const token = useToken()

    const isMobile = useMediaQuery('(max-width: 48em)')
    const clipboard = useClipboard({ timeout: 500 })
    const [opened, handlers] = useDisclosure(false)

    const { mutate: updateResponseRulesRes, isPending: isUpdating } = useUpdateSubscriptionSettings(
        {
            mutationFns: {
                onSuccess: async (
                    updatedResponseRules: UpdateSubscriptionSettingsCommand.Response['response']
                ) => {
                    await queryClient.refetchQueries({
                        queryKey: QueryKeys.subscriptionSettings.getSubscriptionSettings.queryKey
                    })

                    setIsResponseRulesValid(true)
                    setHasUnsavedChanges(false)

                    const newValue = JSON.stringify(updatedResponseRules.responseRules, null, 2)

                    if (editorRef.current) {
                        editorRef.current.setValue(newValue)
                        setOriginalValue(newValue)
                    }

                    await queryClient.setQueryData(
                        QueryKeys.subscriptionSettings.getSubscriptionSettings.queryKey,
                        updatedResponseRules
                    )
                },
                onError: (error) => {
                    setIsResponseRulesValid(false)
                    setResult(error.message)
                }
            }
        }
    )

    const { openDownloadModal } = useDownloadTemplate('SRR', editorRef, 'SRR')

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
            updateResponseRulesRes({
                variables: {
                    uuid: subscriptionSettingsUuid,
                    responseRules: JSON.parse(currentValue)
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

    const handleOpenDebugger = () => {
        if (!editorRef.current) return

        const currentValue = editorRef.current.getValue()
        let parsedRules

        try {
            parsedRules = JSON.parse(currentValue)
        } catch {
            notifications.show({
                color: 'red',
                message: t('config-editor-actions.feature.failed-to-save-invalid-json'),
                title: t('config-editor-actions.feature.error')
            })
            return
        }

        const baseUrl = window.location.origin
        const curlCommand = `curl -X 'POST' \\
'${baseUrl}${TestSrrMatcherCommand.TSQ_url}' \\
-H 'accept: application/json' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer ${token}' \\
-H '${REMNAWAVE_CLIENT_TYPE_HEADER}: ${REMNAWAVE_CLIENT_TYPE_BROWSER}' \\
-d '${JSON.stringify({ responseRules: parsedRules }, null, 0)}'`

        modals.open({
            title: t('response-rules-editor-actions.feature.response-rules-debugger'),
            size: 'xl',
            centered: true,
            children: (
                <Stack gap="md">
                    <Stack gap="xs">
                        <Text c="dimmed" size="sm">
                            {t(
                                'response-rules-editor-actions.feature.response-rules-debugger-description-1'
                            )}
                            <br />
                            {t(
                                'response-rules-editor-actions.feature.response-rules-debugger-description-2'
                            )}{' '}
                            <Anchor
                                href="https://www.postman.com/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Postman
                            </Anchor>
                            ,{' '}
                            <Anchor
                                href="https://insomnia.rest/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Insomnia
                            </Anchor>
                            ,{' '}
                            <Anchor
                                href="https://hoppscotch.io/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Hoppscotch
                            </Anchor>
                            {t('response-rules-editor-actions.feature.or')}{' '}
                            <Anchor
                                href="https://httpie.io/cli"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                HTTPie
                            </Anchor>
                            .
                        </Text>
                    </Stack>

                    <Textarea
                        autosize
                        label={t('response-rules-editor-actions.feature.curl-command')}
                        maxRows={10}
                        minRows={10}
                        readOnly
                        styles={{
                            input: {
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }
                        }}
                        value={curlCommand}
                    />

                    <Group justify="flex-end">
                        <Button onClick={() => modals.closeAll()} variant="subtle">
                            {t('common.close')}
                        </Button>
                        <CopyButton value={curlCommand}>
                            {({ copied, copy }) => (
                                <Button
                                    color={copied ? 'teal' : 'blue'}
                                    leftSection={
                                        copied ? <PiCheck size={16} /> : <PiCopy size={16} />
                                    }
                                    onClick={copy}
                                    variant="default"
                                >
                                    {t('response-rules-editor-actions.feature.copy-curl-command')}
                                </Button>
                            )}
                        </CopyButton>
                    </Group>
                </Stack>
            )
        })
    }

    return (
        <Group grow={isMobile} preventGrowOverflow={false} wrap="wrap">
            <Button
                color={!hasUnsavedChanges ? 'gray' : 'teal'}
                disabled={!isResponseRulesValid && !hasUnsavedChanges}
                leftSection={<PiFloppyDisk size={16} />}
                loading={isUpdating}
                onClick={handleSave}
            >
                {t('common.save')}
            </Button>

            <Group gap={0} wrap="nowrap">
                <Menu
                    onClose={() => handlers.close()}
                    onOpen={() => handlers.open()}
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

                        <Menu.Item leftSection={<TbBug size={14} />} onClick={handleOpenDebugger}>
                            {t('response-rules-editor-actions.feature.debugger')}
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
