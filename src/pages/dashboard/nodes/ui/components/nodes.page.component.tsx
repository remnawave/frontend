import { Grid } from '@mantine/core'
import { useHostsStoreIsHostsLoading } from '@entitites/dashboard'
import { useNodesStoreIsNodesLoading } from '@entitites/dashboard/nodes/nodes-store/nodes-store'
import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsPageHeaderWidget } from '@widgets/dashboard/hosts/hosts-page-header'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { EditNodeModalWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { NodeCardWidget } from '@widgets/dashboard/nodes/node-card'
import { NodesPageHeaderWidget } from '@widgets/dashboard/nodes/nodes-page-header'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { LoadingScreen, Page, PageHeader } from '@/shared/ui'
import { HostsTableWidget } from '@/widgets/dashboard/hosts/hosts-table'
import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { nodes } = props

    const isNodesLoading = useNodesStoreIsNodesLoading()

    return (
        <Page title="Nodes">
            <PageHeader title="Nodes" breadcrumbs={BREADCRUMBS} />

            <Grid>
                <Grid.Col span={12}>
                    <NodesPageHeaderWidget />

                    {isNodesLoading && nodes === null ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <NodesTableWidget nodes={nodes} />
                    )}
                </Grid.Col>
            </Grid>

            <EditNodeModalWidget />
            <CreateNodeModalWidget />
        </Page>
    )
}
