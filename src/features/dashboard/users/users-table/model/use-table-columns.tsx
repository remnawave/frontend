/* eslint-disable camelcase */
import { GetAllUsersV2Command } from '@remnawave/backend-contract'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import { ConnectedNodeColumnEntity } from '@entities/dashboard/users/ui/table-columns/connected-node'
import { ShortUuidColumnEntity } from '@entities/dashboard/users/ui/table-columns/short-uuid'
import { UsernameColumnEntity } from '@entities/dashboard/users/ui/table-columns/username'
import { StatusColumnEntity } from '@entities/dashboard/users/ui/table-columns/status'
import { DataUsageColumnEntity } from '@entities/dashboard/users/ui'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

export const useUserTableColumns = () => {
    return useMemo<MRT_ColumnDef<GetAllUsersV2Command.Response['response']['users'][0]>[]>(
        () => [
            {
                accessorKey: 'username',
                header: 'Username',
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
                header: 'Status',
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
                header: 'Last connected node',
                Cell: ({ cell }) => (
                    <ConnectedNodeColumnEntity
                        nodeName={cell.row.original.lastConnection?.nodeName}
                    />
                ),
                accessorFn: (originalRow) => originalRow.lastConnection?.nodeName || '–',

                enableColumnFilterModes: false,
                enableColumnFilter: false,
                enableSorting: false,
                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'expireAt',
                header: 'Expire at',
                Cell: ({ cell }) => <StatusColumnEntity need="date" user={cell.row.original} />,
                enableColumnFilterModes: false,
                enableColumnFilter: false
            },
            {
                accessorKey: 'usedTrafficBytes',
                header: 'Data usage',
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
                header: 'Sub-link',

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
                header: 'Description',
                accessorFn: (originalRow) => originalRow.description || '–',
                minSize: 250,
                size: 400,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },

            {
                accessorKey: 'lastTrafficResetAt',
                header: 'Traffic reset',
                accessorFn: (originalRow) =>
                    originalRow.lastTrafficResetAt
                        ? dayjs(originalRow.lastTrafficResetAt).format('DD/MM/YYYY, HH:mm')
                        : 'Never',
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
                header: 'Online at',
                accessorFn: (originalRow) =>
                    originalRow.onlineAt
                        ? dayjs(originalRow.onlineAt).format('DD/MM/YYYY, HH:mm')
                        : 'Never',
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
                header: 'Last UA',
                accessorFn: (originalRow) => originalRow.subLastUserAgent || '–',
                minSize: 250,
                size: 400,

                mantineTableBodyCellProps: {
                    align: 'center'
                }
            },
            {
                accessorKey: 'lifetimeUsedTrafficBytes',
                header: 'Lifetime used',
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
                header: 'Sub-link revoked at',
                accessorFn: (originalRow) =>
                    originalRow.subRevokedAt
                        ? dayjs(originalRow.subRevokedAt).format('DD/MM/YYYY, HH:mm')
                        : 'Never',
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
                header: 'Created at',
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
