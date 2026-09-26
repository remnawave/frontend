import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { move } from '@dnd-kit/helpers'
import {
    DragDropProvider,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent
} from '@dnd-kit/react'
import { Box, Container, Stack } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TbCpu } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { nodesQueryKeys, useGetNodes, useReorderNodes } from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import { NO_TAG, TagFilterBar } from '@shared/ui'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { sToMs } from '@shared/utils/time-utils'

import {
    useExperimentalFeature,
    useNodesActiveTag,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { NodeCardWidget } from '../node-card'
import { NodesSpotlightSearchWidget } from '../nodes-spotlight-search'
import { IProps } from './interfaces'
import styles from './NodesTable.module.css'

const EMPTY_NAMES: string[] = []

export const NodesTableWidget = memo((props: IProps) => {
    const { nodes, nodePlugins, nodeIntegrations } = props

    const activeTag = useNodesActiveTag()
    const { setNodesActiveTag } = useViewPreferencesStoreActions()
    const isNodeIntegrationsEnabled = useExperimentalFeature('nodeIntegrations')

    const visibleNodes = useMemo(() => {
        if (!nodes) return []
        if (activeTag === null) return nodes
        if (activeTag === NO_TAG) return nodes.filter((node) => (node.tags ?? []).length === 0)
        return nodes.filter((node) => (node.tags ?? []).includes(activeTag))
    }, [nodes, activeTag])

    const [state, handlers] = useListState(visibleNodes)

    const [isPollingEnabled, setIsPollingEnabled] = useState(true)
    const [draggedNode, setDraggedNode] = useState<
        GetNodesCommand.Response['response'][number] | null
    >(null)
    const [scrollMargin, setScrollMargin] = useState(0)
    const listRef = useRef<HTMLDivElement | null>(null)
    const prevStateRef = useRef(state)
    const isDraggingRef = useRef(false)
    const dragSnapshotRef = useRef<typeof state | null>(null)
    const activeTagRef = useRef(activeTag)
    activeTagRef.current = activeTag
    const isMobile = useIsMobile()

    useGetNodes({
        rQueryParams: {
            enabled: isPollingEnabled,
            refetchInterval: isPollingEnabled ? sToMs(5) : false
        }
    })

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

    const virtualizer = useWindowVirtualizer({
        count: state.length,
        estimateSize: () => (isMobile ? 190 : 90),
        overscan: 7,
        scrollMargin,
        getItemKey: (index) => state[index].uuid
    })

    useEffect(() => {
        ;(async () => {
            if (!state || state.length === 0) {
                return
            }

            if (isDraggingRef.current) {
                return
            }

            if (activeTagRef.current !== null) {
                prevStateRef.current = state
                return
            }

            const updatedNodes = state.map((node, index) => ({
                uuid: node.uuid,
                viewPosition: index
            }))

            const hasOrderChanged = prevStateRef.current?.some(
                (node, index) => state[index] && node.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderNodes({ variables: { nodes: updatedNodes } })
            }

            prevStateRef.current = state
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(visibleNodes)
        prevStateRef.current = visibleNodes
    }, [visibleNodes])

    useLayoutEffect(() => {
        if (listRef.current) {
            setScrollMargin(listRef.current.offsetTop)
        }
    }, [])

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            setIsPollingEnabled(false)
            isDraggingRef.current = true
            dragSnapshotRef.current = state
            const draggedItem = state.find((item) => item.uuid === event.operation.source?.id)
            setDraggedNode(draggedItem || null)
        },
        [state]
    )

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            handlers.setState((prev) => {
                const ids = prev.map((node) => node.uuid)
                const newIds = move(ids, event)
                if (newIds === ids) return prev

                const nodesByUuid = new Map(prev.map((node) => [node.uuid, node]))
                return newIds.map((uuid) => nodesByUuid.get(uuid)!)
            })
        },
        [handlers]
    )

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            isDraggingRef.current = false
            setIsPollingEnabled(true)
            setDraggedNode(null)

            const snapshot = dragSnapshotRef.current
            dragSnapshotRef.current = null

            if (event.canceled) {
                if (snapshot) {
                    prevStateRef.current = snapshot
                    handlers.setState(snapshot)
                }
                return
            }

            handlers.setState((prev) => [...prev])
        },
        [handlers]
    )

    const nodeNames = useMemo(() => {
        const pluginNameByUuid = new Map(
            (nodePlugins?.nodePlugins ?? []).map((plugin) => [plugin.uuid, plugin.name])
        )
        const integrationNameByUuid = isNodeIntegrationsEnabled
            ? new Map(
                  (nodeIntegrations?.nodeIntegrations ?? []).map((integration) => [
                      integration.uuid,
                      integration.name
                  ])
              )
            : null

        return new Map(
            (nodes ?? []).map((node) => [
                node.uuid,
                {
                    integrationsNames: integrationNameByUuid
                        ? (node.integrationUuids ?? [])
                              .map((uuid) => integrationNameByUuid.get(uuid))
                              .filter((name): name is string => name !== undefined)
                        : EMPTY_NAMES,
                    pluginsName: node.activePluginUuid
                        ? pluginNameByUuid.get(node.activePluginUuid)
                        : undefined
                }
            ])
        )
    }, [nodes, nodePlugins, nodeIntegrations, isNodeIntegrationsEnabled])

    const handleViewNode = (nodeUuid: string) => {
        showModal('nodes_editNodeModal', { nodeUuid })
    }

    if (!nodes || !nodePlugins || !nodeIntegrations) {
        return null
    }

    if (nodes.length === 0) {
        return <EmptyPageLayout icon={<TbCpu size={32} />} />
    }

    return (
        <>
            <TagFilterBar activeTag={activeTag} items={nodes} onChange={setNodesActiveTag} />

            <DragDropProvider
                modifiers={[RestrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
            >
                <div ref={listRef}>
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <Container fluid>
                            <Stack gap={0}>
                                {virtualizer.getVirtualItems().map((virtualItem) => {
                                    const item = state[virtualItem.index]
                                    if (!item) return null

                                    const names = nodeNames.get(item.uuid)

                                    return (
                                        <Box
                                            data-index={virtualItem.index}
                                            key={item.uuid}
                                            style={{
                                                position: 'absolute',
                                                marginLeft: isMobile ? '0px' : '16px',
                                                marginRight: isMobile ? '0px' : '16px',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                transform: `translateY(${
                                                    virtualItem.start -
                                                    virtualizer.options.scrollMargin
                                                }px)`,
                                                willChange: 'transform'
                                            }}
                                        >
                                            <div className={styles.nodeFadeIn}>
                                                <NodeCardWidget
                                                    disableReordering={activeTag !== null}
                                                    handleViewNode={handleViewNode}
                                                    index={virtualItem.index}
                                                    isMobile={isMobile}
                                                    node={item}
                                                    integrationsNames={
                                                        names?.integrationsNames ?? EMPTY_NAMES
                                                    }
                                                    pluginsName={names?.pluginsName}
                                                />
                                            </div>
                                        </Box>
                                    )
                                })}
                            </Stack>
                        </Container>
                    </div>
                </div>
                <DragOverlay>
                    {draggedNode && (
                        <Container fluid pl={0} pr={0}>
                            <NodeCardWidget
                                handleViewNode={handleViewNode}
                                index={0}
                                integrationsNames={
                                    nodeNames.get(draggedNode.uuid)?.integrationsNames ??
                                    EMPTY_NAMES
                                }
                                isDragOverlay
                                isMobile={isMobile}
                                node={draggedNode}
                                pluginsName={nodeNames.get(draggedNode.uuid)?.pluginsName}
                            />
                        </Container>
                    )}
                </DragOverlay>
            </DragDropProvider>
            {nodes && nodes.length > 0 && <NodesSpotlightSearchWidget nodes={nodes} />}
        </>
    )
})
