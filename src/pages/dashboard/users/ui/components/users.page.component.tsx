import { Grid } from '@mantine/core'

import { CreateUserModalWidget } from '@/widgets/dashboard/users/create-user-modal'
import { BREADCRUMBS } from '@/pages/dashboard/users/ui/components/constants'
import { ViewUserModal } from '@/widgets/dashboard/users/view-user-modal'
import { UserTableWidget } from '@/widgets/dashboard/users/users-table'
import { UsersMetrics } from '@/widgets/dashboard/users/users-metrics'
import { PageHeader } from '@/shared/ui/page-header'
import { Page } from '@/shared/ui/page'

import { IProps } from './interfaces'

export default function UsersPageComponent(props: IProps) {
    const {
        tabs,
        columns,
        handleSortStatusChange,
        handlePageChange,
        handleRecordsPerPageChange,
        handleUpdate
    } = props

    return (
        <Page title="Users">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Users" />

            <Grid>
                <Grid.Col span={12}>
                    <UsersMetrics />
                </Grid.Col>

                <Grid.Col span={12}>
                    <UserTableWidget
                        columns={columns}
                        handlePageChange={handlePageChange}
                        handleRecordsPerPageChange={handleRecordsPerPageChange}
                        handleSortStatusChange={handleSortStatusChange}
                        handleUpdate={handleUpdate}
                        tabs={tabs}
                    />
                </Grid.Col>
            </Grid>

            <ViewUserModal />
            <CreateUserModalWidget />
        </Page>
    )
}
