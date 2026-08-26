import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'

import {
    QueryKeys,
    useCloneSubpageConfig,
    useDeleteSubpageConfig,
    useReorderSubpageConfigs
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'

import { SubpageConfigCardWidget } from '../subpage-config-card/subpage-config-card.widget'
import { IProps } from './interfaces'

export function SubpageConfigsGridWidget(props: IProps) {
    const { t } = useTranslation()
    const { configs } = props

    const { mutate: deleteSubpageConfig } = useDeleteSubpageConfig({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.subpageConfigs.getSubpageConfigs.queryKey
                })
            }
        }
    })
    const { mutate: reorderSubpageConfigs } = useReorderSubpageConfigs({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.subpageConfigs.getSubpageConfigs.queryKey, data)
            }
        }
    })

    const { mutate: cloneSubpageConfig } = useCloneSubpageConfig({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.subpageConfigs.getSubpageConfigs.queryKey
                })
            }
        }
    })

    const handleDeleteSubpageConfig = (subpageConfigUuid: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            centered: true,
            onConfirm: () => {
                deleteSubpageConfig({
                    route: {
                        uuid: subpageConfigUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof configs) => {
        reorderSubpageConfigs({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    const handleCloneSubpageConfig = (subpageConfigUuid: string) => {
        cloneSubpageConfig({
            variables: {
                cloneFromUuid: subpageConfigUuid
            }
        })
    }

    return (
        <VirtualizedDndGrid
            enableDnd={true}
            items={configs}
            key={`subpage-configs-grid-widget`}
            onReorder={handleReorder}
            renderDragOverlay={(subpageConfig) => (
                <SubpageConfigCardWidget
                    handleCloneSubpageConfig={handleCloneSubpageConfig}
                    handleDeleteSubpageConfig={handleDeleteSubpageConfig}
                    isDragOverlay
                    subpageConfig={subpageConfig}
                />
            )}
            renderItem={(subpageConfig) => (
                <SubpageConfigCardWidget
                    handleCloneSubpageConfig={handleCloneSubpageConfig}
                    handleDeleteSubpageConfig={handleDeleteSubpageConfig}
                    subpageConfig={subpageConfig}
                />
            )}
            useWindowScroll={true}
        />
    )
}
