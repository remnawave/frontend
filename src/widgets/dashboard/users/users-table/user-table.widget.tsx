import { ChangeEvent, useState } from 'react';
import { GetAllUsersCommand } from '@remnawave/backend-contract';
import { LuRefreshCcw } from 'react-icons/lu';
import { PiArrowCircleDownDuotone, PiDownload } from 'react-icons/pi';
import { Box, Button, Group, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    useDashboardStoreIsLoading,
    useDashboardStoreParams,
    useDashboardStoreTotalUsers,
    useDashboardStoreUsers,
} from '@/entitites/dashboard/dashboard-store/dashboard-store';
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
} from '@/entitites/dashboard/user-modal-store/user-modal-store';
import { AddButton } from '@/shared/ui/stuff/add-button';
import { DataTable } from '@/shared/ui/stuff/data-table';
import { IProps } from './interfaces';

export function UserTableWidget(props: IProps) {
    const {
        search,
        setSearch,
        searchBy,
        setSearchBy,
        tabs: tabsProps,
        columns,
        handleSortStatusChange,
        handlePageChange,
        handleRecordsPerPageChange,
        handleUpdate,
    } = props;

    const { tabs, filters } = tabsProps;
    const [isRefreshing, setIsRefreshing] = useState(false);

    const params = useDashboardStoreParams();
    const isLoading = useDashboardStoreIsLoading();
    const users = useDashboardStoreUsers();
    const totalUsers = useDashboardStoreTotalUsers();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const handleSelectSearch = (value: string | null) => {
        if (!value) {
            return;
        }
        setSearchBy(value as GetAllUsersCommand.SearchableField);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);

        handleUpdate();
        setTimeout(() => {
            notifications.show({
                title: 'Success',
                message: 'Users fetched successfully',
            });

            setIsRefreshing(false);
        }, 1000);
    };

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
                                leftSection={<LuRefreshCcw size="1rem" />}
                                onClick={handleRefresh}
                                loading={isRefreshing}
                            >
                                Update
                            </Button>

                            <AddButton variant="default" size="xs">
                                Create new user
                            </AddButton>
                        </Group>
                    </>
                }
            />

            <DataTable.Filters filters={filters.filters} onClear={filters.clear} />
            <DataTable.Tabs tabs={tabs.tabs} onChange={tabs.change} />

            {/* <Group mb="md">
        <TextInput placeholder="Search..." value={search} onChange={handleSearch} />
        <Select
          data={GetAllUsersCommand.SearchableFields}
          value={searchBy}
          onChange={handleSelectSearch}
        />
      </Group> */}

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
                    fetching={isLoading}
                    recordsPerPage={params.limit}
                    totalRecords={totalUsers}
                    sortStatus={{
                        columnAccessor: params.orderBy || 'createdAt',
                        direction: params.orderDir || 'desc',
                    }}
                    onSortStatusChange={handleSortStatusChange}
                    columns={columns}
                />
            </DataTable.Content>
        </DataTable.Container>
    );
}
