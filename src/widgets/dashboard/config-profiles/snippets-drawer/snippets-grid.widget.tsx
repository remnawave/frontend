import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Center,
    Code,
    CopyButton,
    Divider,
    Group,
    SimpleGrid,
    Stack,
    Text
} from '@mantine/core'
import { GetSnippetsCommand, UpdateSnippetCommand } from '@remnawave/backend-contract'
import { TbBraces, TbCode, TbTrash } from 'react-icons/tb'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import { t } from 'i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useDeleteSnippet } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { EDIT_SNIPPET_MODAL_ID, EditSnippetModal } from './edit-snippet.modal'
import classes from './SnippetsDrawer.module.css'

interface IProps {
    snippets: GetSnippetsCommand.Response['response'] | undefined
}

export const SnippetsGridWidget = (props: IProps) => {
    const { snippets } = props

    const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: QueryKeys.snippets.getSnippets.queryKey })
            }
        }
    })

    const handleDelete = (name: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            centered: true,
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteSnippet({
                    variables: {
                        name
                    }
                })
            }
        })
    }

    const getSnippetPreview = (snippet: unknown) => {
        if (!Array.isArray(snippet)) return []
        return snippet.slice(0, 3)
    }

    const getSnippetLength = (snippet: unknown) => {
        if (!Array.isArray(snippet)) return 0
        return snippet.length
    }

    const handleEditModal = (
        snippet: UpdateSnippetCommand.Response['response']['snippets'][number]
    ) => {
        modals.open({
            modalId: EDIT_SNIPPET_MODAL_ID,
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.edit-snippet')}
                />
            ),
            centered: true,
            size: 'lg',
            children: <EditSnippetModal snippet={snippet} />
        })
    }

    if (!snippets || snippets.snippets.length === 0) {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <TbCode opacity={0.3} size={48} />
                    <Text c="dimmed" size="sm">
                        {t('snippets.drawer.widget.no-snippets-yet')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    return (
        <SimpleGrid
            cols={{
                base: 1,
                '800px': 2,
                '1000px': 3,
                '1200px': 4,
                '1800px': 5,
                '2400px': 6,
                '3000px': 7
            }}
            spacing="xs"
            type="container"
        >
            {snippets.snippets.map((snippet) => {
                const snippetLength = getSnippetLength(snippet.snippet)
                const preview = getSnippetPreview(snippet.snippet)

                return (
                    <Card
                        className={classes.snippetCard}
                        key={snippet.name}
                        onClick={() => handleEditModal(snippet)}
                        padding="sm"
                        shadow="sm"
                        withBorder
                    >
                        <Stack gap="xs">
                            <Group gap="xs" justify="space-between" wrap="nowrap">
                                <Group gap={6} style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                                    <TbBraces
                                        color="var(--mantine-color-blue-5)"
                                        size={16}
                                        style={{ flexShrink: 0 }}
                                    />

                                    <CopyButton timeout={1500} value={snippet.name}>
                                        {({ copied, copy }) => (
                                            <Text
                                                fw={500}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    copy()
                                                }}
                                                size="sm"
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'copy',
                                                    flex: 1,
                                                    minWidth: 0,
                                                    transition: 'color 0.1s ease',
                                                    color: copied
                                                        ? 'var(--mantine-color-teal-4)'
                                                        : 'inherit'
                                                }}
                                            >
                                                {snippet.name}
                                            </Text>
                                        )}
                                    </CopyButton>

                                    <Badge
                                        color="blue"
                                        radius="sm"
                                        size="md"
                                        style={{ flexShrink: 0 }}
                                        variant="default"
                                    >
                                        {snippetLength}
                                    </Badge>
                                </Group>

                                <Group gap={4} wrap="nowrap">
                                    <CopyButton
                                        timeout={2000}
                                        value={JSON.stringify(snippet.snippet || [], null, 2)}
                                    >
                                        {({ copied, copy }) => (
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    copy()
                                                }}
                                                size="sm"
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size="16px" />
                                                ) : (
                                                    <PiCopy size="16px" />
                                                )}
                                            </ActionIcon>
                                        )}
                                    </CopyButton>

                                    <ActionIcon
                                        color="red"
                                        loading={isDeleting}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(snippet.name)
                                        }}
                                        size="sm"
                                        variant="subtle"
                                    >
                                        <TbTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>

                            {preview.length > 0 && (
                                <>
                                    <Divider />
                                    <Stack gap={4}>
                                        {preview.map((item, idx) => (
                                            <Box key={idx}>
                                                <Code
                                                    block
                                                    style={{
                                                        fontSize: '11px',
                                                        maxWidth: '100%',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {JSON.stringify(item)}
                                                </Code>
                                            </Box>
                                        ))}
                                        {snippetLength > 3 && (
                                            <Text c="dimmed" fs="italic" size="xs">
                                                +{snippetLength - 3}{' '}
                                                {t('snippets.drawer.widget.more-items')}
                                            </Text>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Card>
                )
            })}
        </SimpleGrid>
    )
}
