import type { editor } from 'monaco-editor'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { MonacoSetupSharedListEditorFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { Box, Button, Group, Modal, Paper, Stack, Text, TextInput } from '@mantine/core'
import { useMonaco } from '@monaco-editor/react'
import { CreateSharedListCommand } from '@remnawave/backend-contract'
import { SharedListConfigSchema } from '@remnawave/node-plugins'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbList } from 'react-icons/tb'

import { openApplyToNodesModal } from '@shared/_modals/universal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useCreateSharedList,
    useGetSharedList,
    useSyncSharedList,
    useUpdateSharedList
} from '@shared/api/hooks'
import { COMPACT_MONACO_OPTIONS } from '@shared/constants/monaco-theme'
import { usePseudoFullscreen } from '@shared/hooks'
import { CodeEditor, editorClasses, EditorFooter, EditorStatusBar } from '@shared/ui/code-editor'
import { fullscreenClasses, FullscreenToggleButton } from '@shared/ui/fullscreen-toggle-button'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { forceMonacoRetokenize } from '@shared/utils/monaco/force-retokenize'

import classes from './SharedListEditor.module.css'

const EMPTY_CONFIG = JSON.stringify({ type: 'ipList', items: [] }, null, 2)

interface IProps {
    name?: string
}

export const SharedListEditorModal = NiceModal.create((props: IProps) => {
    const { name } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const monaco = useMonaco()
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const isEditMode = Boolean(name)

    const [listName, setListName] = useState(name ?? '')
    const [nameError, setNameError] = useState<null | string>(null)
    const [error, setError] = useState<null | string>(null)

    const { data: sharedList, isLoading } = useGetSharedList({
        route: { name: name ?? '' },
        rQueryParams: { enabled: isEditMode }
    })

    useEffect(() => {
        if (!monaco) return

        MonacoSetupSharedListEditorFeature.setup()
    }, [monaco])

    const initialValue = sharedList ? JSON.stringify(sharedList.config, null, 2) : EMPTY_CONFIG

    const invalidateSharedLists = () => {
        queryClient.refetchQueries({
            queryKey: QueryKeys.nodePlugins.getSharedLists.queryKey
        })

        if (name) {
            queryClient.refetchQueries({
                queryKey: QueryKeys.nodePlugins.getSharedList({ name }).queryKey
            })
        }
    }

    const { mutate: syncSharedList } = useSyncSharedList()

    const { mutate: createSharedList, isPending: isCreatePending } = useCreateSharedList({
        mutationFns: {
            onSuccess: () => {
                invalidateSharedLists()
                hide()
            }
        }
    })

    const { mutate: updateSharedList, isPending: isUpdatePending } = useUpdateSharedList({
        mutationFns: {
            onSuccess: () => {
                invalidateSharedLists()
                hide()
            }
        }
    })

    const openSyncChoiceModal = (variables: CreateSharedListCommand.RequestBody) => {
        openApplyToNodesModal({
            IconComponent: TbList,
            iconColor: 'indigo',
            onApply: () =>
                updateSharedList({
                    variables,
                    mutationFns: {
                        onSuccess: () => syncSharedList({ variables: { name: variables.name } })
                    }
                }),
            onLater: () => updateSharedList({ variables })
        })
    }

    const handleSave = () => {
        if (!editorRef.current) return

        const parsedName = CreateSharedListCommand.RequestBodySchema.shape.name.safeParse(
            listName.trim()
        )

        if (!parsedName.success) {
            setNameError(parsedName.error.issues[0].message)
            return
        }

        setNameError(null)

        let parsed: unknown

        try {
            parsed = JSON.parse(editorRef.current.getValue().trim() || EMPTY_CONFIG)
        } catch {
            setError(t('base-host-form.invalid-json'))
            return
        }

        const result = SharedListConfigSchema.safeParse(parsed)

        if (!result.success) {
            const issue = result.error.issues[0]
            setError(`${issue.path.join('.') || 'config'}: ${issue.message}`)
            return
        }

        const variables = {
            name: parsedName.data,
            config: result.data
        }

        if (isEditMode) {
            openSyncChoiceModal(variables)
            return
        }

        createSharedList({ variables })
    }

    return (
        <Modal
            {...modalProps}
            size="900px"
            transitionProps={{ transition: 'fade', duration: 200 }}
            title={
                <BaseOverlayHeader
                    iconColor="indigo"
                    IconComponent={TbList}
                    iconVariant="soft"
                    title={isEditMode ? `ext:${listName}` : t('common.create')}
                    withCopy={isEditMode}
                />
            }
        >
            {isEditMode && isLoading && <LoaderModalShared h="50vh" />}

            {(!isEditMode || !isLoading) && (
                <Stack gap="md">
                    {!isEditMode && (
                        <TextInput
                            description={t('shared-lists.editor.name-description')}
                            error={nameError}
                            label={t('common.name')}
                            leftSection={
                                <Text c="dimmed" ff="monospace" size="xs">
                                    ext:
                                </Text>
                            }
                            leftSectionWidth={44}
                            onChange={(event) => setListName(event.currentTarget.value)}
                            placeholder="blocked_ips"
                            required
                            value={listName}
                        />
                    )}

                    <Box
                        className={clsx(
                            classes.container,
                            isFullscreen && fullscreenClasses.overlay
                        )}
                    >
                        <Paper
                            style={{
                                border: error
                                    ? '1px solid var(--mantine-color-red-5)'
                                    : '1px solid var(--mantine-color-dark-4)',
                                overflow: 'hidden'
                            }}

                            className={clsx(
                                classes.editorWrapper,
                                editorClasses.editorAttached,
                                isFullscreen && fullscreenClasses.fill
                            )}
                            p={0}
                            pos="relative"
                            withBorder
                        >
                            <CodeEditor
                                defaultLanguage="json"
                                footer={
                                    error && (
                                        <EditorStatusBar status="error">{error}</EditorStatusBar>
                                    )
                                }
                                onChange={() => setError(null)}
                                onMount={(editorInstance) => {
                                    editorRef.current = editorInstance

                                    forceMonacoRetokenize(editorInstance)
                                }}
                                options={COMPACT_MONACO_OPTIONS}
                                path="shared-list://*"
                                value={initialValue}
                            />
                        </Paper>

                        <EditorFooter className={clsx(error && classes.footerError)}>
                            <FullscreenToggleButton
                                floating={false}
                                isFullscreen={isFullscreen}
                                onToggle={toggleFullscreen}
                                size={36}
                            />

                            <Group gap="sm">
                                <Button
                                    loading={isCreatePending || isUpdatePending}
                                    onClick={handleSave}
                                    variant="soft"
                                >
                                    {t('common.save')}
                                </Button>
                                <Button onClick={hide} variant="subtle">
                                    {t('common.cancel')}
                                </Button>
                            </Group>
                        </EditorFooter>
                    </Box>
                </Stack>
            )}
        </Modal>
    )
})
