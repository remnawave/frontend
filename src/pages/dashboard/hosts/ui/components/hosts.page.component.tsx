import { Grid } from '@mantine/core'
import { useHostsStoreIsHostsLoading } from '@entitites/dashboard'
import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsPageHeaderWidget } from '@widgets/dashboard/hosts/hosts-page-header'
import { LoadingScreen, Page, PageHeader } from '@/shared/ui'
import { HostsTableWidget } from '@/widgets/dashboard/hosts/hosts-table'
import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const { hosts, inbounds } = props

    const isHostsLoading = useHostsStoreIsHostsLoading()

    return (
        <Page title="Hosts">
            <PageHeader title="Hosts" breadcrumbs={BREADCRUMBS} />

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

            <EditHostModalWidget />
            <CreateHostModalWidget />
        </Page>
    )
}
