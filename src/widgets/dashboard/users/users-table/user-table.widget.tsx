import { ChangeEvent, useState } from 'react'

import { Button, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
    useDashboardStoreIsLoading,
    useDashboardStoreParams,
    useDashboardStoreTotalUsers,
    useDashboardStoreUsers,
    useDashboardStoreUsersLoading
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { useUserCreationModalStoreActions } from '@entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import { GetAllUsersCommand } from '@remnawave/backend-contract'
import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
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
    const isLoading = useDashboardStoreIsLoading()
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
                title="Users"
                description="List of all users"
                actions={
                    <>
                        <Group>
                            <Button
                                variant="default"
                                size="xs"
                                leftSection={<PiArrowsClockwise size="1rem" />}
                                onClick={handleRefresh}
                                loading={isRefreshing}
                            >
                                Update
                            </Button>

                            <Button
                                variant="default"
                                size="xs"
                                leftSection={<PiPlus size="1rem" />}
                                onClick={handleOpenCreateUserModal}
                            >
                                Create new user
                            </Button>
                        </Group>
                    </>
                }
            />

            <DataTable.Filters filters={filters.filters} onClear={filters.clear} />
            <DataTable.Tabs tabs={tabs.tabs} onChange={tabs.change} />

            <DataTable.Content>
                <DataTable.Table
                    withTableBorder
                    borderRadius="sm"
                    minHeight={150}
                    highlightOnHover
                    verticalSpacing="md"
                    horizontalSpacing="md"
                    noRecordsText="No users found"
                    recordsPerPageLabel="Users per page"
                    recordsPerPageOptions={[10, 20, 30, 50]}
                    onRecordsPerPageChange={handleRecordsPerPageChange}
                    paginationText={({ from, to, totalRecords }) =>
                        `${from} - ${to} / ${totalRecords} users`
                    }
                    page={params.offset / params.limit + 1}
                    onPageChange={handlePageChange}
                    records={users || []}
                    fetching={isUsersLoading}
                    recordsPerPage={params.limit}
                    totalRecords={totalUsers}
                    sortStatus={{
                        columnAccessor: params.orderBy || 'createdAt',
                        direction: params.orderDir || 'desc'
                    }}
                    onSortStatusChange={handleSortStatusChange}
                    columns={columns}
                />
            </DataTable.Content>
        </DataTable.Container>
    )
}
