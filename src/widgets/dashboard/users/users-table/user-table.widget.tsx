/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_SortingState,
    useMantineReactTable
} from 'mantine-react-table'
import { useState } from 'react'

import { UserActionGroupFeature } from '@features/dashboard/users/users-action-group/action-group.feature'
import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import { UserActionsFeature } from '@features/ui/dashboard/users/user-actions'
import { DataTableShared } from '@shared/ui/table'
import { useGetUsersV2 } from '@shared/api/hooks'

import { customIcons } from './constants'

export function UserTableWidget() {
    const tableColumns = useUserTableColumns()

    const [sorting, setSorting] = useState<MRT_SortingState>([])
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 25
    })

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(tableColumns.map(({ accessorKey }) => [accessorKey, 'contains']))
    )

    const params = {
        start: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        filters: columnFilters,
        filterModes: columnFilterFns,
        sorting
    }

    const { data, isError, isFetching, isLoading, refetch } = useGetUsersV2({
        query: params
    })

    const { users, total } = data ?? {}

    const fetchedUsers = users ?? []
    const totalRowCount = total ?? 0

    const table = useMantineReactTable({
        columns: tableColumns,
        data: fetchedUsers,
        enableFullScreenToggle: false,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        // enableColumnFilterModes: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 25
            },
            showColumnFilters: false,
            density: 'xs',
            columnVisibility: {
                shortUuid: false,
                createdAt: false,
                subRevokedAt: false,
                totalUsedBytes: false,
                onlineAt: false,
                subLastUserAgent: false
            }
        },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        icons: customIcons,
        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: 'Error loading data'
        } : undefined,
        onColumnFilterFnsChange: setColumnFilterFns,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        rowCount: totalRowCount,
        enableColumnPinning: true,
        state: {
            columnFilterFns,
            columnFilters,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <UserActionsFeature
                subscriptionUrl={row.original.subscriptionUrl}
                userUuid={row.original.uuid}
            />
        ),

        displayColumnDefOptions: { 'mrt-row-actions': { size: 185 } }
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <UserActionGroupFeature isLoading={isLoading} refetch={refetch} table={table} />
                }
                description="List of all users"
                title="Users"
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
