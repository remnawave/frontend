/* eslint-disable camelcase */

import {
    GetAllNodesCommand,
    GetAllUsersCommand,
    GetExternalSquadsCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { Badge, Group, Stack, Text, Tooltip } from '@mantine/core'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import { ConnectedNodeColumnEntity } from '@entities/dashboard/users/ui/table-columns/connected-node'
import { UsernameColumnEntity } from '@entities/dashboard/users/ui/table-columns/username'
import { StatusColumnEntity } from '@entities/dashboard/users/ui/table-columns/status'
import { DataUsageColumnEntity } from '@entities/dashboard/users/ui'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { formatInt } from '@shared/utils/misc'

import { NodeSelectItem, NodeSelectItemProps } from './node-select-item'

export const useUserTableColumns = (
    internalSquads?: GetInternalSquadsCommand.Response['response'],
    externalSquads?: GetExternalSquadsCommand.Response['response'],
    nodes?: GetAllNodesCommand.Response['response']
) => {
    const { t } = useTranslation()

    return useMemo<MRT_ColumnDef<GetAllUsersCommand.Response['response']['users'][number]>[]>(
        () => [
            {
                accessorKey: 'username',
                header: t('use-table-columns.username'),
                Cell: ({ cell }) => <UsernameColumnEntity user={cell.row.original} />,
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 220
            },
            {
                accessorKey: 'id',
                header: 'ID',
                accessorFn: (originalRow) => originalRow.id,
                size: 80
            },
            {
                accessorKey: 'status',
                header: t('use-table-columns.status'),
                Cell: ({ cell }) => <StatusColumnEntity need="badge" user={cell.row.original} />,
                filterVariant: 'select',
                enableColumnFilterModes: false,
                enableSorting: false,
                mantineFilterSelectProps: {
                    data: ['ACTIVE', 'DISABLED', 'LIMITED', 'EXPIRED']
                },
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'nodeName',
                header: t('use-table-columns.last-connected-node'),
                Cell: ({ cell }) => (
                    <ConnectedNodeColumnEntity
                        node={
                            nodes?.find(
                                (node) =>
                                    node.uuid ===
                                    cell.row.original.userTraffic.lastConnectedNodeUuid
                            ) ?? undefined
                        }
                    />
                ),
                filterVariant: 'select',
                mantineFilterSelectProps: {
                    comboboxProps: {
                        transitionProps: { transition: 'fade', duration: 200 }
                    },
                    checkIconPosition: 'left',
                    data:
                        nodes?.map((node) => ({
                            label: node.name,
                            value: node.uuid,
                            countryCode: node.countryCode
                        })) ?? [],
                    renderOption: (item) => {
                        const option = item.option as NodeSelectItemProps
                        return <NodeSelectItem {...option} />
                    }
                },
                enableSorting: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'expireAt',
                header: t('use-table-columns.expire-at'),
                Cell: ({ cell }) => <StatusColumnEntity need="date" user={cell.row.original} />,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                enableClickToCopy: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'usedTrafficBytes',
                header: t('use-table-columns.data-usage'),
                Cell: ({ cell }) => <DataUsageColumnEntity user={cell.row.original} />,
                mantineTableBodyCellProps: {
                    align: 'center'
                },
                minSize: 150,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                maxSize: 700,
                size: 300
            },
            {
                accessorKey: 'shortUuid',
                header: t('use-table-columns.sub-link'),
                accessorFn: (originalRow) => originalRow.shortUuid,
                minSize: 400,
                maxSize: 800,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'description',
                header: t('use-table-columns.description'),
                accessorFn: (originalRow) => originalRow.description || '–',
                minSize: 250,
                size: 400,

                mantineTableBodyCellProps: {
                    align: 'center',
                    style: { whiteSpace: 'normal', wordBreak: 'break-word' }
                }
            },

            {
                accessorKey: 'telegramId',
                header: 'Telegram ID',
                accessorFn: (originalRow) => originalRow.telegramId || '–',
                minSize: 100,
                size: 200,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'tag',
                header: t('use-table-columns.tag'),
                Cell: ({ cell }) => (
                    <Text ff="monospace" fw={500} size="md">
                        {cell.row.original.tag || '–'}
                    </Text>
                ),
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'activeInternalSquads',
                header: t('use-table-columns.internal-squads'),
                filterVariant: 'select',
                enableColumnFilterModes: false,
                enableSorting: false,
                mantineFilterSelectProps: {
                    data:
                        internalSquads?.internalSquads.map((squad) => ({
                            label: `${squad.name} (${formatInt(squad.info.membersCount)})`,
                            value: squad.uuid
                        })) ?? []
                },
                Cell: ({ cell }) => {
                    const squads = cell.row.original.activeInternalSquads

                    if (squads.length === 0) {
                        return <Text c="dimmed">–</Text>
                    }

                    if (squads.length === 1) {
                        return (
                            <Group gap="xs" wrap="nowrap">
                                {squads.map((squad) => (
                                    <Badge key={squad.uuid} size="sm" variant="light">
                                        {squad.name}
                                    </Badge>
                                ))}
                            </Group>
                        )
                    }

                    return (
                        <Tooltip
                            bg="dark.7"
                            label={
                                <Stack gap="xs">
                                    {squads.map((squad) => (
                                        <Badge fullWidth key={squad.uuid} size="sm" variant="light">
                                            {squad.name}
                                        </Badge>
                                    ))}
                                </Stack>
                            }
                            multiline
                            position="top"
                        >
                            <Group gap="xs" style={{ cursor: 'help' }} wrap="nowrap">
                                <Badge color="gray" size="sm" variant="outline">
                                    {squads.length} squads
                                </Badge>
                            </Group>
                        </Tooltip>
                    )
                }
            },

            {
                accessorKey: 'externalSquadUuid',
                header: t('constants.external-squads'),
                filterVariant: 'select',
                enableColumnFilterModes: false,
                enableSorting: false,
                mantineFilterSelectProps: {
                    data:
                        externalSquads?.externalSquads.map((squad) => ({
                            label: squad.name,
                            value: squad.uuid
                        })) ?? []
                },
                Cell: ({ cell }) => {
                    const userSquad = cell.row.original.externalSquadUuid

                    if (!userSquad) {
                        return <Text c="dimmed">–</Text>
                    }

                    const squadName = externalSquads?.externalSquads.find(
                        (squad) => userSquad === squad.uuid
                    )?.name

                    return squadName || '–'
                }
            },

            {
                accessorKey: 'email',
                header: 'Email',
                accessorFn: (originalRow) => originalRow.email || '–',
                minSize: 100,
                size: 200,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'userTraffic.firstConnectedAt',
                header: t('use-table-columns.first-connected-at'),
                accessorFn: (originalRow) => {
                    if (originalRow.userTraffic && originalRow.userTraffic.firstConnectedAt) {
                        return dayjs(originalRow.userTraffic.firstConnectedAt).format(
                            'DD/MM/YYYY, HH:mm'
                        )
                    }
                    return '–'
                },
                minSize: 250,
                size: 400,

                enableColumnFilterModes: false,
                enableColumnFilter: false,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'lastTrafficResetAt',
                header: t('use-table-columns.traffic-reset'),
                accessorFn: (originalRow) =>
                    originalRow.lastTrafficResetAt
                        ? dayjs(originalRow.lastTrafficResetAt).format('DD/MM/YYYY, HH:mm')
                        : t('use-table-columns.never'),
                minSize: 170,
                maxSize: 400,
                size: 170,
                enableClickToCopy: false,

                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'userTraffic.onlineAt',
                header: t('use-table-columns.online-at'),
                accessorFn: (originalRow) =>
                    originalRow.userTraffic && originalRow.userTraffic.onlineAt
                        ? dayjs(originalRow.userTraffic.onlineAt).format('DD/MM/YYYY, HH:mm')
                        : t('use-table-columns.never'),
                minSize: 170,
                maxSize: 400,
                size: 170,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'subLastUserAgent',
                header: t('use-table-columns.last-ua'),
                accessorFn: (originalRow) => originalRow.subLastUserAgent || '–',
                minSize: 250,
                size: 400,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'subLastOpenedAt',
                header: t('use-table-columns.sub-last-opened-at'),
                accessorFn: (originalRow) =>
                    originalRow.subLastOpenedAt
                        ? dayjs(originalRow.subLastOpenedAt).format('DD/MM/YYYY, HH:mm')
                        : '–',
                minSize: 250,
                size: 400,

                enableColumnFilterModes: false,
                enableColumnFilter: false,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'userTraffic.lifetimeUsedTrafficBytes',
                header: t('use-table-columns.lifetime-used'),
                accessorFn: (originalRow) =>
                    originalRow.userTraffic && originalRow.userTraffic.lifetimeUsedTrafficBytes
                        ? prettyBytesToAnyUtil(originalRow.userTraffic.lifetimeUsedTrafficBytes)
                        : '–',
                minSize: 170,
                maxSize: 300,
                size: 170,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'subRevokedAt',
                header: t('use-table-columns.sub-link-revoked-at'),
                accessorFn: (originalRow) =>
                    originalRow.subRevokedAt
                        ? dayjs(originalRow.subRevokedAt).format('DD/MM/YYYY, HH:mm')
                        : t('use-table-columns.never'),
                minSize: 170,
                maxSize: 170,
                size: 170,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'createdAt',
                header: t('use-table-columns.created-at'),
                accessorFn: (originalRow) =>
                    dayjs(originalRow.createdAt).format('DD/MM/YYYY, HH:mm'),
                minSize: 170,
                maxSize: 170,
                size: 170,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'uuid',
                header: 'UUID',
                accessorFn: (originalRow) => originalRow.uuid,
                minSize: 400,
                maxSize: 800,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            }
        ],
        []
    )
}
