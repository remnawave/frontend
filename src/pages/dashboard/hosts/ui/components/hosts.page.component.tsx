import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { HostsPageHeaderWidget } from '@widgets/dashboard/hosts/hosts-page-header'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsTableWidget } from '@widgets/dashboard/hosts/hosts-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const { t } = useTranslation()
    const { inbounds, hosts, isHostsLoading } = props

    return (
        <Page title={t('constants.hosts')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.hosts') }
                ]}
                title={t('constants.hosts')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <HostsPageHeaderWidget inbounds={inbounds} />

                    {isHostsLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <HostsTableWidget hosts={hosts} inbounds={inbounds} />
                    )}
                </Grid.Col>
            </Grid>

            <EditHostModalWidget key="edit-host-modal" />
            <CreateHostModalWidget key="create-host-modal" />
        </Page>
    )
}
