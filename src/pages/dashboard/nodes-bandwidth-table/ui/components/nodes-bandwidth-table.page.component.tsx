import { Grid } from '@mantine/core'

import { NodesBandwidthTableWidget } from '@widgets/dashboard/nodes-bandwidth-table/table'
import { EditNodeModalConnectorWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'

import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function NodesBandwidthTablePageComponent(props: IProps) {
    const { isLoading } = props

    return (
        <Page title="Nodes bandwidth table">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Nodes bandwidth table" />

            <Grid>
                <Grid.Col span={12}>
                    {isLoading ? <LoadingScreen height="60vh" /> : <NodesBandwidthTableWidget />}
                </Grid.Col>
            </Grid>

            <EditNodeModalConnectorWidget key="view-node-widget" />
            <CreateNodeModalWidget key="create-node-widget" />
        </Page>
    )
}
