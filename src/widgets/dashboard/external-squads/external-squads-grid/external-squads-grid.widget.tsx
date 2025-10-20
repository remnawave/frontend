import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useAddUsersToExternalSquad,
    useDeleteExternalSquad,
    useDeleteUsersFromExternalSquad,
    useGetExternalSquads
} from '@shared/api/hooks'
import { baseNotificationsMutations } from '@shared/ui/notifications/base-notification-mutations'
import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'

import { ExternalSquadCardWidget } from '../external-squad-card/external-squad-card.widget'
import { ExternalSquadsDrawer } from '../external-squads-drawer'
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
            title: t('external-squads-grid.widget.confirm-deletion'),
            children: t('external-squads-grid.widget.confirm-deletion-decription-1'),
            labels: {
                confirm: t('external-squads-grid.widget.delete'),
                cancel: t('external-squads-grid.widget.cancel')
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
            title: t('external-squads-grid.widget.confirm-action'),
            centered: true,
            children: t('external-squads-grid.widget.confirm-action-description-2'),
            labels: {
                confirm: t('external-squads-grid.widget.remove'),
                cancel: t('external-squads-grid.widget.cancel')
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
            title: t('external-squads-grid.widget.confirm-action'),
            centered: true,
            children: t('external-squads-grid.widget.confirm-action-description-2'),
            labels: {
                confirm: t('external-squads-grid.widget.add'),
                cancel: t('external-squads-grid.widget.cancel')
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

    const isHighCount = externalSquads.length > 6

    return (
        <SimpleGrid
            cols={{ base: 1, '800px': 2, '1200px': 4, '1800px': 5, '2400px': 6, '3000px': 7 }}
            type="container"
        >
            {externalSquads.map((externalSquad, index) => (
                <ExternalSquadCardWidget
                    externalSquad={externalSquad}
                    handleAddToUsers={handleAddToUsers}
                    handleDeleteExternalSquad={handleDeleteExternalSquad}
                    handleRemoveFromUsers={handleRemoveFromUsers}
                    index={index}
                    isHighCount={isHighCount}
                    key={externalSquad.uuid}
                />
            ))}

            <ExternalSquadsDrawer />
        </SimpleGrid>
    )
}
