import { GetNodePluginsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useCloneNodePlugin,
    useDeleteNodePlugin,
    useReorderNodePlugins
} from '@shared/api/hooks'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'

import { NodePluginCardWidget } from '../node-plugin-card/node-plugin-card.widget'

interface IProps {
    plugins: GetNodePluginsCommand.Response['response']['nodePlugins']
}

export function NodePluginsGridWidget(props: IProps) {
    const { t } = useTranslation()
    const { plugins } = props

    const { mutate: deleteNodePlugin } = useDeleteNodePlugin({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
                })
            }
        }
    })
    const { mutate: reorderNodePlugins } = useReorderNodePlugins({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.nodePlugins.getNodePlugins.queryKey, data)
            }
        }
    })

    const { mutate: cloneNodePlugin } = useCloneNodePlugin({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
                })
            }
        }
    })

    const handleDeleteNodePlugin = (nodePluginUuid: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteNodePlugin({
                    route: {
                        uuid: nodePluginUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof plugins) => {
        reorderNodePlugins({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    const handleCloneNodePlugin = (nodePluginUuid: string) => {
        cloneNodePlugin({
            variables: {
                cloneFromUuid: nodePluginUuid
            }
        })
    }

    return (
        <VirtualizedDndGrid
            enableDnd={true}
            items={plugins}
            key={`node-plugins-grid-widget`}
            onReorder={handleReorder}
            renderDragOverlay={(nodePlugin) => (
                <NodePluginCardWidget
                    handleCloneNodePlugin={handleCloneNodePlugin}
                    handleDeleteNodePlugin={handleDeleteNodePlugin}
                    isDragOverlay
                    nodePlugin={nodePlugin}
                />
            )}
            renderItem={(nodePlugin) => (
                <NodePluginCardWidget
                    handleCloneNodePlugin={handleCloneNodePlugin}
                    handleDeleteNodePlugin={handleDeleteNodePlugin}
                    nodePlugin={nodePlugin}
                />
            )}
            useWindowScroll={true}
        />
    )
}
