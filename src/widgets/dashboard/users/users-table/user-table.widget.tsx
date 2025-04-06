/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_PaginationState,
    MRT_SortingState,
    MRT_TableOptions,
    useMantineReactTable
} from 'mantine-react-table'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    useUsersTableStoreActions,
    useUsersTableStoreColumnFilter,
    useUsersTableStoreColumnPinning,
    useUsersTableStoreColumnVisibility,
    useUsersTableStoreShowColumnFilters
} from '@entities/dashboard/users/users-table-store'
import {
    useBulkUsersActionsStoreActions,
    useBulkUsersActionsStoreTableSelection
} from '@entities/dashboard/users/bulk-users-actions-store'
import { UsersTableSelectionFeature } from '@features/ui/dashboard/users/users-table-selection/users-table-selection.feature'
import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import { UserActionGroupFeature } from '@features/dashboard/users/users-action-group'
import { UserActionsFeature } from '@features/ui/dashboard/users/user-actions'
import { User } from '@entities/dashboard/users/models'
import { DataTableShared } from '@shared/ui/table'
import { useGetUsersV2 } from '@shared/api/hooks'
import { sToMs } from '@shared/utils/time-utils'

import { BulkUserActionsDrawerWidget } from '../bulk-user-actions-drawer/bulk-user-actions-drawer.widget'

export function UserTableWidget() {
    const { t } = useTranslation()

    const tableColumns = useUserTableColumns()
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()
    const tableSelection = useBulkUsersActionsStoreTableSelection()

    const actions = useUsersTableStoreActions()

    const columnVisibility = useUsersTableStoreColumnVisibility()
    const columnPinning = useUsersTableStoreColumnPinning()
    const showColumnFilters = useUsersTableStoreShowColumnFilters()
    const columnFilter = useUsersTableStoreColumnFilter()

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 25
    })

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(tableColumns.map(({ accessorKey }) => [accessorKey, 'contains']))
    )

    const params = {
        start: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        filters: columnFilter,
        filterModes: columnFilterFns,
        sorting
    }

    const {
        data: usersResponse,
        isError,
        isFetching,
        isLoading,
        refetch
    } = useGetUsersV2({
        query: params,
        rQueryParams: {
            // enabled: bulkUsersActionsStoreActions.getUuidLength() === 0,
            refetchInterval: bulkUsersActionsStoreActions.getUuidLength() === 0 ? sToMs(25) : false
        }
    })

    const filteredData = useMemo(() => usersResponse, [usersResponse])

    const table = useMantineReactTable({
        columns: tableColumns,
        data: filteredData?.users ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: true,
        // enableColumnFilterModes: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 25
            },
            showColumnFilters,
            density: 'xs',
            columnVisibility,
            columnPinning
        },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        // mantinePaginationProps: {
        //     rowsPerPageOptions: ['25', '50', '100']
        // },

        // icons: customIcons,
        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: t('user-table.widget.error-loading-data')
        } : undefined,

        onColumnFilterFnsChange: setColumnFilterFns,
        onColumnFiltersChange: actions.setColumnFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnPinningChange: actions.setColumnPinning,
        onColumnVisibilityChange: actions.setColumnVisibility,
        onShowColumnFiltersChange: actions.setShowColumnFilters,
        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        rowCount: filteredData?.total ?? 0,
        enableRowSelection: true,
        mantineSelectCheckboxProps: {
            size: 'md',
            color: 'cyan',
            variant: 'outline'
        },
        mantineSelectAllCheckboxProps: {
            size: 'md',
            color: 'cyan',
            variant: 'outline'
        },
        enableColumnPinning: true,
        positionToolbarAlertBanner: 'top',
        renderToolbarAlertBannerContent: useCallback<
            Required<MRT_TableOptions<User>>['renderToolbarAlertBannerContent']
        >(({ table }) => {
            return (
                <UsersTableSelectionFeature
                    resetRowSelection={table.resetRowSelection}
                    toggleAllPageRowsSelected={table.toggleAllPageRowsSelected}
                />
            )
        }, []),
        selectAllMode: 'page',
        state: {
            columnFilterFns,
            columnFilters: columnFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            showColumnFilters,
            sorting,
            columnVisibility,
            columnPinning,
            rowSelection: tableSelection
        },
        enableRowActions: true,
        onRowSelectionChange: bulkUsersActionsStoreActions.setTableSelection,
        getRowId: useCallback<Required<MRT_TableOptions<User>>['getRowId']>(
            (originalRow) => originalRow.uuid,
            []
        ),
        renderRowActions: useCallback<Required<MRT_TableOptions<User>>['renderRowActions']>(
            ({ row }) => (
                <UserActionsFeature
                    subscriptionUrl={row.original.subscriptionUrl}
                    userUuid={row.original.uuid}
                />
            ),
            []
        ),
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 140 }
        }
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <UserActionGroupFeature isLoading={isLoading} refetch={refetch} table={table} />
                }
                description={t('user-table.widget.list-of-all-users')}
                title={t('user-table.widget.table-title')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>

            <BulkUserActionsDrawerWidget resetRowSelection={table.resetRowSelection} />
        </DataTableShared.Container>
    )
}
