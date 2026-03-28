import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbWebhook } from 'react-icons/tb'
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
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'
import { SectionCard } from '@shared/ui/section-card'
import { sToMs } from '@shared/utils/time-utils'

import { ExternalSquadCardWidget } from '../external-squad-card/external-squad-card.widget'
import { IProps } from './interfaces'

export function ExternalSquadsGridWidget(props: IProps) {
    const { externalSquads } = props

    const { t } = useTranslation()

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
            <SectionCard.Root p="xl">
                <SectionCard.Section>
                    <Center py="xl">
                        <Stack align="center" gap="lg">
                            <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                <TbWebhook size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap="xs">
                                <Text fw={600} size="lg" ta="center">
                                    {t('external-squads-grid.widget.no-external-squads')}
                                </Text>
                                <Text c="dimmed" size="sm" ta="center">
                                    {t('external-squads-grid.widget.no-external-squads-line-1')}
                                    <br />
                                    {t('external-squads-grid.widget.no-external-squads-line-2')}
                                    <br />
                                    {t('external-squads-grid.widget.no-external-squads-line-3')}
                                </Text>
                            </Stack>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <>
            <VirtualizedDndGrid
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
