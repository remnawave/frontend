import { ActionIcon, Badge, Text, Tooltip } from '@mantine/core'
import { GetSharedListsCommand } from '@remnawave/backend-contract'
import { t } from 'i18next'
import { TbTrash } from 'react-icons/tb'

import { ITreeNode, ITreeRowContent } from '@shared/ui/tree-browser'

import classes from './shared-lists.module.css'

export type TSharedList = GetSharedListsCommand.Response['response']['sharedLists'][number]

const TYPE_COLORS: Record<string, string> = {
    ipList: 'cyan',
    asList: 'orange'
}

interface IArgs {
    deletingName: null | string
    isFolder: boolean
    node: ITreeNode<TSharedList>
    onDelete: (name: string) => void
}

export function sharedListRow(args: IArgs): ITreeRowContent {
    const { deletingName, isFolder, node, onDelete } = args

    const sharedList = node.item
    if (!sharedList) return {}

    return {
        actions: (
            <Tooltip label={t('common.action.delete')}>
                <ActionIcon
                    color="red"
                    component="div"
                    loading={deletingName === sharedList.name}
                    onClick={(event) => {
                        event.stopPropagation()
                        onDelete(sharedList.name)
                    }}
                    size="sm"
                    variant="subtle"
                >
                    <TbTrash size={16} />
                </ActionIcon>
            </Tooltip>
        ),

        count: isFolder ? undefined : sharedList.itemsCount,

        description: (
            <Text c="dimmed" ff="monospace" size="xs" truncate="end">
                {`ext:${sharedList.name}`}
            </Text>
        ),

        leading: <span className={classes.dot} />,

        meta: (
            <Badge color={TYPE_COLORS[sharedList.type] ?? 'gray'} size="sm" variant="soft">
                {sharedList.type}
            </Badge>
        )
    }
}
