import { Grid } from '@mantine/core';
import { BREADCRUMBS } from '@/pages/dashboard/users/ui/components/constants';
import { Page } from '@/shared/ui/page';
import { PageHeader } from '@/shared/ui/page-header';
import { UsersMetrics } from '@/widgets/dashboard/users/users-metrics';
import { UserTableWidget } from '@/widgets/dashboard/users/users-table';
import { ViewUserModal } from '@/widgets/dashboard/users/view-user-modal';
import { IProps } from './interfaces';

export default function UsersPageComponent(props: IProps) {
  const {
    users,
    tabs,
    search,
    setSearch,
    searchBy,
    setSearchBy,
    columns,
    handleSortStatusChange,
    handlePageChange,
    handleRecordsPerPageChange,
    handleUpdate,
  } = props;

  return (
    <Page title="Users">
      <PageHeader title="Users" breadcrumbs={BREADCRUMBS} />

      <Grid>
        <Grid.Col span={12}>
          <UsersMetrics />
        </Grid.Col>

        <Grid.Col span={12}>
          <UserTableWidget
            tabs={tabs}
            search={search}
            setSearch={setSearch}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            columns={columns}
            handleSortStatusChange={handleSortStatusChange}
            handlePageChange={handlePageChange}
            handleRecordsPerPageChange={handleRecordsPerPageChange}
            handleUpdate={handleUpdate}
          />
        </Grid.Col>
      </Grid>

      <ViewUserModal />
    </Page>
  );
}
