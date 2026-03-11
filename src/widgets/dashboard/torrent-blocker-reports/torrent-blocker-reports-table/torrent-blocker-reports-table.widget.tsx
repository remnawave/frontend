/* eslint-disable camelcase */
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_ColumnFiltersState,
    MRT_ColumnPinningState,
    MRT_PaginationState,
    MRT_SortingState,
    MRT_VisibilityState,
    useMantineReactTable
} from 'mantine-react-table'
import { TbExternalLink, TbFlame, TbJson, TbRefresh, TbRestore, TbTrash } from 'react-icons/tb'
import { ActionIcon, ActionIconGroup, Box, Tooltip } from '@mantine/core'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiUserCircle } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    useGetNodes,
    useGetTorrentBlockerReports,
    useGetTorrentBlockerStats,
    useTruncateTorrentBlockerReports
} from '@shared/api/hooks'
import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { preventBackScrollTables } from '@shared/utils/misc'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

import { useTbReportsTableColumns } from './use-tb-reports-table-columns'

export function TorrentBlockerReportsTableWidget() {
    const { t } = useTranslation()

    const { data: nodes } = useGetNodes()
    const { refetch: refetchTorrentBlockerStats } = useGetTorrentBlockerStats()

    const tableColumns = useTbReportsTableColumns(nodes)
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
        data: tbReportsResponse,
        isError,
        isFetching,
        isLoading,
        refetch
    } = useGetTorrentBlockerReports({
        query: params,
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const { mutate: truncateTorrentBlockerReports } = useTruncateTorrentBlockerReports()

    const handleTruncateTorrentBlockerReports = async () => {
        truncateTorrentBlockerReports({})
        refetch()
    }

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
        data: tbReportsResponse?.records ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: true,
        columnFilterModeOptions: ['contains', 'equals'],
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
        rowCount: tbReportsResponse?.total ?? 0,
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
        renderRowActions: ({ row }) => (
            <ActionIconGroup>
                <ActionIcon
                    onClick={async () => {
                        await userModalActions.setUserUuid(row.original.user.uuid)
                        userModalActions.changeModalState(true)
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <PiUserCircle size="1.5rem" />
                </ActionIcon>
                <ActionIcon
                    color="grape"
                    onClick={async () => {
                        window.open(
                            `https://ipinfo.io/${row.original.report.actionReport.ip}`,
                            '_blank'
                        )
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbExternalLink size="1.5rem" />
                </ActionIcon>

                <ActionIcon
                    color="gray"
                    onClick={async () => {
                        modals.open({
                            children: (
                                <Box>
                                    <JsonEditor
                                        collapse={3}
                                        data={JSON.parse(JSON.stringify(row.original.report))}
                                        indent={2}
                                        maxWidth="100%"
                                        rootName=""
                                        theme={githubDarkTheme}
                                        viewOnly
                                    />
                                </Box>
                            ),
                            title: (
                                <BaseOverlayHeader
                                    iconColor="shaded-gray"
                                    IconComponent={TbJson}
                                    iconVariant="soft"
                                    title="Raw Report"
                                />
                            ),
                            size: 'xl'
                        })
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbJson size="1.5rem" />
                </ActionIcon>
            </ActionIconGroup>
        ),

        getRowId: (originalRow) => `${originalRow.id}`,
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 130 }
        }
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                actions={
                    <ActionIconGroup>
                        <Tooltip
                            label={t('torrent-blocker-reports-table.widget.truncate-reports')}
                            withArrow
                        >
                            <ActionIcon
                                color="red"
                                loading={isLoading}
                                onClick={() => {
                                    modals.openConfirmModal({
                                        title: t('common.confirm-action'),
                                        children: t(
                                            'torrent-blocker-reports-table.widget.truncate-reports-description'
                                        ),
                                        centered: true,
                                        labels: {
                                            confirm: t('common.delete'),
                                            cancel: t('common.cancel')
                                        },
                                        confirmProps: {
                                            color: 'red'
                                        },
                                        cancelProps: {
                                            variant: 'subtle',
                                            color: 'gray'
                                        },
                                        onConfirm: handleTruncateTorrentBlockerReports
                                    })
                                }}
                                size="input-md"
                                variant="soft"
                            >
                                <TbTrash size="24px" />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('common.update')} withArrow>
                            <ActionIcon
                                loading={isLoading}
                                onClick={() => {
                                    refetch()
                                    refetchTorrentBlockerStats()
                                }}
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
                                }}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRestore size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                icon={<TbFlame size={24} />}
                iconProps={{
                    color: 'red',
                    variant: 'soft'
                }}
                title={t('constants.tb-reports')}
            />

            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
