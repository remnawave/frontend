/* eslint-disable camelcase */
import { MantineReactTable, MRT_SortingState, useMantineReactTable } from 'mantine-react-table'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import dayjs from 'dayjs'

import { useBandwidthTableColumns } from '@features/dashboard/nodes-bandwidth-table/bandwidth-table-columns/model/use-bandwidth-table-columns'
import { DataTableShared } from '@shared/ui/table'
import { useGetNodes } from '@shared/api/hooks'

import { customIcons } from './constants'

export function NodesBandwidthTableWidget() {
    const {
        data: nodes,
        isFetching,
        isError,
        isLoading
    } = useGetNodes({
        rQueryParams: {
            select: (data: unknown) => {
                const nodes = data as GetAllNodesCommand.Response['response']
                return nodes.filter((node) => node.isTrafficTrackingActive)
            }
        }
    })
    const tableColumns = useBandwidthTableColumns()

    const [sorting, setSorting] = useState<MRT_SortingState>([])

    const table = useMantineReactTable({
        columns: tableColumns,
        data: nodes ?? [],
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableColumnFilterModes: false,

        initialState: {
            showColumnFilters: false,
            density: 'xs',
            pagination: {
                pageIndex: 0,
                pageSize: 300
            }
        },

        icons: customIcons,
        enableColumnResizing: true,

        /* prettier-ignore */
        mantineToolbarAlertBannerProps: isError ? {
            color: 'red',
            children: 'Error loading data'
        } : undefined,

        onSortingChange: setSorting,
        mantinePaperProps: {
            style: { '--paper-radius': 'var(--mantine-radius-xs)' },
            withBorder: false
        },
        enableColumnPinning: true,
        enablePagination: false,
        state: {
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting
        }
    })

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                description="Only nodes with active traffic tracking are displayed"
                title={`Today: ${dayjs().format('DD MMMM')}`}
            />
            <DataTableShared.Content>
                <MantineReactTable table={table} />
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
