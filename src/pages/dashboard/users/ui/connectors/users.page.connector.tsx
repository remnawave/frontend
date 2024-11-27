import { useEffect, useMemo, useState } from 'react';
import { GetAllUsersCommand } from '@remnawave/backend-contract';
import { DataTableColumn } from 'mantine-datatable';
import prettyBytes from 'pretty-bytes';
import { Box, Group, Indicator, MultiSelect, Select, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  useDashboardStoreActions,
  useDashboardStoreIsLoading,
  useDashboardStoreParams,
  useDashboardStoreSystemInfo,
  useDashboardStoreTotalUsers,
  useDashboardStoreUsers,
} from '@/entitites/dashboard/dashboard-store/dashboard-store';
import {
  useUserModalStoreActions,
  useUserModalStoreIsModalOpen,
} from '@/entitites/dashboard/user-modal-store/user-modal-store';
import { getTabDataUsers, User } from '@/entitites/dashboard/users/models';
import { DataUsageColumnEntity } from '@/entitites/dashboard/users/ui';
import { ShortUuidColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/short-uuid';
import { StatusColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/status/status.column';
import { UsernameColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/username/username.column';
import UsersPage from '@/pages/dashboard/users/ui/components/users.page';
import UsersPageComponent from '@/pages/dashboard/users/ui/components/users.page';
import { AddButton } from '@/shared/ui/stuff/add-button';
import { DataTable } from '@/shared/ui/stuff/data-table';

export function UsersPageConnector() {
  const users = useDashboardStoreUsers();
  const isLoading = useDashboardStoreIsLoading();
  const totalUsers = useDashboardStoreTotalUsers();
  const params = useDashboardStoreParams();
  const actions = useDashboardStoreActions();
  const systemInfo = useDashboardStoreSystemInfo();

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [searchBy, setSearchBy] = useState<GetAllUsersCommand.SearchableField>('username');

  const dataTab = getTabDataUsers({
    totalUsers: systemInfo?.users.totalUsers,
    activeUsers: systemInfo?.users.statusCounts.ACTIVE,
    disabledUsers: systemInfo?.users.statusCounts.DISABLED,
    expiredUsers: systemInfo?.users.statusCounts.EXPIRED,
    limitedUsers: systemInfo?.users.statusCounts.LIMITED,
  });

  const [debouncedFilters] = useDebouncedValue(dataTab.filters.filters, 300);

  useEffect(() => {
    actions.getSystemInfo();

    const filterEntry = Object.entries(debouncedFilters).find(([_, filter]) => filter?.value);

    const searchParams = filterEntry
      ? {
          search: String(filterEntry[1].value),
          searchBy: filterEntry[0] as GetAllUsersCommand.SearchableField,
        }
      : {
          search: dataTab.tabs.value === '*' ? '' : dataTab.tabs.value,
          searchBy: dataTab.tabs.value === '*' ? ('username' as const) : ('status' as const),
        };

    actions.getUsers(searchParams);
  }, [dataTab.tabs.value, debouncedFilters]);

  // useEffect(() => {
  //   actions.getSystemInfo();
  //   actions.getUsers({
  //     search: dataTab.tabs.value === '*' ? debouncedSearch : dataTab.tabs.value,
  //     searchBy: dataTab.tabs.value === '*' ? searchBy : 'status',
  //   });
  // }, [debouncedSearch, searchBy, dataTab.tabs.value]);

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * params.limit;
    actions.getUsers({ offset });
  };

  const handleRecordsPerPageChange = (limit: number) => {
    actions.getUsers({ limit, offset: 0 });
  };

  const handleSortStatusChange = (status: {
    columnAccessor: string;
    direction: 'asc' | 'desc';
  }) => {
    actions.getUsers({
      orderBy: status.columnAccessor as GetAllUsersCommand.SortableField,
      orderDir: status.direction,
    });
  };

  const handleUpdate = () => {
    actions.getUsers({ offset: 0 });
  };

  // User Modal
  const isModalOpen = useUserModalStoreIsModalOpen();
  const userModalActions = useUserModalStoreActions();

  const handleOpenModal = async (userUuid: string) => {
    await userModalActions.setUserUuid(userUuid);
    console.log('userUuid', userUuid);
    userModalActions.changeModalState(true);
    // !TODO: Ваня помоги
  };

  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        accessor: 'shortUuid' as const,
        title: 'Sub-link',
        width: 50,
        sortable: true,
        filterable: true,
        filter: (
          <TextInput
            placeholder="Search by subscription link"
            value={dataTab.filters.filters.shortUuid?.value as string}
            onChange={(e) =>
              dataTab.filters.change({
                name: 'shortUuid',
                label: 'Sub-link',
                value: e.currentTarget.value,
              })
            }
          />
        ),
        render: (user) => <ShortUuidColumnEntity user={user} />,
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
                value: e.currentTarget.value,
              })
            }
          />
        ),
        render: (user) => <UsernameColumnEntity user={user} />,
      },
      {
        accessor: 'expireAt' as const,
        title: 'Status',
        width: 100,
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
                value,
              })
            }
          />
        ),
        render: (user) => <StatusColumnEntity user={user} />,
      },
      {
        accessor: 'usedTrafficBytes' as const,
        title: 'Data usage',
        width: 150,
        sortable: true,
        render: (user) => <DataUsageColumnEntity user={user} />,
      },
      {
        accessor: 'actions',
        title: 'Actions',
        textAlign: 'right',
        width: 100,
        render: (user) => <DataTable.Actions onView={() => handleOpenModal(user.uuid)} />,
      },
    ],
    []
  );

  return (
    <UsersPageComponent
      tabs={dataTab}
      users={users || []}
      setSearch={setSearch}
      setSearchBy={setSearchBy}
      search={search}
      searchBy={searchBy}
      columns={columns}
      handleSortStatusChange={handleSortStatusChange}
      handlePageChange={handlePageChange}
      handleRecordsPerPageChange={handleRecordsPerPageChange}
      handleUpdate={handleUpdate}
    />
  );
}
