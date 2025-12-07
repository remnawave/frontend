import { Card, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useAddUsersToInternalSquad,
    useDeleteInternalSquad,
    useDeleteUsersFromInternalSquad,
    useGetInternalSquads,
    useReorderInternalSquads
} from '@shared/api/hooks'
import { baseNotificationsMutations } from '@shared/ui/notifications/base-notification-mutations'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'

import { InternalSquadCardWidget } from '../internal-squad-card/internal-squad-card.widget'
import { IProps } from './interfaces'

export function InternalSquadsGridWidget(props: IProps) {
    const { internalSquads } = props
    const { t } = useTranslation()

    const { mutate: reorderInternalSquads } = useReorderInternalSquads({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.internalSquads.getInternalSquads.queryKey, data)
            }
        }
    })

    const { refetch: refetchInternalSquads } = useGetInternalSquads({
        rQueryParams: {
            refetchInterval: sToMs(30)
        }
    })

    const { mutate: deleteInternalSquad } = useDeleteInternalSquad({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
                })
            }
        }
    })

    const { mutate: addUsersToInternalSquad } = useAddUsersToInternalSquad({
        mutationFns: {
            ...baseNotificationsMutations('add-users-to-internal-squad', refetchInternalSquads)
        }
    })

    const { mutate: deleteUsersFromInternalSquad } = useDeleteUsersFromInternalSquad({
        mutationFns: {
            ...baseNotificationsMutations('delete-users-from-internal-squad', refetchInternalSquads)
        }
    })

    const handleDeleteInternalSquad = (internalSquadUuid: string) => {
        modals.openConfirmModal({
            title: t('common.delete'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteInternalSquad({
                    route: {
                        uuid: internalSquadUuid
                    }
                })
            }
        })
    }

    const handleRemoveFromUsers = (internalSquadUuid: string) => {
        modals.openConfirmModal({
            title: t('internal-squads-grid.widget.remove-users'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteUsersFromInternalSquad({
                    route: {
                        uuid: internalSquadUuid
                    }
                })
            }
        })
    }

    const handleAddToUsers = (internalSquadUuid: string) => {
        modals.openConfirmModal({
            title: t('internal-squads-grid.widget.add-users'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.add'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'teal' },
            onConfirm: () => {
                addUsersToInternalSquad({
                    route: {
                        uuid: internalSquadUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof internalSquads) => {
        reorderInternalSquads({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    if (!internalSquads || internalSquads.length === 0) {
        return (
            <Card p="xl" withBorder>
                <Stack align="center" gap="md">
                    <PiEmpty size={48} style={{ opacity: 0.5 }} />
                    <div>
                        <Title c="dimmed" order={4} ta="center">
                            {t('internal-squads-grid.widget.no-internal-squads')}
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            {t(
                                'internal-squads-grid.widget.create-your-first-internal-squad-to-get-started'
                            )}
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <VirtualizedDndGrid
            enableDnd={true}
            items={internalSquads}
            onReorder={handleReorder}
            renderDragOverlay={(internalSquad) => (
                <InternalSquadCardWidget
                    handleAddToUsers={handleAddToUsers}
                    handleDeleteInternalSquad={handleDeleteInternalSquad}
                    handleRemoveFromUsers={handleRemoveFromUsers}
                    internalSquad={internalSquad}
                    isDragOverlay
                />
            )}
            renderItem={(internalSquad) => (
                <InternalSquadCardWidget
                    handleAddToUsers={handleAddToUsers}
                    handleDeleteInternalSquad={handleDeleteInternalSquad}
                    handleRemoveFromUsers={handleRemoveFromUsers}
                    internalSquad={internalSquad}
                />
            )}
            useWindowScroll={true}
        />
    )
}
