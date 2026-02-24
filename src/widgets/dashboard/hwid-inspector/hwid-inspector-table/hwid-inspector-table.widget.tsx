/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_PaginationState,
    MRT_SortingState,
    MRT_TableOptions,
    MRT_VisibilityState,
    useMantineReactTable
} from 'mantine-react-table'
import { TbDeviceAnalytics, TbRefresh, TbRestore } from 'react-icons/tb'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { GetAllHwidDevicesCommand } from '@remnawave/backend-contract'
import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiUserCircle } from 'react-icons/pi'

import { useHwidInspectorTableColumns } from '@features/dashboard/hwid-inspector/hwid-inspector-table/model/use-hwid-inspector-table-columns'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { preventBackScrollTables } from '@shared/utils/misc'
import { useGetAllHwidDevices } from '@shared/api/hooks'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

export function HwidInspectorTableWidget() {
    const { t } = useTranslation()

    const tableColumns = useHwidInspectorTableColumns()
    const userModalActions = useUserModalStoreActions()

    const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>({})
    const [columnPinning, setColumnPinning] = useState<MRT_ColumnPinningState>({})
    const [showColumnFilters, setShowColumnFilters] = useState(false)
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

    const {
        data: usersResponse,
        isError,
        isFetching,
        isLoading,
        refetch
    } = useGetAllHwidDevices({
        query: params,
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const filteredData = useMemo(() => usersResponse, [usersResponse])

    useLayoutEffect(() => {
        document.body.addEventListener('wheel', preventBackScrollTables, {
            passive: false
        })
        return () => {
            document.body.removeEventListener('wheel', preventBackScrollTables)
        }
    }, [])

    const table = useMantineReactTable({
        columns: tableColumns,
        data: filteredData?.devices ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 25
            },
            showColumnFilters: false,
            density: 'xs',
            columnVisibility: {},
            columnPinning: {},
            columnSizing: {}
        },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        // mantinePaginationProps: {
        //     rowsPerPageOptions: ['25', '50', '100']
        // },

        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: t('user-table.widget.error-loading-data')
        } : undefined,

        onColumnFilterFnsChange: setColumnFilterFns,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnPinningChange: setColumnPinning,
        onColumnVisibilityChange: setColumnVisibility,
        onShowColumnFiltersChange: setShowColumnFilters,

        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        rowCount: filteredData?.total ?? 0,
        enableRowSelection: false,
        enableColumnPinning: true,
        positionToolbarAlertBanner: 'top',
        selectAllMode: 'page',
        state: {
            columnFilterFns,
            columnFilters,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            showColumnFilters,
            sorting,
            columnVisibility,
            columnPinning
        },
        enableRowActions: true,
        renderRowActions: useCallback<
            Required<
                MRT_TableOptions<GetAllHwidDevicesCommand.Response['response']['devices'][number]>
            >['renderRowActions']
        >(
            ({ row }) => (
                <ActionIcon
                    onClick={async () => {
                        await userModalActions.setUserUuid(row.original.userUuid)
                        userModalActions.changeModalState(true)
                    }}
                    size="input-sm"
                    variant="light"
                >
                    <PiUserCircle size="1.5rem" />
                </ActionIcon>
            ),
            []
        ),

        getRowId: (originalRow) => `${originalRow.hwid}-${originalRow.userUuid}`
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <ActionIconGroup>
                        <Tooltip label={t('common.update')} withArrow>
                            <ActionIcon
                                loading={isLoading}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="light"
                            >
                                <TbRefresh size="24px" />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('action-group.feature.reset-table')} withArrow>
                            <ActionIcon
                                color="gray"
                                loading={isLoading}
                                onClick={() => {
                                    table.resetPageIndex(false)
                                    table.resetSorting(true)
                                    table.resetPagination(false)
                                    table.resetColumnFilters(true)
                                    table.resetGlobalFilter(true)
                                }}
                                size="input-md"
                                variant="light"
                            >
                                <TbRestore size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbDeviceAnalytics size={24} />}
                title={t('hwid-inspector-table.widget.hwid-devices-list')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
