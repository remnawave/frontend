import { PiBracketsAngle } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import {
    QueryKeys,
    useDeleteSubscriptionTemplate,
    useReorderSubscriptionTemplates
} from '@shared/api/hooks'
import { useResponsiveColumns } from '@shared/hooks/use-responsive-columns'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { SingboxLogo } from '@shared/ui/logos/singbox-logo'
import { MihomoLogo } from '@shared/ui/logos/mihomo-logo'
import { StashLogo } from '@shared/ui/logos/stash-logo'
import { queryClient } from '@shared/api/query-client'
import { XrayLogo } from '@shared/ui/logos/xray-logo'

import { TemplatesCardWidget } from '../template-card/templates-card.widget'
import { IProps } from './interfaces'

export function TemplatesGridWidget(props: IProps) {
    const { templates, templateTitle, type } = props

    const { columnCount } = useResponsiveColumns({})

    const { mutate: deleteTemplate } = useDeleteSubscriptionTemplate({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
                })
            }
        }
    })
    const { mutate: reorderTemplates } = useReorderSubscriptionTemplates({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey,
                    data
                )
            }
        }
    })

    const handleDeleteTemplate = (templateUuid: string) => {
        modals.openConfirmModal({
            title: 'Confirm deletion',
            children: 'Are you sure you want to perform this action? This action cannot be undone.',
            labels: {
                confirm: 'Delete',
                cancel: 'Cancel'
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteTemplate({
                    route: {
                        uuid: templateUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof templates) => {
        reorderTemplates({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    const themeLogo = useMemo(() => {
        switch (type) {
            case 'CLASH':
            case 'MIHOMO':
                return <MihomoLogo size={28} />
            case 'SINGBOX':
                return <SingboxLogo size={28} />
            case 'STASH':
                return <StashLogo size={28} />
            case 'XRAY_JSON':
                return <XrayLogo size={28} />
            default:
                return <PiBracketsAngle size={28} />
        }
    }, [type])

    return (
        <VirtualizedDndGrid
            columnCount={columnCount}
            enableDnd={true}
            items={templates}
            onReorder={handleReorder}
            renderDragOverlay={(template) => (
                <TemplatesCardWidget
                    handleDeleteTemplate={handleDeleteTemplate}
                    isDragOverlay
                    template={template}
                    templateTitle={templateTitle}
                    themeLogo={themeLogo}
                />
            )}
            renderItem={(template) => (
                <TemplatesCardWidget
                    handleDeleteTemplate={handleDeleteTemplate}
                    template={template}
                    templateTitle={templateTitle}
                    themeLogo={themeLogo}
                />
            )}
            useWindowScroll={true}
        />
    )
}
