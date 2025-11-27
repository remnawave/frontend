/* eslint-disable no-nested-ternary */
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mantine/core'
import { HiServer } from 'react-icons/hi'
import { motion } from 'motion/react'
import { useState } from 'react'

import { MultiSelectNodesFeature } from '@features/dashboard/nodes/multi-select-nodes/multi-select-nodes.feature'
import { LinkedHostsDrawer } from '@widgets/dashboard/nodes/linked-hosts-drawer/linked-hosts-drawer.widget'
import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { NodesDataTableWidget } from '@widgets/dashboard/nodes/nodes-datatable/nodes-datatable.widget'
import { EditNodeByUuidModalWidget } from '@widgets/dashboard/nodes/edit-node-by-uuid-modal'
import { NodesRealtimeUsageMetrics } from '@widgets/dashboard/nodes/nodes-realtime-metrics'
import { EditNodeModalConnectorWidget } from '@widgets/dashboard/nodes/edit-node-modal'
import { NodeUsersUsageDrawer } from '@widgets/dashboard/nodes/node-users-usage-drawer'
import { CreateNodeModalWidget } from '@widgets/dashboard/nodes/create-node-modal'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'

import { IProps, NodesViewMode } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { nodes, isLoading } = props

    const { t } = useTranslation()

    const [viewMode, setViewMode] = useState<NodesViewMode>(NodesViewMode.CARDS)
    const [selectedRecords, setSelectedRecords] = useState<
        GetAllNodesCommand.Response['response'][number][]
    >([])

    return (
        <Page title={t('constants.nodes')}>
            <Grid>
                <Grid.Col span={12}>
                    <Stack>
                        <NodesRealtimeUsageMetrics />
                        <PageHeaderShared
                            actions={
                                <NodesHeaderActionButtonsFeature
                                    setViewMode={setViewMode}
                                    viewMode={viewMode}
                                />
                            }
                            icon={<HiServer size={24} />}
                            title={t('constants.nodes')}
                        />
                    </Stack>

                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : viewMode === NodesViewMode.TABLE ? (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{
                                duration: 0.5
                            }}
                        >
                            <NodesDataTableWidget
                                nodes={nodes}
                                selectedRecords={selectedRecords}
                                setSelectedRecords={setSelectedRecords}
                            />
                        </motion.div>
                    ) : (
                        <NodesTableWidget nodes={nodes} />
                    )}
                </Grid.Col>
            </Grid>

            <EditNodeModalConnectorWidget key="view-node-widget" />
            <EditNodeByUuidModalWidget key="edit-node-by-uuid-modal" />
            <CreateNodeModalWidget key="create-node-widget" />
            <NodeUsersUsageDrawer key="node-users-usage-drawer" />
            <LinkedHostsDrawer key="linked-hosts-drawer" />

            <MultiSelectNodesFeature
                selectedRecords={selectedRecords}
                setSelectedRecords={setSelectedRecords}
            />
        </Page>
    )
}
