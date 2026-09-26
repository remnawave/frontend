import { MRT_ColumnDef } from '@kastov/mantine-react-table-open'
import { Badge, ComboboxItem, Group, SelectProps, Stack, Text, Tooltip } from '@mantine/core'
import {
    GetNodesCommand,
    GetUsersCommand,
    GetExternalSquadsCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { prettifyBytesUtil } from '@shared/utils/bytes'
import { formatInt } from '@shared/utils/misc'
import { formatTimeUtil } from '@shared/utils/time-utils'

import { DataUsageColumnEntity } from '@entities/dashboard/users/ui'
import { ConnectedNodeColumnEntity } from '@entities/dashboard/users/ui/table-columns/connected-node'
import { StatusColumnEntity } from '@entities/dashboard/users/ui/table-columns/status'
import { UsernameColumnEntity } from '@entities/dashboard/users/ui/table-columns/username'

import { NodeSelectItem, NodeSelectItemProps } from './node-select-item'
import { TrafficLimitRangeFilter } from './traffic-limit-range-filter'

const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
    const item = option as ComboboxItem & { membersCount: number }
    return (
        <Group flex="1" gap="xs" w="100%" wrap="nowrap">
            <Text size="sm" truncate="end">
                {item.label}
            </Text>
            <Badge color="gray" ml="auto" size="sm" style={{ flexShrink: 0 }} variant="light">
                {formatInt(item?.membersCount ?? 0)}
            </Badge>
        </Group>
    )
}

