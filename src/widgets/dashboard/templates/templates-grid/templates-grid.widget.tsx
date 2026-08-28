import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import { PiBracketsAngle } from 'react-icons/pi'

import {
    QueryKeys,
    useDeleteSubscriptionTemplate,
    useReorderSubscriptionTemplates
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { filterByTag, TagFilterBar } from '@shared/ui'
import { MihomoLogo } from '@shared/ui/logos/mihomo-logo'
import { SingboxLogo } from '@shared/ui/logos/singbox-logo'
import { StashLogo } from '@shared/ui/logos/stash-logo'
import { XrayLogo } from '@shared/ui/logos/xray-logo'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'

import {
    useSectionActiveTag,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { TemplatesCardWidget } from '../template-card/templates-card.widget'
import { IProps } from './interfaces'

export function TemplatesGridWidget(props: IProps) {
    const { templates, type } = props

    const sectionKey = `templates:${type}`

    const activeTag = useSectionActiveTag(sectionKey)
    const { setSectionActiveTag } = useViewPreferencesStoreActions()
    const visibleItems = useMemo(
        () => filterByTag(templates ?? [], activeTag),
        [templates, activeTag]
    )

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
                return <MihomoLogo size={22} />
            case 'SINGBOX':
                return <SingboxLogo size={22} />
            case 'STASH':
                return <StashLogo size={22} />
            case 'XRAY_JSON':
                return <XrayLogo size={22} />
            default:
                return <PiBracketsAngle size={22} />
        }
    }, [type])

    return (
        <VirtualizedDndGrid
            enableDnd={activeTag === null}
            header={
                <TagFilterBar
                    activeTag={activeTag}
                    items={templates}
                    onChange={(tag) => setSectionActiveTag(sectionKey, tag)}
                />
            }
            items={visibleItems}
            key={`templates-grid-widget-${type}`}
            onReorder={handleReorder}
            renderDragOverlay={(template) => (
                <TemplatesCardWidget
                    handleDeleteTemplate={handleDeleteTemplate}
                    isDragOverlay
                    template={template}
                    themeLogo={themeLogo}
                />
            )}
            renderItem={(template) => (
                <TemplatesCardWidget
                    disableReordering={activeTag !== null}
                    handleDeleteTemplate={handleDeleteTemplate}
                    template={template}
                    themeLogo={themeLogo}
                />
            )}
            useWindowScroll={true}
        />
    )
}
