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
import {
    PiCheck,
    PiCircle,
    PiCopy,
    PiEmpty,
    PiMinus,
    PiPencilDuotone,
    PiPlus,
    PiTag,
    PiTrashDuotone,
    PiUsers
} from 'react-icons/pi'
import { TbCirclesRelation } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { motion } from 'motion/react'

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
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 768px)')

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
                confirm: t('internal-squads-grid.widget.delete'),
                cancel: t('internal-squads-grid.widget.cancel')
            },
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
            title: t('internal-squads-grid.widget.remove-users-from-internal-squad'),
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
                confirm: t('internal-squads-grid.widget.remove'),
                cancel: t('internal-squads-grid.widget.cancel')
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
            title: t('internal-squads-grid.widget.add-users-to-internal-squad'),
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
                confirm: t('internal-squads-grid.widget.add'),
                cancel: t('internal-squads-grid.widget.cancel')
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
        <Grid>
            {internalSquads.map((internalSquad, index) => {
                const { membersCount } = internalSquad.info
                const { inboundsCount } = internalSquad.info
                const isActive = membersCount > 0

                return (
                    <Grid.Col
                        key={internalSquad.uuid}
                        span={{ base: 12, sm: 6, md: 6, lg: 6, xl: 3 }}
                    >
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: 'easeOut'
                            }}
                            whileHover={{ y: -4 }}
                        >
                            <Card
                                h="100%"
                                p={isMobile ? 'md' : 'lg'}
                                radius="lg"
                                shadow="xs"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background:
                                        'linear-gradient(280deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
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
                                        <Group
                                            gap="sm"
                                            style={{ flex: 1, minWidth: 0 }}
                                            wrap="nowrap"
                                        >
                                            <ActionIcon
                                                color={isActive ? 'teal' : 'gray'}
                                                radius="md"
                                                size="md"
                                                variant={isActive ? 'light' : 'subtle'}
                                            >
                                                {isActive ? (
                                                    <TbCirclesRelation size={16} />
                                                ) : (
                                                    <PiCircle size={16} />
                                                )}
                                            </ActionIcon>
                                            <Text
                                                fw={600}
                                                lineClamp={1}
                                                size={isMobile ? 'sm' : 'md'}
                                                style={{
                                                    color: 'white',
                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                                    flex: 1
                                                }}
                                                title={internalSquad.name}
                                            >
                                                {internalSquad.name}
                                            </Text>
                                        </Group>

                                        <Group gap={4}>
                                            <CopyButton timeout={2000} value={internalSquad.uuid}>
                                                {({ copied, copy }) => (
                                                    <Tooltip
                                                        label={copied ? 'Copied!' : 'Copy UUID'}
                                                    >
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

                                            <Tooltip
                                                label={t(
                                                    'internal-squads-grid.widget.delete-squad'
                                                )}
                                            >
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
                                            <Tooltip
                                                label={t('internal-squads-grid.widget.inbounds')}
                                            >
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

                                            <Tooltip label={t('internal-squads-grid.widget.users')}>
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

                                    <Divider variant="dashed" />

                                    <Stack gap="xs">
                                        <Group grow>
                                            <Button
                                                color="red"
                                                disabled={membersCount === 0}
                                                leftSection={<PiMinus size={16} />}
                                                onClick={() =>
                                                    handleRemoveFromUsers(
                                                        internalSquad.uuid,
                                                        internalSquad.name
                                                    )
                                                }
                                                size="xs"
                                                variant="light"
                                            >
                                                {t('internal-squads-grid.widget.remove')}
                                            </Button>
                                            <Button
                                                color="teal"
                                                leftSection={<PiPlus size={16} />}
                                                onClick={() =>
                                                    handleAddToUsers(
                                                        internalSquad.uuid,
                                                        internalSquad.name
                                                    )
                                                }
                                                size="xs"
                                                variant="light"
                                            >
                                                {t('internal-squads-grid.widget.add')}
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
                                            {t('internal-squads-grid.widget.edit-inbounds')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </motion.div>
                    </Grid.Col>
                )
            })}

            <InternalSquadsDrawerWithStore />
        </Grid>
    )
}
