import { Grid } from '@mantine/core'

import { useNodesStoreIsNodesLoading } from '@entitites/dashboard/nodes/nodes-store/nodes-store'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { NodesPageHeaderWidget } from '@widgets/dashboard/nodes/nodes-page-header'
import { EditNodeModalWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { LoadingScreen, Page, PageHeader } from '@/shared/ui'

import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { nodes } = props

    const isNodesLoading = useNodesStoreIsNodesLoading()

    return (
        <Page title="Nodes">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Nodes" />

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
