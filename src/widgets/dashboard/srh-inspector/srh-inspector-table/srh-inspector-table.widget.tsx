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
import { TbExternalLink, TbRefresh, TbReportAnalytics, TbRestore } from 'react-icons/tb'
import { GetSubscriptionRequestHistoryCommand } from '@remnawave/backend-contract'
import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiUserCircle } from 'react-icons/pi'

import { useSrhInspectorTableColumns } from '@features/dashboard/srh-inspector/srh-inspector-table/model/use-srh-inspector-table-columns'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { useGetSubscriptionRequestHistory } from '@shared/api/hooks'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

export function SrhInspectorTableWidget() {
    const { t } = useTranslation()

    const tableColumns = useSrhInspectorTableColumns()
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
    } = useGetSubscriptionRequestHistory({
        query: params,
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const filteredData = useMemo(() => usersResponse, [usersResponse])

    const table = useMantineReactTable({
        columns: tableColumns,
        data: filteredData?.records ?? [],
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
                MRT_TableOptions<
                    GetSubscriptionRequestHistoryCommand.Response['response']['records'][number]
                >
            >['renderRowActions']
        >(
            ({ row }) => (
                <ActionIconGroup>
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
                    <ActionIcon
                        color="grape"
                        onClick={async () => {
                            window.open(`https://ipinfo.io/${row.original.requestIp}`, '_blank')
                        }}
                        size="input-sm"
                        variant="light"
                    >
                        <TbExternalLink size="1.5rem" />
                    </ActionIcon>
                </ActionIconGroup>
            ),
            []
        ),

        getRowId: (originalRow) => `${originalRow.id}`,
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
                icon={<TbReportAnalytics size={24} />}
                title={t('srh-inspector-table.widget.subscription-request-history')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
