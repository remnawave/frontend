import { UserActionGroupFeature } from '@features/dashboard/users/users-action-group'
import { useUserTableColumns } from '@features/dashboard/users/users-table/model/use-table-columns'
import { UsersTableSelectionFeature } from '@features/ui/dashboard/users/users-table-selection/users-table-selection.feature'
import {
    MantineReactTable,
    MRT_ColumnFilterFnsState,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFullScreenButton,
    useMantineReactTable
} from '@kastov/mantine-react-table-open'
import { ActionIcon, ActionIconGroup, Badge, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiUsersDuotone } from 'react-icons/pi'
import { TbBolt, TbEdit } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetNodes,
    useGetUsers,
    useGetUserTags
} from '@shared/api/hooks'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DEFAULT_PAGINATION_STATE, useMrtTableBinding } from '@shared/lib/mrt-table-store'
import { DataTableShared } from '@shared/ui/table'
import { sToMs } from '@shared/utils/time-utils'

import {
    useUsersTableSelectionStoreActions,
    useUsersTableSelectionStoreTableSelection
} from '@entities/dashboard/users/users-table-selection'
import { useUsersTableStore } from '@entities/dashboard/users/users-table-store'

export function UserTableWidget() {
    const { t } = useTranslation()

    const { data: internalSquads } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()
    const { data: nodes } = useGetNodes()
    const { data: tags } = useGetUserTags()

    const tableColumns = useUserTableColumns(internalSquads, externalSquads, nodes)
    const usersTableSelectionStoreActions = useUsersTableSelectionStoreActions()
    const tableSelection = useUsersTableSelectionStoreTableSelection()
    const { state: persistedTableState, handlers: persistedTableHandlers } =
        useMrtTableBinding(useUsersTableStore)

    const defaultFilterFns: Record<string, string> = {
        hwidDeviceLimit: 'equals',
        tag: 'equals',
        trafficLimitBytes: 'between'
    }

    const [columnFilterFns, setColumnFilterFns] = useState<MRT_ColumnFilterFnsState>(() =>
        Object.fromEntries(
            tableColumns.map(({ accessorKey }) => [
                accessorKey,
                defaultFilterFns[accessorKey!] ?? 'contains'
            ])
        )
    )

    usePreventTableBackScroll()

    const params = {
        start: persistedTableState.pagination.pageIndex * persistedTableState.pagination.pageSize,
        size: persistedTableState.pagination.pageSize,
        filters: persistedTableState.columnFilters.filter(({ value }) =>
            Array.isArray(value)
                ? value.some((bound) => bound !== null && bound !== undefined && bound !== '')
                : value !== null && value !== undefined && value !== ''
        ),
        filterModes: columnFilterFns,
        sorting: persistedTableState.sorting
    }

    const {
        data: usersResponse,
        isError,
        isFetching,
        isLoading,
        refetch
    } = useGetUsers({
        query: params,
        rQueryParams: {
            // enabled: bulkUsersActionsStoreActions.getUuidLength() === 0,
            refetchInterval:
                usersTableSelectionStoreActions.getIdsLength() === 0 ? sToMs(25) : false
        }
    })

    const table = useMantineReactTable({
        columns: tableColumns,
        data: usersResponse?.users ?? [],
        enableFacetedValues: true,
        getFacetedUniqueValues: (_table, columnId) => () => {
            if (columnId === 'tag') {
                return new Map<string, number>(tags?.tags.map((tag) => [tag, 0]) ?? [])
            }
            if (columnId === 'status') {
                return new Map<string, number>(
                    ['ACTIVE', 'DISABLED', 'LIMITED', 'EXPIRED'].map((status) => [status, 0]) ?? []
                )
            }
            return new Map<string, number>()
        },
        columnFilterDisplayMode: 'subheader',
        mantineFilterSelectProps: ({ column }) => {
            const value = column.getFilterValue()
            return {
                clearable: value !== undefined && value !== null && value !== ''
            }
        },
        mantineFilterMultiSelectProps: ({ column }) => {
            const value = column.getFilterValue()
            const count = Array.isArray(value) ? value.length : 0
            return {
                clearable: count > 0,
                renderPill: () => null,
                ...(count > 0 && {
                    leftSection: <Badge variant="soft">{count}</Badge>,
                    placeholder: '',
                    clearSectionMode: 'clear'
                })
            }
        },
        // mantineTableBodyCellProps: { style: { padding: '2px 6px' } },
        enableFullScreenToggle: true,
        enableSortingRemoval: true,
        enableGlobalFilter: false,
        enableClickToCopy: false,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        columnFilterModeOptions: ['contains'],
        initialState: {
            density: 'xxs',
            pagination: DEFAULT_PAGINATION_STATE,
            sorting: [{ id: 'id', desc: true }]
        },
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
        enableDensityToggle: true,
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
        renderToolbarInternalActions: ({ table: tableInstance }) => (
            <>
                <ActionIconGroup>
                    <Tooltip label={t('common.action.bulk-actions')} withArrow>
                        <ActionIcon
                            color="green"
                            onClick={() => showModal('users_bulkAllUsersActionsModal')}
                            size="lg"
                            variant="soft"
                        >
                            <TbBolt size={20} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('common.action.bulk-edit')} withArrow>
                        <ActionIcon
                            color="red"
                            onClick={() => showModal('users_bulkAllUsersUpdateModal')}
                            size="lg"
                            variant="soft"
                        >
                            <TbEdit size={20} />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>
                <ActionIconGroup>
                    <MRT_ToggleDensePaddingButton table={tableInstance} />
                    <MRT_ToggleFullScreenButton table={tableInstance} />
                    <MRT_ShowHideColumnsButton table={tableInstance} />
                </ActionIconGroup>
            </>
        ),
        state: {
            ...persistedTableState,
            columnFilterFns,
            isLoading,
            showAlertBanner: isError,
            showColumnFilters: true,
            showProgressBars: isFetching,
            rowSelection: tableSelection
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: async () => {
                if (row.id === 'mrt-row-empty' || row.original.id === undefined) {
                    notifications.show({
                        title: 'Nice try!',
                        message: 'Nothing to show...',
                        color: 'indigo'
                    })
                    return
                }

                showModal('users_viewUserModal', { userId: row.original.id })

                // await userModalActions.setUserUuid(row.original.uuid)
                // userModalActions.changeModalState(true)
            },
            style: {
                cursor: 'pointer'
            }
        }),
        onRowSelectionChange: usersTableSelectionStoreActions.setTableSelection,
        getRowId: (originalRow) => originalRow.id?.toString() ?? 'unknown'
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
        </DataTableShared.Container>
    )
}
