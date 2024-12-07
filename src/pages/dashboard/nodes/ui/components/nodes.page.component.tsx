import { Grid } from '@mantine/core'

import { EditNodeModalConnectorWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { NodesPageHeaderWidget } from '@widgets/dashboard/nodes/nodes-page-header'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'

import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { nodes, isLoading } = props

    return (
        <Page title="Nodes">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Nodes" />

            <Grid>
                <Grid.Col span={12}>
                    <NodesPageHeaderWidget />

                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <NodesTableWidget nodes={nodes} />
                    )}
                </Grid.Col>
            </Grid>

            <EditNodeModalConnectorWidget key="view-node-widget" />
            <CreateNodeModalWidget key="create-node-widget" />
        </Page>
    )
}
