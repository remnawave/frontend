import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mantine/core'
import { motion } from 'motion/react'

import { LinkedHostsDrawer } from '@widgets/dashboard/nodes/linked-hosts-drawer/linked-hosts-drawer.widget'
import { NodesRealtimeUsageMetrics } from '@widgets/dashboard/nodes/nodes-realtime-metrics'
import { EditNodeModalConnectorWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { NodeUsersUsageDrawer } from '@widgets/dashboard/nodes/node-users-usage-drawer'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { NodesPageHeaderWidget } from '@widgets/dashboard/nodes/nodes-page-header'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { t } = useTranslation()

    const { nodes, isLoading } = props

    return (
        <Page title={t('constants.nodes')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    { label: t('constants.nodes') }
                ]}
                title={t('constants.nodes')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <Stack>
                        <NodesRealtimeUsageMetrics />
                        <NodesPageHeaderWidget />
                    </Stack>

                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{
                                duration: 0.5
                            }}
                        >
                            <NodesTableWidget nodes={nodes} />
                        </motion.div>
                    )}
                </Grid.Col>
            </Grid>

            <EditNodeModalConnectorWidget key="view-node-widget" />
            <CreateNodeModalWidget key="create-node-widget" />
            <NodeUsersUsageDrawer key="node-users-usage-drawer" />
            <LinkedHostsDrawer key="linked-hosts-drawer" />
        </Page>
    )
}
