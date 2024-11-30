import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { HostsPageHeaderWidget } from '@widgets/dashboard/hosts/hosts-page-header'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsTableWidget } from '@/widgets/dashboard/hosts/hosts-table'
import { useHostsStoreIsHostsLoading } from '@entitites/dashboard'
import { LoadingScreen, PageHeader, Page } from '@/shared/ui'
import { Grid } from '@mantine/core'

import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const { inbounds, hosts } = props

    const isHostsLoading = useHostsStoreIsHostsLoading()

    return (
        <Page title="Hosts">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Hosts" />

            <Grid>
                <Grid.Col span={12}>
                    <HostsPageHeaderWidget inbounds={inbounds} />

                    {isHostsLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <HostsTableWidget inbounds={inbounds} hosts={hosts} />
                    )}
                </Grid.Col>
            </Grid>

            <EditHostModalWidget />
            <CreateHostModalWidget />
        </Page>
    )
}
