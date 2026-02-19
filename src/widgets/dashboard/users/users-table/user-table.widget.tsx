/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_SortingState,
    useMantineReactTable
} from 'mantine-react-table'
import { useLayoutEffect, useMemo, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { PiUsersDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import {
    useUsersTableStoreActions,
    useUsersTableStoreColumnFilter,
    useUsersTableStoreColumnPinning,
    useUsersTableStoreColumnSize,
    useUsersTableStoreColumnVisibility,
    useUsersTableStorePagination,
    useUsersTableStoreShowColumnFilters
} from '@entities/dashboard/users/users-table-store'
import {
    useBulkUsersActionsStoreActions,
    useBulkUsersActionsStoreTableSelection
} from '@entities/dashboard/users/bulk-users-actions-store'
import { UsersTableSelectionFeature } from '@features/ui/dashboard/users/users-table-selection/users-table-selection.feature'
import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetNodes,
    useGetUsersV2
} from '@shared/api/hooks'
import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import { UserActionGroupFeature } from '@features/dashboard/users/users-action-group'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { preventBackScrollTables } from '@shared/utils/misc'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

import { BulkUserActionsDrawerWidget } from '../bulk-user-actions-drawer/bulk-user-actions-drawer.widget'

export function UserTableWidget() {
    const { t } = useTranslation()

    const { data: internalSquads } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()
    const { data: nodes } = useGetNodes()

    const tableColumns = useUserTableColumns(internalSquads, externalSquads, nodes)
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()
    const tableSelection = useBulkUsersActionsStoreTableSelection()
    const userModalActions = useUserModalStoreActions()

    const actions = useUsersTableStoreActions()

    const columnVisibility = useUsersTableStoreColumnVisibility()
    const columnPinning = useUsersTableStoreColumnPinning()
    const showColumnFilters = useUsersTableStoreShowColumnFilters()
    const columnFilter = useUsersTableStoreColumnFilter()
    const columnSize = useUsersTableStoreColumnSize()
    const pagination = useUsersTableStorePagination()

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(tableColumns.map(({ accessorKey }) => [accessorKey, 'contains']))
    )

    useLayoutEffect(() => {
        document.body.addEventListener('wheel', preventBackScrollTables, {
            passive: false
        })
        return () => {
            document.body.removeEventListener('wheel', preventBackScrollTables)
        }
    }, [])

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
        enableClickToCopy: false,
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
            columnPinning,
            columnSizing: columnSize
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
        onPaginationChange: actions.setPaginationState,
        onSortingChange: setSorting,
        onColumnPinningChange: actions.setColumnPinning,
        onColumnVisibilityChange: actions.setColumnVisibility,
        onShowColumnFiltersChange: actions.setShowColumnFilters,
        onColumnSizingChange: actions.setColumnSize,
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
        renderToolbarAlertBannerContent: () => {
            return (
                <UsersTableSelectionFeature
                    resetRowSelection={table.resetRowSelection}
                    toggleAllPageRowsSelected={table.toggleAllPageRowsSelected}
                />
            )
        },
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
            rowSelection: tableSelection,
            columnSizing: columnSize
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: async () => {
                if (row.id === 'mrt-row-empty' || row.original.uuid === undefined) {
                    notifications.show({
                        title: 'Nice try!',
                        message: 'Nothing to show...',
                        color: 'indigo'
                    })
                    return
                }
                await userModalActions.setUserUuid(row.original.uuid)
                userModalActions.changeModalState(true)
            },
            style: {
                cursor: 'pointer'
            }
        }),
        onRowSelectionChange: bulkUsersActionsStoreActions.setTableSelection,
        getRowId: (originalRow) => originalRow.uuid
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <UserActionGroupFeature isLoading={isLoading} refetch={refetch} table={table} />
                }
                icon={<PiUsersDuotone size={24} />}
                title={t('user-table.widget.table-title')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>

            <BulkUserActionsDrawerWidget resetRowSelection={table.resetRowSelection} />
        </DataTableShared.Container>
    )
}
