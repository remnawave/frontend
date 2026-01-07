import { Badge, Box, Center, Drawer, Group, Loader, Stack, Text } from '@mantine/core'
import { TbChevronRight, TbCirclesRelation, TbServer } from 'react-icons/tb'
import { GetUserAccessibleNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { PiTag } from 'react-icons/pi'
import { useState } from 'react'
import clsx from 'clsx'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetUserAccessibleNodes } from '@shared/api/hooks'
import { CountryFlag } from '@shared/ui/get-country-flag'

import classes from './user-accessible.module.css'

type ActiveNode = GetUserAccessibleNodesCommand.Response['response']['activeNodes'][number]
type ActiveSquad = ActiveNode['activeSquads'][number]
type ActiveInbound = ActiveSquad['activeInbounds'][number]

export const UserAccessibleNodesModalWidget = () => {
    const { t } = useTranslation()

    const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([])
    const [expandedSquadIds, setExpandedSquadIds] = useState<string[]>([])

    const { isOpen, internalState } = useModalState(MODALS.USER_ACCESSIBLE_NODES_DRAWER)
    const close = useModalClose(MODALS.USER_ACCESSIBLE_NODES_DRAWER)

    const { data: userAccessibleNodes, isLoading } = useGetUserAccessibleNodes({
        route: {
            uuid: internalState?.userUuid ?? ''
        },
        rQueryParams: {
            enabled: !!internalState
        }
    })

    const returnLoading = () => {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">
                        {t('user-accessible-nodes.modal.widget.loading-accessible-nodes')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    const renderAccessibleNodes = () => {
        if (!userAccessibleNodes?.activeNodes?.length) {
            return (
                <Center h={200}>
                    <Stack align="center" gap="md">
                        <TbServer color="var(--mantine-color-gray-5)" size={48} />
                        <Text c="dimmed" size="lg" ta="center">
                            {t(
                                'user-accessible-nodes.modal.widget.no-accessible-nodes-found-for-this-user'
                            )}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        return (
            <Stack gap="lg">
                <Group gap="md" wrap="wrap">
                    <Badge
                        color="blue"
                        leftSection={<TbServer size={18} />}
                        size="lg"
                        variant="light"
                    >
                        {userAccessibleNodes.activeNodes.length} {t('constants.nodes')}
                    </Badge>

                    <Badge
                        color="violet"
                        leftSection={<TbCirclesRelation size={18} />}
                        size="lg"
                        variant="light"
                    >
                        {userAccessibleNodes.activeNodes.reduce(
                            (acc, node) => acc + node.activeSquads.length,
                            0
                        )}{' '}
                        {t('constants.internal-squads')}
                    </Badge>

                    <Badge
                        color="orange"
                        leftSection={<PiTag size={18} />}
                        size="lg"
                        variant="light"
                    >
                        {userAccessibleNodes.activeNodes.reduce(
                            (acc, node) =>
                                acc +
                                node.activeSquads.reduce(
                                    (sum, squad) => sum + squad.activeInbounds.length,
                                    0
                                ),
                            0
                        )}{' '}
                        Inbounds
                    </Badge>
                </Group>

                <DataTable
                    borderRadius="md"
                    columns={[
                        {
                            accessor: 'nodeName',
                            title: 'Nodes / Internal Squads / Inbounds',
                            noWrap: true,
                            render: (node: ActiveNode) => (
                                <>
                                    <TbChevronRight
                                        className={clsx(classes.icon, classes.expandIcon, {
                                            [classes.expandIconRotated]: expandedNodeIds.includes(
                                                node.uuid
                                            )
                                        })}
                                    />
                                    <CountryFlag
                                        className={classes.icon}
                                        countryCode={node.countryCode}
                                    />

                                    <span>{node.nodeName}</span>
                                </>
                            )
                        },
                        {
                            accessor: 'configProfileName',
                            title: 'Config Profile',
                            textAlign: 'right',
                            width: 200,
                            render: (node) => node.configProfileName
                        },
                        {
                            accessor: 'activeSquads',
                            textAlign: 'right',
                            width: 200,
                            title: t('constants.internal-squads'),
                            render: (node) => node.activeSquads.length
                        }
                    ]}
                    highlightOnHover
                    idAccessor="uuid"
                    records={userAccessibleNodes.activeNodes}
                    rowExpansion={{
                        allowMultiple: true,
                        expanded: {
                            recordIds: expandedNodeIds,
                            onRecordIdsChange: setExpandedNodeIds
                        },
                        content: ({ record: node }) => (
                            <DataTable
                                columns={[
                                    {
                                        accessor: 'squadName',
                                        noWrap: true,
                                        render: (squad: ActiveSquad) => (
                                            <Box component="span" ml={20}>
                                                <TbChevronRight
                                                    className={clsx(
                                                        classes.icon,
                                                        classes.expandIcon,
                                                        {
                                                            [classes.expandIconRotated]:
                                                                expandedSquadIds.includes(
                                                                    `${node.uuid}-${squad.squadName}`
                                                                )
                                                        }
                                                    )}
                                                />
                                                <TbCirclesRelation className={classes.icon} />
                                                <span>{squad.squadName}</span>
                                            </Box>
                                        )
                                    },
                                    {
                                        accessor: 'activeInbounds',
                                        textAlign: 'left',
                                        width: 400,
                                        render: (squad: ActiveSquad) => squad.activeInbounds.length
                                    }
                                ]}
                                highlightOnHover
                                idAccessor={(squad: ActiveSquad) =>
                                    `${node.uuid}-${squad.squadName}`
                                }
                                noHeader
                                records={node.activeSquads}
                                rowExpansion={{
                                    allowMultiple: true,
                                    expanded: {
                                        recordIds: expandedSquadIds,
                                        onRecordIdsChange: setExpandedSquadIds
                                    },
                                    content: ({ record: squad }) => (
                                        <DataTable
                                            columns={[
                                                {
                                                    accessor: 'inbound',
                                                    noWrap: true,
                                                    render: (inbound: ActiveInbound) => (
                                                        <Box component="span" ml={60}>
                                                            <PiTag className={classes.icon} />
                                                            <span>{inbound}</span>
                                                        </Box>
                                                    )
                                                }
                                            ]}
                                            idAccessor={(inbound: ActiveInbound) =>
                                                `${node.uuid}-${squad.squadName}-${inbound}`
                                            }
                                            noHeader
                                            records={squad.activeInbounds}
                                            withColumnBorders
                                            withRowBorders
                                        />
                                    )
                                }}
                                withColumnBorders
                            />
                        )
                    }}
                    withColumnBorders
                    withRowBorders
                    withTableBorder
                />
            </Stack>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            position="right"
            size="800px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbServer}
                    iconVariant="gradient-teal"
                    title={t('user-accessible-nodes.modal.widget.user-accessible-nodes')}
                />
            }
        >
            {isLoading && returnLoading()}
            {!isLoading && userAccessibleNodes && renderAccessibleNodes()}
        </Drawer>
    )
}
