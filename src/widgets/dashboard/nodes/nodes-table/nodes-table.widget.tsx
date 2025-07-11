import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Box, Container } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { motion } from 'framer-motion'

import { nodesQueryKeys, useGetNodes, useReorderNodes } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { sToMs } from '@shared/utils/time-utils'
import { queryClient } from '@shared/api'

import { NodeCardWidget } from '../node-card'
import { IProps } from './interfaces'

export const NodesTableWidget = memo((props: IProps) => {
    const { nodes } = props
    const [state, handlers] = useListState(nodes || [])
    const [isPollingEnabled, setIsPollingEnabled] = useState(true)
    const [draggedNode, setDraggedNode] = useState<
        GetAllNodesCommand.Response['response'][number] | null
    >(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const parentOffsetRef = useRef(0)
    const prevStateRef = useRef(state)

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
        estimateSize: () => 70,
        overscan: 5,
        measureElement: (element) => {
            return element?.getBoundingClientRect().height ?? 70
        },
        scrollMargin: parentOffsetRef.current,
        getItemKey: (index) => state[index].uuid
    })

    const dataIds = useRef<UniqueIdentifier[]>([])
    dataIds.current = state.map((node) => node.uuid)

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5
            }
        }),
        useSensor(KeyboardSensor, {})
    )

    useEffect(() => {
        ;(async () => {
            if (!state || state.length === 0) {
                return
            }

            const updatedNodes = state.map((node, index) => ({
                uuid: node.uuid,
                viewPosition: index
            }))

            const hasOrderChanged = prevStateRef.current?.some(
                (node, index) => node.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderNodes({ variables: { nodes: updatedNodes } })
            }

            prevStateRef.current = state
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(nodes || [])
        prevStateRef.current = nodes || []
    }, [nodes])

    useLayoutEffect(() => {
        parentOffsetRef.current = listRef.current?.offsetTop ?? 0
    }, [])

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            setIsPollingEnabled(false)
            const draggedItem = state.find((item) => item.uuid === event.active.id)
            setDraggedNode(draggedItem || null)
        },
        [state]
    )

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event

            if (!over || active.id === over.id) {
                setIsPollingEnabled(true)
                setDraggedNode(null)
                return
            }

            const oldIndex = dataIds.current.indexOf(active.id)
            const newIndex = dataIds.current.indexOf(over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newState = arrayMove(state, oldIndex, newIndex)
                handlers.setState(newState)
            }

            setIsPollingEnabled(true)
            setDraggedNode(null)
        },
        [state, handlers]
    )

    const handleDragCancel = useCallback(() => {
        setIsPollingEnabled(true)
        setDraggedNode(null)
    }, [])

    if (!nodes) {
        return null
    }

    if (nodes.length === 0) {
        return <EmptyPageLayout />
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
        >
            <div ref={listRef}>
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <SortableContext items={dataIds.current} strategy={verticalListSortingStrategy}>
                        <Container
                            p={0}
                            size={'lg'}
                            style={{
                                position: 'relative',
                                minHeight: '100px'
                            }}
                        >
                            {virtualizer.getVirtualItems().map((virtualItem) => {
                                const item = state[virtualItem.index]
                                if (!item) return null

                                return (
                                    <Box
                                        data-index={virtualItem.index}
                                        key={item.uuid}
                                        ref={virtualizer.measureElement}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            transform: `translateY(${
                                                virtualItem.start - virtualizer.options.scrollMargin
                                            }px)`
                                        }}
                                    >
                                        <motion.div
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <NodeCardWidget node={item} />
                                        </motion.div>
                                    </Box>
                                )
                            })}
                        </Container>
                    </SortableContext>
                </div>
            </div>
            <DragOverlay>
                {draggedNode && (
                    <Container p={0} size={'lg'} style={{ width: '100%' }}>
                        <NodeCardWidget isDragOverlay node={draggedNode} />
                    </Container>
                )}
            </DragOverlay>
        </DndContext>
    )
})
