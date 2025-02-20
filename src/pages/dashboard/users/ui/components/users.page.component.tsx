import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { CreateUserModalWidget } from '@widgets/dashboard/users/create-user-modal'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { UserTableWidget } from '@widgets/dashboard/users/users-table'
import { UsersMetrics } from '@widgets/dashboard/users/users-metrics'
import { PageHeader } from '@shared/ui/page-header'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

export default function UsersPageComponent() {
    const { t } = useTranslation()

    return (
        <Page title={t('constants.users')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.users') }
                ]}
                title={t('constants.users')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <UsersMetrics />
                </Grid.Col>

                <Grid.Col span={12}>
                    <UserTableWidget />
                </Grid.Col>
            </Grid>

            <ViewUserModal key="view-user-modal" />
            <CreateUserModalWidget key="create-user-widget" />
        </Page>
    )
}
