import { MultiSelectNodesFeature } from '@features/dashboard/nodes/multi-select-nodes/multi-select-nodes.feature'
import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { Grid, Stack } from '@mantine/core'
/* eslint-disable no-nested-ternary */
import { GetNodesCommand } from '@remnawave/backend-contract'
import { NodesDataTableWidget } from '@widgets/dashboard/nodes/nodes-datatable/nodes-datatable.widget'
import { NodesRealtimeUsageMetrics } from '@widgets/dashboard/nodes/nodes-realtime-metrics'
import { NodesTableWidget } from '@widgets/dashboard/nodes/nodes-table'
import { motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiServer } from 'react-icons/hi'

import { queryClient } from '@shared/api'
import { nodesQueryKeys, useReorderNodes } from '@shared/api/hooks'
import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'

import {
    NODES_VIEW_MODE,
    useNodesViewMode,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { IProps } from './interfaces'

export default function NodesPageComponent(props: IProps) {
    const { nodes, isLoading } = props

    const { t } = useTranslation()

    const viewMode = useNodesViewMode()
    const { setNodesViewMode } = useViewPreferencesStoreActions()
    const [selectedRecords, setSelectedRecords] = useState<
        GetNodesCommand.Response['response'][number][]
    >([])

    const { mutate: reorderNodes } = useReorderNodes({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(nodesQueryKeys.getAllNodes.queryKey, data)
            },
            onError: () => {
                queryClient.invalidateQueries({ queryKey: nodesQueryKeys.getAllNodes.queryKey })
            }
        }
    })

    const moveSelected = useCallback(
        (mode: 'bottom' | 'down' | 'top' | 'up') => {
            if (!nodes || selectedRecords.length === 0) return
            const selected = new Set(selectedRecords.map((record) => record.uuid))

            let next: typeof nodes
            if (mode === 'top' || mode === 'bottom') {
                const sel = nodes.filter((node) => selected.has(node.uuid))
                const rest = nodes.filter((node) => !selected.has(node.uuid))
                next = mode === 'top' ? [...sel, ...rest] : [...rest, ...sel]
            } else {
                next = [...nodes]
                const offset = mode === 'up' ? -1 : 1
                const start = mode === 'up' ? 1 : next.length - 2
                const end = mode === 'up' ? next.length : -1
                const step = mode === 'up' ? 1 : -1

                for (let i = start; i !== end; i += step) {
                    const j = i + offset
                    if (selected.has(next[i].uuid) && !selected.has(next[j].uuid)) {
                        ;[next[i], next[j]] = [next[j], next[i]]
                    }
                }
            }

            const hasOrderChanged = nodes.some((node, index) => node.uuid !== next[index].uuid)
            if (!hasOrderChanged) return

            queryClient.setQueryData(nodesQueryKeys.getAllNodes.queryKey, next)
            reorderNodes({
                variables: {
                    nodes: next.map((node, index) => ({ uuid: node.uuid, viewPosition: index }))
                }
            })
        },
        [nodes, selectedRecords, reorderNodes]
    )

    return (
        <Page title={t('constants.nodes')}>
            <Grid>
                <Grid.Col span={12}>
                    <Stack>
                        <NodesRealtimeUsageMetrics isLoading={isLoading} nodes={nodes} />

                        <PageHeaderShared
                            actions={
                                <NodesHeaderActionButtonsFeature
                                    setViewMode={setNodesViewMode}
                                    viewMode={viewMode}
                                />
                            }
                            icon={<HiServer size={24} />}
                            title={t('constants.nodes')}
                        />
                    </Stack>

                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : viewMode === NODES_VIEW_MODE.TABLE ? (
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

            <MultiSelectNodesFeature
                moveSelected={moveSelected}
                selectedRecords={selectedRecords}
                setSelectedRecords={setSelectedRecords}
            />
        </Page>
    )
}
