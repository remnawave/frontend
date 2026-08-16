import { ActionIcon, Badge, Box, Group, Text, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetSharedListsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbListNumbers, TbTrash } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteSharedList } from '@shared/api/hooks'

import classes from './shared-lists.module.css'

const TYPE_COLORS: Record<string, string> = {
    ipList: 'cyan',
    asList: 'orange'
}

interface IProps {
    sharedList: GetSharedListsCommand.Response['response']['sharedLists'][number]
}

export const SharedListItem = (props: IProps) => {
    const { sharedList } = props
    const { t } = useTranslation()

    const { type, itemsCount } = sharedList

    const { mutate: deleteSharedList, isPending: isDeleting } = useDeleteSharedList({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getSharedLists.queryKey
                })
            }
        }
    })

    const handleDelete = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('shared-lists.modal.delete-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            centered: true,
            onConfirm: () => deleteSharedList({ route: { name: sharedList.name } })
        })
    }

    const openEditor = () =>
        showModal('sharedLists_sharedListEditorModal', { name: sharedList.name })

    return (
        <Box
            className={classes.sharedListRow}
            onClick={openEditor}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openEditor()
                }
            }}
            role="button"
            tabIndex={0}
        >
            <Group gap="sm" style={{ minWidth: 0 }} wrap="nowrap">
                <Box
                    style={{
                        background: 'var(--mantine-color-indigo-5)',
                        borderRadius: '50%',
                        flexShrink: 0,
                        height: 8,
                        width: 8
                    }}
                />
                <Text ff="monospace" fw={500} size="sm" truncate="end">
                    {`ext:${sharedList.name}`}
                </Text>
            </Group>

            <Group gap="xs" wrap="nowrap">
                <Badge color={TYPE_COLORS[type] ?? 'gray'} size="sm" variant="soft">
                    {type}
                </Badge>
                <Badge
                    color="indigo"
                    leftSection={<TbListNumbers size={12} />}
                    size="sm"
                    variant="soft"
                >
                    {itemsCount}
                </Badge>
            </Group>

            <Tooltip label={t('common.delete')}>
                <ActionIcon
                    color="red"
                    loading={isDeleting}
                    onClick={(event) => {
                        event.stopPropagation()
                        handleDelete()
                    }}
                    size="md"
                    variant="subtle"
                >
                    <TbTrash size={18} />
                </ActionIcon>
            </Tooltip>
        </Box>
    )
}
