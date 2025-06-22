import {
    PiCheck,
    PiCircle,
    PiCopy,
    PiEmpty,
    PiMinus,
    PiPencilDuotone,
    PiPlus,
    PiPulse,
    PiTag,
    PiTrashDuotone,
    PiUsers
} from 'react-icons/pi'
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Divider,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
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
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api/query-client'
import { sToMs } from '@shared/utils/time-utils'
import { formatInt } from '@shared/utils/misc'

import { IProps } from './interfaces'

export function InternalSquadsGridWidget(props: IProps) {
    const { internalSquads } = props

    const { refetch: refetchInternalSquads } = useGetInternalSquads({
        rQueryParams: {
            refetchInterval: sToMs(30)
        }
    })

    const { open, setInternalData } = useModalsStore()

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
            ...baseNotificationsMutations('add-users-to-internal-squad', refetchInternalSquads),
            onMutate: undefined
        }
    })

    const { mutate: deleteUsersFromInternalSquad } = useDeleteUsersFromInternalSquad({
        mutationFns: {
            ...baseNotificationsMutations(
                'delete-users-from-internal-squad',
                refetchInternalSquads
            ),
            onMutate: undefined
        }
    })

    const handleDeleteInternalSquad = (internalSquadUuid: string, internalSquadName: string) => {
        modals.openConfirmModal({
            title: 'Delete Internal Squad',
            children: (
                <Text size="sm">
                    Are you sure you want to delete the internal squad "{internalSquadName}"? This
                    action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
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
            title: 'Remove Users from Internal Squad',
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        Are you sure you want to remove the users from the internal squad "
                        {internalSquadName}"?
                    </Text>
                    <Text fw={600} size="sm">
                        This action cannot be undone.
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: 'Remove',
                cancel: 'Cancel'
            },
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
            title: 'Add Users to Internal Squad',
            centered: true,
            children: (
                <Stack gap="xs">
                    <Text fw={800} size="sm">
                        Are you sure you want to add the users to the internal squad "
                        {internalSquadName}"?
                    </Text>
                    <Text fw={600} size="sm">
                        This action cannot be undone.
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: 'Add',
                cancel: 'Cancel'
            },
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
            <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                    <PiEmpty size={48} style={{ opacity: 0.5 }} />
                    <div>
                        <Title c="dimmed" order={4} ta="center">
                            No Internal Squads
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            Create your first internal squad to get started
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <Grid>
            {internalSquads.map((internalSquad) => {
                const { membersCount } = internalSquad.info
                const { inboundsCount } = internalSquad.info
                const isActive = membersCount > 0

                return (
                    <Grid.Col key={internalSquad.uuid} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            h="100%"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                            padding="lg"
                            radius="md"
                            shadow="sm"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            withBorder
                        >
                            <Box
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    backgroundColor: isActive
                                        ? 'var(--mantine-color-teal-5)'
                                        : 'var(--mantine-color-gray-5)'
                                }}
                            />

                            <Stack gap="md" style={{ flex: 1 }}>
                                <Group gap="sm" justify="space-between" wrap="nowrap">
                                    <Group gap="sm" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                                        <ActionIcon
                                            color={isActive ? 'teal' : 'gray'}
                                            radius="md"
                                            size="sm"
                                            variant="light"
                                        >
                                            {isActive ? (
                                                <PiPulse size={14} />
                                            ) : (
                                                <PiCircle size={14} />
                                            )}
                                        </ActionIcon>
                                        <Text
                                            fw={600}
                                            lineClamp={1}
                                            size="sm"
                                            style={{ flex: 1 }}
                                            title={internalSquad.name}
                                        >
                                            {internalSquad.name}
                                        </Text>
                                    </Group>

                                    <Group gap={4}>
                                        <CopyButton timeout={2000} value={internalSquad.uuid}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                        size="sm"
                                                        variant="subtle"
                                                    >
                                                        {copied ? (
                                                            <PiCheck size={14} />
                                                        ) : (
                                                            <PiCopy size={14} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>

                                        <Tooltip label="Delete squad">
                                            <ActionIcon
                                                color="red"
                                                onClick={() =>
                                                    handleDeleteInternalSquad(
                                                        internalSquad.uuid,
                                                        internalSquad.name
                                                    )
                                                }
                                                size="sm"
                                                variant="subtle"
                                            >
                                                <PiTrashDuotone size={14} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Group>

                                <Stack gap="sm">
                                    <Group gap="xs" justify="center">
                                        <Tooltip label="Inbounds">
                                            <Badge
                                                color="blue"
                                                leftSection={<PiTag size={12} />}
                                                size="lg"
                                                variant="light"
                                            >
                                                {formatInt(inboundsCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>

                                        <Tooltip label="Users">
                                            <Badge
                                                color={isActive ? 'teal' : 'gray'}
                                                leftSection={<PiUsers size={12} />}
                                                size="lg"
                                                variant="light"
                                            >
                                                {formatInt(membersCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>
                                    </Group>
                                </Stack>

                                <Divider />

                                <Stack gap="xs">
                                    <Group grow>
                                        <Button
                                            color="red"
                                            disabled={membersCount === 0}
                                            leftSection={<PiMinus size={14} />}
                                            onClick={() =>
                                                handleRemoveFromUsers(
                                                    internalSquad.uuid,
                                                    internalSquad.name
                                                )
                                            }
                                            size="xs"
                                            variant="light"
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            color="teal"
                                            leftSection={<PiPlus size={14} />}
                                            onClick={() =>
                                                handleAddToUsers(
                                                    internalSquad.uuid,
                                                    internalSquad.name
                                                )
                                            }
                                            size="xs"
                                            variant="light"
                                        >
                                            Add
                                        </Button>
                                    </Group>

                                    <Button
                                        fullWidth
                                        leftSection={<PiPencilDuotone size={14} />}
                                        onClick={() => {
                                            setInternalData({
                                                internalState: internalSquad,
                                                modalKey: MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
                                            })
                                            open(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
                                        }}
                                        size="xs"
                                        variant="default"
                                    >
                                        Edit inbounds
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid.Col>
                )
            })}

            <InternalSquadsDrawerWithStore />
        </Grid>
    )
}
