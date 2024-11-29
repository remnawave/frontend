import { useEffect, useMemo } from 'react'

import { MultiSelect, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
    useDashboardStoreActions,
    useDashboardStoreParams,
    useDashboardStoreSystemInfo
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { useUserCreationModalStoreIsModalOpen } from '@entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen
} from '@entitites/dashboard/user-modal-store/user-modal-store'
import { getTabDataUsers, User } from '@entitites/dashboard/users/models'
import { DataUsageColumnEntity } from '@entitites/dashboard/users/ui'
import { ShortUuidColumnEntity } from '@entitites/dashboard/users/ui/table-columns/short-uuid'
import { StatusColumnEntity } from '@entitites/dashboard/users/ui/table-columns/status'
import { UsernameColumnEntity } from '@entitites/dashboard/users/ui/table-columns/username'
import { ViewUserActionFeature } from '@features/ui/dashboard/users/view-user-action'
import { GetAllUsersCommand } from '@remnawave/backend-contract'
import { DataTable } from '@shared/ui/stuff/data-table'
import { DataTableColumn } from 'mantine-datatable'
import UsersPageComponent from '../components/users.page.component'

export function UsersPageConnector() {
    const params = useDashboardStoreParams()
    const actions = useDashboardStoreActions()
    const systemInfo = useDashboardStoreSystemInfo()

    const isModalOpen = useUserModalStoreIsModalOpen()
    const userModalActions = useUserModalStoreActions()

    // create user modal
    const isCreateUserModalOpen = useUserCreationModalStoreIsModalOpen()

    const dataTab = getTabDataUsers({
        totalUsers: systemInfo?.users.totalUsers,
        activeUsers: systemInfo?.users.statusCounts.ACTIVE,
        disabledUsers: systemInfo?.users.statusCounts.DISABLED,
        expiredUsers: systemInfo?.users.statusCounts.EXPIRED,
        limitedUsers: systemInfo?.users.statusCounts.LIMITED
    })

    const [debouncedFilters] = useDebouncedValue(dataTab.filters.filters, 300)

    useEffect(() => {
        return () => {
            actions.resetState()
            userModalActions.resetState()
        }
    }, [])

    useEffect(() => {
        if (isModalOpen || isCreateUserModalOpen) return
        actions.getSystemInfo()

        const filterEntry = Object.entries(debouncedFilters).find(([_, filter]) => filter?.value)

        let searchParams: {
            search: string | undefined
            searchBy: GetAllUsersCommand.SearchableField
        }

        if (filterEntry) {
            searchParams = {
                search: String(filterEntry[1].value),
                searchBy: filterEntry[0] as GetAllUsersCommand.SearchableField
            }
        } else {
            searchParams = {
                search: dataTab.tabs.value === '*' ? '' : dataTab.tabs.value,
                searchBy: dataTab.tabs.value === '*' ? ('username' as const) : ('status' as const)
            }
        }

        actions.getUsers(searchParams)
    }, [dataTab.tabs.value, debouncedFilters, isModalOpen, isCreateUserModalOpen])

    const handlePageChange = (page: number) => {
        const offset = (page - 1) * params.limit
        actions.getUsers({ offset })
    }

    const handleRecordsPerPageChange = (limit: number) => {
        actions.getUsers({ limit, offset: 0 })
    }

    const handleSortStatusChange = (status: {
        columnAccessor: string
        direction: 'asc' | 'desc'
    }) => {
        actions.getUsers({
            orderBy: status.columnAccessor as GetAllUsersCommand.SortableField,
            orderDir: status.direction
        })
    }

    const handleUpdate = async () => {
        await actions.getUsers({ offset: 0 })
    }

    const columns = useMemo<DataTableColumn<User>[]>(
        () => [
            {
                accessor: 'shortUuid' as const,
                title: 'Sub-link',
                width: 50,
                filterable: true,
                filter: (
                    <TextInput
                        placeholder="Search by subscription link"
                        value={dataTab.filters.filters.shortUuid?.value as string}
                        onChange={(e) =>
                            dataTab.filters.change({
                                name: 'shortUuid',
                                label: 'Sub-link',
                                value: e.currentTarget.value
                            })
                        }
                    />
                ),
                render: (user) => <ShortUuidColumnEntity user={user} />
            },
            {
                accessor: 'username' as const,
                title: 'Username',
                width: 100,
                sortable: true,

                filter: (
                    <TextInput
                        placeholder="Search by username"
                        value={dataTab.filters.filters.username?.value as string}
                        onChange={(e) =>
                            dataTab.filters.change({
                                name: 'username',
                                label: 'Username',
                                value: e.currentTarget.value
                            })
                        }
                    />
                ),
                render: (user) => <UsernameColumnEntity user={user} />
            },
            {
                accessor: 'expireAt' as const,
                title: 'Status',
                width: 90,
                align: 'center',
                sortable: true,
                filter: (
                    <MultiSelect
                        w="10rem"
                        data={['ACTIVE', 'DISABLED', 'EXPIRED', 'LIMITED']}
                        value={dataTab.filters.filters.status?.value as string[]}
                        onChange={(value) =>
                            dataTab.filters.change({
                                name: 'status',
                                label: 'Status',
                                value
                            })
                        }
                    />
                ),
                render: (user) => <StatusColumnEntity user={user} />
            },
            {
                accessor: 'usedTrafficBytes' as const,
                title: 'Data usage',
                width: 150,
                sortable: true,
                render: (user) => <DataUsageColumnEntity user={user} />
            },
            {
                accessor: 'actions',
                title: 'Actions',
                textAlign: 'right',
                width: 50,
                render: (user) => <ViewUserActionFeature userUuid={user.uuid} />
            }
        ],
        []
    )

    return (
        <UsersPageComponent
            tabs={dataTab}
            columns={columns}
            handleSortStatusChange={handleSortStatusChange}
            handlePageChange={handlePageChange}
            handleRecordsPerPageChange={handleRecordsPerPageChange}
            handleUpdate={handleUpdate}
        />
    )
}
