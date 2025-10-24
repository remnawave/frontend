import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useAddUsersToInternalSquad,
    useDeleteInternalSquad,
    useDeleteUsersFromInternalSquad,
    useGetInternalSquads
} from '@shared/api/hooks'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { baseNotificationsMutations } from '@shared/ui/notifications/base-notification-mutations'
import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'

import { InternalSquadCardWidget } from '../internal-squad-card/internal-squad-card.widget'
import { IProps } from './interfaces'

export function InternalSquadsGridWidget(props: IProps) {
    const { internalSquads } = props
    const { t } = useTranslation()

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

    const handleDeleteInternalSquad = (internalSquadUuid: string, internalSquadName: string) => {
        modals.openConfirmModal({
            title: t('internal-squads-grid.widget.delete-internal-squad'),
            children: (
                <Text size="sm">
                    {t('internal-squads-grid.widget.delete-internal-squad-confirmation', {
                        internalSquadName
                    })}
                    <br />
                    {t('internal-squads-grid.widget.this-action-cannot-be-undone')}
                </Text>
            ),
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

    const handleRemoveFromUsers = (internalSquadUuid: string, internalSquadName: string) => {
        modals.openConfirmModal({
            title: t('internal-squads-grid.widget.remove-users'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t(
                            'internal-squads-grid.widget.remove-users-from-internal-squad-confirmation',
                            {
                                internalSquadName
                            }
                        )}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('internal-squads-grid.widget.this-action-cannot-be-undone')}
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: t('common.remove'),
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

    const handleAddToUsers = (internalSquadUuid: string, internalSquadName: string) => {
        modals.openConfirmModal({
            title: t('internal-squads-grid.widget.add-users'),
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        {t('internal-squads-grid.widget.add-users-to-internal-squad-confirmation', {
                            internalSquadName
                        })}
                    </Text>
                    <Text fw={600} size="sm">
                        {t('internal-squads-grid.widget.this-action-cannot-be-undone')}
                    </Text>
                </Stack>
            ),
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

    const isHighCount = internalSquads.length > 6

    return (
        <SimpleGrid
            cols={{
                base: 1,
                '800px': 2,
                '1000px': 3,
                '1200px': 4,
                '1800px': 5,
                '2400px': 6,
                '3000px': 7
            }}
            type="container"
        >
            {internalSquads.map((internalSquad, index) => (
                <InternalSquadCardWidget
                    handleAddToUsers={handleAddToUsers}
                    handleDeleteInternalSquad={handleDeleteInternalSquad}
                    handleRemoveFromUsers={handleRemoveFromUsers}
                    index={index}
                    internalSquad={internalSquad}
                    isHighCount={isHighCount}
                    key={internalSquad.uuid}
                />
            ))}

            <InternalSquadsDrawerWithStore />
        </SimpleGrid>
    )
}
