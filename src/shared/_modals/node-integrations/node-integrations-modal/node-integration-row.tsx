import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { GetNodeIntegrationsCommand } from '@remnawave/backend-contract'
import { t } from 'i18next'
import { TbTrash } from 'react-icons/tb'

import { ITreeNode, ITreeRowContent } from '@shared/ui/tree-browser'

import classes from './node-integrations.module.css'

export type TNodeIntegration =
    GetNodeIntegrationsCommand.Response['response']['nodeIntegrations'][number]

interface IArgs {
    deletingUuid: null | string
    node: ITreeNode<TNodeIntegration>
    onDelete: (uuid: string) => void
}

export function nodeIntegrationRow(args: IArgs): ITreeRowContent {
    const { deletingUuid, node, onDelete } = args

    const integration = node.item
    if (!integration) return {}

    return {
        description: integration.description ? (
            <Text c="dimmed" ff="monospace" size="xs" truncate="end">
                {integration.description}
            </Text>
        ) : undefined,

        leading: <span className={classes.dot} />,

        actions: (
            <Tooltip label={t('common.action.delete')}>
                <ActionIcon
                    color="red"
                    component="div"
                    loading={deletingUuid === integration.uuid}
                    onClick={(event) => {
                        event.stopPropagation()
                        onDelete(integration.uuid)
                    }}
                    size="sm"
                    variant="subtle"
                >
                    <TbTrash size={16} />
                </ActionIcon>
            </Tooltip>
        )
    }
}
