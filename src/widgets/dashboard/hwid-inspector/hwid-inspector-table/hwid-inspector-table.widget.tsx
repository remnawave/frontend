/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_SortingState,
    useMantineReactTable
} from '@kastov/mantine-react-table-open'
import { TbDeviceAnalytics, TbExternalLink, TbRefresh, TbRestore } from 'react-icons/tb'
import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useHwidInspectorTableColumns } from '@features/dashboard/hwid-inspector/hwid-inspector-table/model/use-hwid-inspector-table-columns'
import { useHwidInspectorTableStore } from '@entities/dashboard/hwid-inspector/hwid-inspector-table-store'
import { DEFAULT_PAGINATION_STATE, useMrtTableBinding } from '@shared/lib/mrt-table-store'
import { ResolveUserActionShared } from '@shared/ui/resolve-user-action-icon'
import { preventBackScrollTables } from '@shared/utils/misc'
import { useGetAllHwidDevices } from '@shared/api/hooks'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

export function HwidInspectorTableWidget() {
    const { t } = useTranslation()

    const tableColumns = useHwidInspectorTableColumns()

    const { state: persistedTableState, handlers: persistedTableHandlers } = useMrtTableBinding(
        useHwidInspectorTableStore
    )

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(tableColumns.map(({ accessorKey }) => [accessorKey, 'contains']))
    )

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: persistedTableState.columnFilters,
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
        enableColumnOrdering: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            density: 'xs',
            pagination: DEFAULT_PAGINATION_STATE
        },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,

        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: t('user-table.widget.error-loading-data')
        } : undefined,

        ...persistedTableHandlers,
        onColumnFilterFnsChange: setColumnFilterFns,
        onSortingChange: setSorting,

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
            ...persistedTableState,
            columnFilterFns,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <ActionIconGroup>
                <ResolveUserActionShared userId={row.original.userId} />
                <ActionIcon
                    color="grape"
                    onClick={() => {
                        window.open(`https://ipinfo.io/${row.original.requestIp}`, '_blank')
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbExternalLink size="1.5rem" />
                </ActionIcon>
            </ActionIconGroup>
        ),

        getRowId: (originalRow) => `${originalRow.hwid}-${originalRow.userId}`,
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 110 }
        }
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
                                variant="soft"
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
                                    table.resetColumnOrder(true)
                                    table.resetColumnPinning(true)
                                    table.resetColumnVisibility(true)
                                }}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRestore size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbDeviceAnalytics size={24} />}
                iconProps={{
                    color: 'cyan',
                    variant: 'soft'
                }}
                title={t('hwid-inspector-table.widget.hwid-devices-list')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
