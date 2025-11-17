import { Card, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useAddUsersToExternalSquad,
    useDeleteExternalSquad,
    useDeleteUsersFromExternalSquad,
    useGetExternalSquads,
    useReorderExternalSquads
} from '@shared/api/hooks'
import { baseNotificationsMutations } from '@shared/ui/notifications/base-notification-mutations'
import { useResponsiveColumns } from '@shared/hooks/use-responsive-columns'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'

import { ExternalSquadCardWidget } from '../external-squad-card/external-squad-card.widget'
import { IProps } from './interfaces'

export function ExternalSquadsGridWidget(props: IProps) {
    const { externalSquads } = props

    const { t } = useTranslation()
    const { columnCount } = useResponsiveColumns({})

    const { refetch: refetchExternalSquads } = useGetExternalSquads({
        rQueryParams: {
            refetchInterval: sToMs(30)
        }
    })

    const { mutate: deleteExternalSquad } = useDeleteExternalSquad({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey
                })
            }
        }
    })

    const { mutate: reorderExternalSquads } = useReorderExternalSquads({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.externalSquads.getExternalSquads.queryKey, data)
            }
        }
    })

    const { mutate: addUsersToExternalSquad } = useAddUsersToExternalSquad({
        mutationFns: {
            ...baseNotificationsMutations('add-users-to-external-squad', refetchExternalSquads)
        }
    })

    const { mutate: deleteUsersFromExternalSquad } = useDeleteUsersFromExternalSquad({
        mutationFns: {
            ...baseNotificationsMutations('delete-users-from-external-squad', refetchExternalSquads)
        }
    })

    const handleDeleteExternalSquad = (externalSquadUuid: string) => {
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
                deleteExternalSquad({
                    route: {
                        uuid: externalSquadUuid
                    }
                })
            }
        })
    }

    const handleRemoveFromUsers = (externalSquadUuid: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.remove'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteUsersFromExternalSquad({
                    route: {
                        uuid: externalSquadUuid
                    }
                })
            }
        })
    }

    const handleAddToUsers = (externalSquadUuid: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.add'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'teal' },
            onConfirm: () => {
                addUsersToExternalSquad({
                    route: {
                        uuid: externalSquadUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof externalSquads) => {
        reorderExternalSquads({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    if (!externalSquads || externalSquads.length === 0) {
        return (
            <Card bg="dark.6" h="100%" p="xl" withBorder>
                <Stack align="center" gap="md">
                    <PiEmpty size={48} style={{ opacity: 0.5 }} />
                    <Stack gap="xs">
                        <Title c="dimmed" order={4} ta="center">
                            {t('external-squads-grid.widget.no-external-squads')}
                        </Title>

                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            {t('external-squads-grid.widget.no-external-squads-line-1')}
                            <br />
                            {t('external-squads-grid.widget.no-external-squads-line-2')}
                            <br />
                            {t('external-squads-grid.widget.no-external-squads-line-3')}
                        </Text>
                    </Stack>
                </Stack>
            </Card>
        )
    }

    return (
        <>
            <VirtualizedDndGrid
                columnCount={columnCount}
                enableDnd={true}
                items={externalSquads}
                onReorder={handleReorder}
                renderDragOverlay={(externalSquad) => (
                    <ExternalSquadCardWidget
                        externalSquad={externalSquad}
                        handleAddToUsers={handleAddToUsers}
                        handleDeleteExternalSquad={handleDeleteExternalSquad}
                        handleRemoveFromUsers={handleRemoveFromUsers}
                        isDragOverlay
                    />
                )}
                renderItem={(externalSquad) => (
                    <ExternalSquadCardWidget
                        externalSquad={externalSquad}
                        handleAddToUsers={handleAddToUsers}
                        handleDeleteExternalSquad={handleDeleteExternalSquad}
                        handleRemoveFromUsers={handleRemoveFromUsers}
                    />
                )}
                useWindowScroll={true}
            />
        </>
    )
}
