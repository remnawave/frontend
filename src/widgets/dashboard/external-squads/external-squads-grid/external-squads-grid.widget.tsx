import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbWebhook } from 'react-icons/tb'

import {
    QueryKeys,
    useAddUsersToExternalSquad,
    useCreateExternalSquad,
    useDeleteExternalSquad,
    useDeleteUsersFromExternalSquad,
    useGetExternalSquads,
    useReorderExternalSquads,
    useUpdateExternalSquad
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { filterByTag, TagFilterBar } from '@shared/ui'
import { baseNotificationsMutations } from '@shared/ui/notifications/base-notification-mutations'
import { SectionCard } from '@shared/ui/section-card'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { cloneString } from '@shared/utils/misc'
import { sToMs } from '@shared/utils/time-utils'

import {
    useSectionActiveTag,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { ExternalSquadCardWidget } from '../external-squad-card/external-squad-card.widget'
import { IProps } from './interfaces'

export function ExternalSquadsGridWidget(props: IProps) {
    const { externalSquads } = props

    const activeTag = useSectionActiveTag('externalSquads')
    const { setSectionActiveTag } = useViewPreferencesStoreActions()
    const visibleItems = useMemo(
        () => filterByTag(externalSquads ?? [], activeTag),
        [externalSquads, activeTag]
    )

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

    const { mutateAsync: createExternalSquad } = useCreateExternalSquad()
    const { mutateAsync: updateExternalSquad } = useUpdateExternalSquad()

    const handleDeleteExternalSquad = (externalSquadUuid: string) => {
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
            title: t('common.action.confirm-action'),
            centered: true,
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.remove'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
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
            title: t('common.action.confirm-action'),
            centered: true,
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.add'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'teal', variant: 'soft' },
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

    const handleCloneExternalSquad = async (externalSquadUuid: string) => {
        const { data } = await refetchExternalSquads()

        if (!data) {
            return
        }

        const externalSquad = data.externalSquads.find((squad) => squad.uuid === externalSquadUuid)

        if (!externalSquad) {
            return
        }

        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            centered: true,
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.clone'),
                cancel: t('common.action.cancel')
            },
            cancelProps: {
                variant: 'subtle'
            },
            confirmProps: {
                color: 'cyan',
                variant: 'soft'
            },
            onConfirm: async () => {
                try {
                    const created = await createExternalSquad({
                        variables: { name: cloneString(externalSquad.name, 30, 'cl_') }
                    })

                    await updateExternalSquad({
                        variables: {
                            ...externalSquad,
                            uuid: created.uuid,
                            name: created.name,
                            subscriptionSettings: externalSquad.subscriptionSettings ?? undefined,
                            hostOverrides: externalSquad.hostOverrides ?? undefined
                        }
                    })

                    refetchExternalSquads()
                } catch {
                    //
                }
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
                enableDnd={activeTag === null}
                header={
                    <TagFilterBar
                        activeTag={activeTag}
                        items={externalSquads}
                        onChange={(tag) => setSectionActiveTag('externalSquads', tag)}
                    />
                }
                items={visibleItems}
                onReorder={handleReorder}
                renderDragOverlay={(externalSquad) => (
                    <ExternalSquadCardWidget
                        externalSquad={externalSquad}
                        handleAddToUsers={handleAddToUsers}
                        handleCloneExternalSquad={handleCloneExternalSquad}
                        handleDeleteExternalSquad={handleDeleteExternalSquad}
                        handleRemoveFromUsers={handleRemoveFromUsers}
                        isDragOverlay
                    />
                )}
                renderItem={(externalSquad) => (
                    <ExternalSquadCardWidget
                        disableReordering={activeTag !== null}
                        externalSquad={externalSquad}
                        handleAddToUsers={handleAddToUsers}
                        handleCloneExternalSquad={handleCloneExternalSquad}
                        handleDeleteExternalSquad={handleDeleteExternalSquad}
                        handleRemoveFromUsers={handleRemoveFromUsers}
                    />
                )}
                useWindowScroll={true}
            />
        </>
    )
}
