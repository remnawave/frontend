import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { Button, Group } from '@mantine/core'
import { useState } from 'react'

import {
    useDashboardStoreParams,
    useDashboardStoreTotalUsers,
    useDashboardStoreUsers,
    useDashboardStoreUsersLoading
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { useUserCreationModalStoreActions } from '@entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import { DataTable } from '@/shared/ui/stuff/data-table'

import { IProps } from './interfaces'

export function UserTableWidget(props: IProps) {
    const {
        tabs: tabsProps,
        columns,
        handleSortStatusChange,
        handlePageChange,
        handleRecordsPerPageChange,
        handleUpdate
    } = props

    const { tabs, filters } = tabsProps

    const [isRefreshing, setIsRefreshing] = useState(false)

    const params = useDashboardStoreParams()
    const isUsersLoading = useDashboardStoreUsersLoading()
    const users = useDashboardStoreUsers()
    const totalUsers = useDashboardStoreTotalUsers()
    const userCreationModalActions = useUserCreationModalStoreActions()

    const handleRefresh = async () => {
        setIsRefreshing(true)

        handleUpdate()
        setTimeout(() => {
            notifications.show({
                title: 'Success',
                message: 'Users fetched successfully'
            })

            setIsRefreshing(false)
        }, 500)
    }

    const handleOpenCreateUserModal = async () => {
        userCreationModalActions.changeModalState(true)
    }

    return (
        <DataTable.Container>
            <DataTable.Title
                actions={
                    <>
                        <Group>
                            <Button
                                leftSection={<PiArrowsClockwise size="1rem" />}
                                loading={isRefreshing}
                                onClick={handleRefresh}
                                size="xs"
                                variant="default"
                            >
                                Update
                            </Button>

                            <Button
                                leftSection={<PiPlus size="1rem" />}
                                onClick={handleOpenCreateUserModal}
                                size="xs"
                                variant="default"
                            >
                                Create new user
                            </Button>
                        </Group>
                    </>
                }
                description="List of all users"
                title="Users"
            />

            <DataTable.Filters filters={filters.filters} onClear={filters.clear} />
            <DataTable.Tabs onChange={tabs.change} tabs={tabs.tabs} />

            <DataTable.Content>
                <DataTable.Table
                    borderRadius="sm"
                    columns={columns}
                    fetching={isUsersLoading}
                    highlightOnHover
                    horizontalSpacing="md"
                    minHeight={150}
                    noRecordsText="No users found"
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handleRecordsPerPageChange}
                    onSortStatusChange={handleSortStatusChange}
                    page={params.offset / params.limit + 1}
                    paginationText={({ from, to, totalRecords }) =>
                        `${from} - ${to} / ${totalRecords} users`
                    }
                    records={users || []}
                    recordsPerPage={params.limit}
                    recordsPerPageLabel="Users per page"
                    recordsPerPageOptions={[10, 20, 30, 50]}
                    sortStatus={{
                        columnAccessor: params.orderBy || 'createdAt',
                        direction: params.orderDir || 'desc'
                    }}
                    totalRecords={totalUsers}
                    verticalSpacing="md"
                    withTableBorder
                />
            </DataTable.Content>
        </DataTable.Container>
    )
}
