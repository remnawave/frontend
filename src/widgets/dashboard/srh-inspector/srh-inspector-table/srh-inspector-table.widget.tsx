import { useSrhInspectorTableColumns } from '@features/dashboard/srh-inspector/srh-inspector-table/model/use-srh-inspector-table-columns'
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFullScreenButton,
    useMantineReactTable
} from '@kastov/mantine-react-table-open'
import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TbExternalLink,
    TbFilterOff,
    TbRefresh,
    TbReportAnalytics,
    TbRestore
} from 'react-icons/tb'

import { useGetSubscriptionRequestHistory } from '@shared/api/hooks'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DEFAULT_PAGINATION_STATE, useMrtTableBinding } from '@shared/lib/mrt-table-store'
import { ResolveUserActionShared } from '@shared/ui/resolve-user-action-icon'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

import {
    useSrhInspectorTableStore,
    useSrhInspectorTableStoreActions
} from '@entities/dashboard/srh-inspector/srh-inspector-table-store'

export function SrhInspectorTableWidget() {
    const { t } = useTranslation()

    const actions = useSrhInspectorTableStoreActions()
    const tableColumns = useSrhInspectorTableColumns()

    const { state: persistedTableState, handlers: persistedTableHandlers } =
        useMrtTableBinding(useSrhInspectorTableStore)

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(
        Object.fromEntries(tableColumns.map(({ accessorKey }) => [accessorKey, 'contains']))
    )

    usePreventTableBackScroll()

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: persistedTableState.columnFilters,
        filterModes: columnFilterFns,
        sorting: persistedTableState.sorting
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

    const table = useMantineReactTable({
        columns: tableColumns,
        data: usersResponse?.records ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: true,
        enableColumnOrdering: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            density: 'xxs',
            pagination: DEFAULT_PAGINATION_STATE,
            sorting: [{ id: 'id', desc: true }]
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
        rowCount: usersResponse?.total ?? 0,
        enableRowSelection: false,
        enableColumnPinning: true,
        positionToolbarAlertBanner: 'top',
        selectAllMode: 'page',
        state: {
            ...persistedTableState,
            columnFilterFns,
            isLoading,
            showColumnFilters: true,
            showAlertBanner: isError,
            showProgressBars: isFetching
        },
        enableRowActions: true,
        mantineFilterTextInputProps: () => ({
            placeholder: 'Filter by...'
        }),
        mantineTopToolbarProps: {
            style: {
                '--mrt-base-background-color': '#1b2027'
            }
        },
        mantineTableHeadProps: {
            style: {
                '--mrt-base-background-color': '#1b2027'
            }
        },
        mantineBottomToolbarProps: {
            style: {
                '--mrt-base-background-color': '#1b2027'
            }
        },
        mantinePaperProps: {
            style: {
                '--paper-radius': 'var(--mantine-radius-xs)'
            },
            withBorder: false
        },
        renderRowActions: ({ row }) => (
            <ActionIconGroup>
                <ResolveUserActionShared userId={row.original.userId} />
                <ActionIcon
                    color="grape"
                    onClick={async () => {
                        window.open(`https://ipinfo.io/${row.original.requestIp}`, '_blank')
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbExternalLink size="1.5rem" />
                </ActionIcon>
            </ActionIconGroup>
        ),

        getRowId: (originalRow) => `${originalRow.id}`,
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 110 }
        },
        renderToolbarInternalActions: ({ table: tableInstance }) => (
            <>
                <MRT_ToggleDensePaddingButton table={tableInstance} />
                <MRT_ToggleFullScreenButton table={tableInstance} />
                <MRT_ShowHideColumnsButton table={tableInstance} />
            </>
        )
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <ActionIconGroup>
                        <Tooltip label={t('common.action.update')} withArrow>
                            <ActionIcon
                                loading={isLoading}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRefresh size="24px" />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('action-group.feature.clear-filters')} withArrow>
                            <ActionIcon
                                color="gray"
                                loading={isLoading}
                                onClick={() => {
                                    refetch()

                                    table.resetPageIndex(false)
                                    table.resetSorting(false)
                                    table.resetPagination(false)
                                    table.resetColumnFilters(true)
                                    table.resetGlobalFilter(true)
                                }}
                                size="input-md"
                                variant="soft"
                            >
                                <TbFilterOff size="24px" />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('action-group.feature.reset-table')} withArrow>
                            <ActionIcon
                                color="gray"
                                loading={isLoading}
                                onClick={() => {
                                    refetch()
                                    actions.resetState()

                                    table.resetPageIndex(false)
                                    table.resetSorting(false)
                                    table.resetPagination(false)
                                    table.resetColumnFilters(true)
                                    table.resetGlobalFilter(true)
                                }}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRestore size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbReportAnalytics size={24} />}
                title={t('common.field.subscription-request-history')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
