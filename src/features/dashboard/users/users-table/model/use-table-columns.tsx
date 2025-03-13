/* eslint-disable camelcase */
import { GetAllUsersV2Command } from '@remnawave/backend-contract'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import { ConnectedNodeColumnEntity } from '@entities/dashboard/users/ui/table-columns/connected-node'
import { ShortUuidColumnEntity } from '@entities/dashboard/users/ui/table-columns/short-uuid'
import { UsernameColumnEntity } from '@entities/dashboard/users/ui/table-columns/username'
import { StatusColumnEntity } from '@entities/dashboard/users/ui/table-columns/status'
import { DataUsageColumnEntity } from '@entities/dashboard/users/ui'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

export const useUserTableColumns = () => {
    const { t } = useTranslation()

    return useMemo<MRT_ColumnDef<GetAllUsersV2Command.Response['response']['users'][0]>[]>(
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
                        nodeName={cell.row.original.lastConnectedNode?.nodeName}
                    />
                ),
                accessorFn: (originalRow) => originalRow.lastConnectedNode?.nodeName || '–',

                enableColumnFilterModes: false,
                enableColumnFilter: false,
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
                enableColumnFilter: false
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
                maxSize: 400,
                size: 300
            },
            {
                accessorKey: 'shortUuid',
                header: t('use-table-columns.sub-link'),

                Cell: ({ cell }) => <ShortUuidColumnEntity user={cell.row.original} />,
                minSize: 140,
                maxSize: 400,
                size: 140,

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
                    align: 'center'
                }
            },

            {
                accessorKey: 'telegramId',
                header: 'Telegram ID',
                accessorFn: (originalRow) => originalRow.telegramId || '–',
                minSize: 250,
                size: 400,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'email',
                header: 'Email',
                accessorFn: (originalRow) => originalRow.email || '–',
                minSize: 250,
                size: 400,

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
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'onlineAt',
                header: t('use-table-columns.online-at'),
                accessorFn: (originalRow) =>
                    originalRow.onlineAt
                        ? dayjs(originalRow.onlineAt).format('DD/MM/YYYY, HH:mm')
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
                accessorKey: 'lifetimeUsedTrafficBytes',
                header: t('use-table-columns.lifetime-used'),
                accessorFn: (originalRow) =>
                    prettyBytesToAnyUtil(originalRow.lifetimeUsedTrafficBytes) || '–',
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
            }
        ],
        []
    )
}