export const useUserTableColumns = (
    internalSquads?: GetInternalSquadsCommand.Response['response'],
    externalSquads?: GetExternalSquadsCommand.Response['response'],
    nodes?: GetNodesCommand.Response['response']
) => {
    const { t, i18n } = useTranslation()

    return useMemo<MRT_ColumnDef<GetUsersCommand.Response['response']['users'][number]>[]>(
        () => [
            {
                accessorKey: 'username',
                header: t('common.field.username'),
                Cell: ({ cell }) => <UsernameColumnEntity user={cell.row.original} />,
                mantineTableBodyCellProps: {
                    align: 'left'
                },
                minSize: 150,
                maxSize: 300,
                size: 220,
                columnFilterModeOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
                enableColumnFilterModes: true,
                enableColumnFilter: true
            },
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnFilterModes: false,
                accessorFn: (originalRow) => originalRow.id,
                size: 80
            },
            {
                accessorKey: 'status',
                header: t('common.field.status'),
                Cell: ({ cell }) => <StatusColumnEntity need="badge" user={cell.row.original} />,
                filterVariant: 'select',
                enableColumnFilterModes: false,
                enableSorting: false,
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
                        transitionProps: { transition: 'fade', duration: 200 },
                        width: 'fit-content'
                    },
                    checkIconPosition: 'left',
                    clearSectionMode: 'clear',
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
                enableColumnFilterModes: false,
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
                accessorKey: 'usedTrafficPercentage',
                header: t('use-table-columns.used-traffic'),
                Cell: ({ cell }) => {
                    const { usedTrafficBytes } = cell.row.original.userTraffic ?? {}
                    const limit = cell.row.original.trafficLimitBytes ?? 0

                    let percentage = 0
                    if (limit > 0 && typeof usedTrafficBytes === 'number') {
                        percentage = (usedTrafficBytes * 100) / limit
                    }

                    return <Text fw={600}>{percentage.toFixed(2)}%</Text>
                },
                mantineTableBodyCellProps: {
                    align: 'center'
                },
                minSize: 80,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                maxSize: 700,
                size: 180
            },
            {
                accessorKey: 'trafficLimitBytes',
                header: t('traffic-limits-card.traffic-limit'),
                Cell: ({ cell }) => {
                    const limitBytes = cell.row.original.trafficLimitBytes ?? 0
                    return limitBytes === 0 ? '∞' : prettifyBytesUtil(limitBytes) || '0 B'
                },
                mantineTableBodyCellProps: {
                    align: 'center'
                },
                filterVariant: 'range',
                Filter: ({ column, rangeFilterIndex }) =>
                    rangeFilterIndex === 0 ? <TrafficLimitRangeFilter column={column} /> : null,
                minSize: 230,
                enableColumnFilterModes: false,
                enableColumnFilter: true,
                size: 230
            },
            {
                accessorKey: 'shortUuid',
                header: t('use-table-columns.sub-link'),
                accessorFn: (originalRow) => originalRow.shortUuid,
                minSize: 400,
                maxSize: 800,
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'description',
                header: t('common.field.description'),
                accessorFn: (originalRow) => originalRow.description || '–',
                minSize: 250,
                size: 400,
                enableColumnFilterModes: false,
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
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'tag',
                header: t('common.field.tag'),
                Cell: ({ cell }) => (
                    <Text ff="monospace" fw={500} size="md">
                        {cell.row.original.tag || '–'}
                    </Text>
                ),

                mantineTableBodyCellProps: {
                    align: 'center'
                },

                columnFilterModeOptions: ['equals'],
                enableColumnFilterModes: false,
                enableColumnFilter: true,
                filterVariant: 'multi-select',
                mantineFilterSelectProps: {
                    comboboxProps: {
                        transitionProps: { transition: 'fade', duration: 200 },
                        width: 'fit-content'
                    },
                    checkIconPosition: 'left'
                }
            },
            {
                accessorKey: 'activeInternalSquads',
                header: t('use-table-columns.internal-squads'),
                filterVariant: 'select',
                enableColumnFilterModes: false,
                enableSorting: false,
                mantineFilterSelectProps: {
                    clearSectionMode: 'clear',
                    comboboxProps: {
                        width: 'fit-content'
                    },
                    data:
                        internalSquads?.internalSquads.map((squad) => ({
                            label: squad.name,
                            value: squad.uuid,
                            membersCount: squad.info.membersCount
                        })) ?? [],
                    renderOption: renderSelectOption
                },
                Cell: ({ cell }) => {
                    const squads = cell.row.original.activeInternalSquads

                    if (squads.length === 0) {
                        return <Text c="dimmed">–</Text>
                    }

                    const visibleSquads = squads.slice(0, 1)
                    const hiddenSquads = squads.slice(1)

                    return (
                        <Group gap="xs" wrap="nowrap">
                            {visibleSquads.map((squad) => (
                                <Badge key={squad.uuid} variant="soft">
                                    {squad.name}
                                </Badge>
                            ))}

                            {hiddenSquads.length > 0 && (
                                <Tooltip
                                    label={
                                        <Stack gap="xs">
                                            {hiddenSquads.map((squad) => (
                                                <Badge fullWidth key={squad.uuid} variant="soft">
                                                    {squad.name}
                                                </Badge>
                                            ))}
                                        </Stack>
                                    }
                                    multiline
                                    position="top"
                                >
                                    <Badge color="violet" style={{ cursor: 'help' }} variant="soft">
                                        +{hiddenSquads.length}
                                    </Badge>
                                </Tooltip>
                            )}
                        </Group>
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
                    limit: 100,
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
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'userTraffic.firstConnectedAt',
                header: t('common.field.first-connected-at'),
                accessorFn: (originalRow) => {
                    if (originalRow.userTraffic && originalRow.userTraffic.firstConnectedAt) {
                        return formatTimeUtil({
                            time: originalRow.userTraffic.firstConnectedAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })
                    }
                    return '–'
                },
                minSize: 250,
                size: 250,
                enableColumnFilterModes: false,
                enableColumnFilter: false,

                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },

            {
                accessorKey: 'lastTrafficResetAt',
                header: t('use-table-columns.traffic-reset'),
                accessorFn: (originalRow) =>
                    originalRow.lastTrafficResetAt
                        ? formatTimeUtil({
                              time: originalRow.lastTrafficResetAt,
                              template: 'TIME_FIRST_DATETIME',
                              language: i18n.language
                          })
                        : t('use-table-columns.never'),
                minSize: 250,
                size: 250,
                enableClickToCopy: false,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'userTraffic.onlineAt',
                header: t('use-table-columns.online-at'),
                accessorFn: (originalRow) =>
                    originalRow.userTraffic && originalRow.userTraffic.onlineAt
                        ? formatTimeUtil({
                              time: originalRow.userTraffic.onlineAt,
                              template: 'TIME_FIRST_DATETIME',
                              language: i18n.language
                          })
                        : t('use-table-columns.never'),
                minSize: 250,
                size: 250,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },

            {
                accessorKey: 'userTraffic.lifetimeUsedTrafficBytes',
                header: t('use-table-columns.lifetime-used'),
                accessorFn: (originalRow) =>
                    originalRow.userTraffic && originalRow.userTraffic.lifetimeUsedTrafficBytes
                        ? prettifyBytesUtil(originalRow.userTraffic.lifetimeUsedTrafficBytes)
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
                        ? formatTimeUtil({
                              time: originalRow.subRevokedAt,
                              template: 'TIME_FIRST_DATETIME',
                              language: i18n.language
                          })
                        : t('use-table-columns.never'),
                minSize: 250,
                size: 250,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'createdAt',
                header: t('use-table-columns.created-at'),
                accessorFn: (originalRow) =>
                    formatTimeUtil({
                        time: originalRow.createdAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),
                minSize: 250,
                size: 250,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'vlessUuid',
                header: 'Vless UUID',
                accessorFn: (originalRow) => originalRow.vlessUuid,
                minSize: 400,
                enableColumnFilterModes: false,
                maxSize: 800,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'trojanPassword',
                header: 'Trojan Password',
                accessorFn: (originalRow) => originalRow.trojanPassword,
                minSize: 400,
                maxSize: 800,
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'hwidDeviceLimit',
                header: 'HWID Device Limit',
                accessorFn: (originalRow) => originalRow.hwidDeviceLimit ?? '–',
                columnFilterModeOptions: [
                    'equals',
                    'greaterThan',
                    'greaterThanOrEqualTo',
                    'lessThan',
                    'lessThanOrEqualTo',
                    'between'
                ],
                enableColumnFilterModes: true,
                enableColumnFilter: true,
                mantineFilterInputProps: {
                    type: 'number',
                    min: 0,
                    max: 9_999
                }
            }
        ],
        [t, nodes, internalSquads, externalSquads, i18n.language]
    )
}
