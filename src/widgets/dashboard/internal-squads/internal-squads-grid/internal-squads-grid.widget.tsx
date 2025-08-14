import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Grid,
    Group,
    Menu,
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
    PiPencil,
    PiTag,
    PiTrashDuotone,
    PiUsers
} from 'react-icons/pi'
import {
    TbChevronDown,
    TbCirclesRelation,
    TbServerCog,
    TbUsersMinus,
    TbUsersPlus
} from 'react-icons/tb'
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

import classes from './InternalSquads.module.css'
import { IProps } from './interfaces'

export function InternalSquadsGridWidget(props: IProps) {
    const { internalSquads } = props
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 48em)')

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

    const isHighCount = internalSquads.length > 6

    return (
        <Grid>
            {internalSquads.map((internalSquad, index) => {
                const { membersCount } = internalSquad.info
                const { inboundsCount } = internalSquad.info
                const isActive = membersCount > 0

                return (
                    <Grid.Col
                        key={internalSquad.uuid}
                        span={{ base: 12, sm: 6, md: 6, lg: 4, xl: 3, '2xl': 2 }}
                    >
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: isHighCount ? 0 : 20 }}
                            transition={{
                                duration: 0.3,
                                delay: isHighCount ? 0.1 : index * 0.05,
                                ease: 'easeOut'
                            }}
                        >
                            <Card
                                className={classes.card}
                                h="100%"
                                p={isMobile ? 'md' : 'lg'}
                                radius="md"
                                shadow="xs"
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
                                    </Group>

                                    <Stack gap="sm">
                                        <Group gap="xs" justify="center" wrap="nowrap">
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

                                    <Group gap={0} wrap="nowrap">
                                        <Button
                                            className={classes.button}
                                            leftSection={<PiTag size={14} />}
                                            onClick={() => {
                                                setInternalData({
                                                    internalState: internalSquad,
                                                    modalKey: MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
                                                })
                                                open(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
                                            }}
                                            radius="md"
                                            size="xs"
                                            variant="light"
                                        >
                                            {t('internal-squads-grid.widget.edit')}
                                        </Button>
                                        <Menu radius="sm" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon
                                                    className={classes.menuControl}
                                                    radius="md"
                                                    size={30}
                                                    variant="light"
                                                >
                                                    <TbChevronDown size={24} />
                                                </ActionIcon>
                                            </Menu.Target>

                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    color="teal"
                                                    leftSection={<TbUsersPlus size={18} />}
                                                    onClick={() =>
                                                        handleAddToUsers(
                                                            internalSquad.uuid,
                                                            internalSquad.name
                                                        )
                                                    }
                                                >
                                                    {t('internal-squads-grid.widget.add-users')}
                                                </Menu.Item>
                                                <Menu.Item
                                                    color="red"
                                                    disabled={membersCount === 0}
                                                    leftSection={<TbUsersMinus size={18} />}
                                                    onClick={() =>
                                                        handleRemoveFromUsers(
                                                            internalSquad.uuid,
                                                            internalSquad.name
                                                        )
                                                    }
                                                >
                                                    {t('internal-squads-grid.widget.remove-users')}
                                                </Menu.Item>

                                                <Menu.Item
                                                    leftSection={<TbServerCog size={14} />}
                                                    onClick={() => {
                                                        setInternalData({
                                                            internalState: {
                                                                squadUuid: internalSquad.uuid
                                                            },
                                                            modalKey:
                                                                MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER
                                                        })
                                                        open(
                                                            MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER
                                                        )
                                                    }}
                                                >
                                                    {t(
                                                        'view-user-modal.widget.view-accessible-nodes'
                                                    )}
                                                </Menu.Item>

                                                <CopyButton
                                                    timeout={2000}
                                                    value={internalSquad.uuid}
                                                >
                                                    {({ copied, copy }) => (
                                                        <Menu.Item
                                                            color={copied ? 'teal' : undefined}
                                                            leftSection={
                                                                copied ? (
                                                                    <PiCheck size={14} />
                                                                ) : (
                                                                    <PiCopy size={14} />
                                                                )
                                                            }
                                                            onClick={copy}
                                                        >
                                                            {t(
                                                                'internal-squads-grid.widget.copy-uuid'
                                                            )}
                                                        </Menu.Item>
                                                    )}
                                                </CopyButton>

                                                <Menu.Item
                                                    leftSection={<PiPencil size={14} />}
                                                    onClick={() => {
                                                        setInternalData({
                                                            internalState: {
                                                                name: internalSquad.name,
                                                                uuid: internalSquad.uuid
                                                            },
                                                            modalKey:
                                                                MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                                        })
                                                        open(
                                                            MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                                        )
                                                    }}
                                                >
                                                    {t('internal-squads-grid.widget.rename')}
                                                </Menu.Item>

                                                <Menu.Item
                                                    color="red"
                                                    leftSection={<PiTrashDuotone size={14} />}
                                                    onClick={() =>
                                                        handleDeleteInternalSquad(
                                                            internalSquad.uuid,
                                                            internalSquad.name
                                                        )
                                                    }
                                                >
                                                    {t('internal-squads-grid.widget.delete-squad')}
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
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
