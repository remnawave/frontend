import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import { useEffect } from 'react'

import { ViewUserActionFeature } from '@features/ui/dashboard/users/view-user-action'
import { useUsersTableStoreActions } from '@entitites/dashboard/users-table-store'
import { customIcons } from '@widgets/dashboard/users/users-table/constants'

import { useUserTableColumns } from '../model/use-table-columns'
import { useUserTableData } from '../model/use-table-data'

export const UserTableFeature = () => {
    const tableColumns = useUserTableColumns()
    const actions = useUsersTableStoreActions()

    const { sorting, pagination, columnFilters, columnFilterFns, handleStateChange } =
        useTableState(tableColumns)

    const { setSorting, setPagination, setColumnFilters, setColumnFilterFns } = handleStateChange

    const { data, isError, isFetching, isLoading, refetch } = useUserTableData({
        columnFilterFns,
        columnFilters,
        pagination,
        sorting
    })

    const { users, total } = data ?? {}

    const totalRowCount = total ?? 0
    const fetchedUsers = users ?? []

    const table = useMantineReactTable({
        columns: tableColumns,
        data: fetchedUsers,
        enableFullScreenToggle: false,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        // enableColumnFilterModes: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
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
        renderRowActions: ({ row }) => <ViewUserActionFeature userUuid={row.original.uuid} />,
        displayColumnDefOptions: { 'mrt-row-actions': { size: 120 } }
    })

    useEffect(() => {
        actions.setTableActions(table, refetch)
    }, [table])

    useEffect(() => {
        actions.setLoadingState(isLoading)
    }, [isLoading])

    return <MantineReactTable table={table} />
}
