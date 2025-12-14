import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useDeleteSubscriptionPageConfig,
    useReorderSubscriptionPageConfigs
} from '@shared/api/hooks'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'

import { SubpageConfigCardWidget } from '../subpage-config-card/subpage-config-card.widget'
import { IProps } from './interfaces'

export function SubpageConfigsGridWidget(props: IProps) {
    const { t } = useTranslation()
    const { configs } = props

    const { mutate: deleteSubpageConfig } = useDeleteSubscriptionPageConfig({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.subpageConfigs.getSubscriptionPageConfigs.queryKey
                })
            }
        }
    })
    const { mutate: reorderSubpageConfigs } = useReorderSubscriptionPageConfigs({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys.subpageConfigs.getSubscriptionPageConfigs.queryKey,
                    data
                )
            }
        }
    })

    const handleDeleteSubpageConfig = (subpageConfigUuid: string) => {
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

    return (
        <VirtualizedDndGrid
            enableDnd={true}
            items={configs}
            key={`subpage-configs-grid-widget`}
            onReorder={handleReorder}
            renderDragOverlay={(subpageConfig) => (
                <SubpageConfigCardWidget
                    handleDeleteSubpageConfig={handleDeleteSubpageConfig}
                    isDragOverlay
                    subpageConfig={subpageConfig}
                />
            )}
            renderItem={(subpageConfig) => (
                <SubpageConfigCardWidget
                    handleDeleteSubpageConfig={handleDeleteSubpageConfig}
                    subpageConfig={subpageConfig}
                />
            )}
            useWindowScroll={true}
        />
    )
}
