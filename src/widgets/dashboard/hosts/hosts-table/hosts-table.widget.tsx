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
import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Box, Container } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { motion } from 'framer-motion'

import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { useReorderHosts } from '@shared/api/hooks'

import { IProps } from './interfaces'

export const HostsTableWidget = memo((props: IProps) => {
    const { configProfiles, hosts, selectedHosts, setSelectedHosts } = props
    const [state, handlers] = useListState(hosts || [])
    const [draggedHost, setDraggedHost] = useState<
        GetAllHostsCommand.Response['response'][number] | null
    >(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const parentOffsetRef = useRef(0)

    const { mutate: reorderHosts } = useReorderHosts()

    const virtualizer = useWindowVirtualizer({
        count: state.length,
        estimateSize: () => 80,
        overscan: 5,
        measureElement: (element) => {
            return element?.getBoundingClientRect().height ?? 80
        },
        scrollMargin: parentOffsetRef.current,
        getItemKey: (index) => state[index].uuid
    })

    const dataIds = useRef<UniqueIdentifier[]>([])
    dataIds.current = state.map((host) => host.uuid)

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
            if (!hosts || !state) {
                return
            }

            const hostsToReorder = hosts

            const updatedHosts = hostsToReorder.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            const hasOrderChanged = hostsToReorder?.some(
                (host, index) => host.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderHosts({ variables: { hosts: updatedHosts } })
            }
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(hosts || [])
    }, [hosts])

    useLayoutEffect(() => {
        parentOffsetRef.current = listRef.current?.offsetTop ?? 0
    }, [])

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            const draggedItem = state.find((item) => item.uuid === event.active.id)
            setDraggedHost(draggedItem || null)
        },
        [state]
    )

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event

            if (!over || active.id === over.id) {
                setDraggedHost(null)
                return
            }

            const oldIndex = dataIds.current.indexOf(active.id)
            const newIndex = dataIds.current.indexOf(over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newState = arrayMove(state, oldIndex, newIndex)
                handlers.setState(newState)
            }

            setDraggedHost(null)
        },
        [state, handlers]
    )

    const handleDragCancel = useCallback(() => {
        setDraggedHost(null)
    }, [])

    const toggleHostSelection = useCallback(
        (hostId: string) => {
            setSelectedHosts((prev) =>
                prev.includes(hostId) ? prev.filter((id) => id !== hostId) : [...prev, hostId]
            )
        },
        [setSelectedHosts]
    )

    if (!hosts || !configProfiles) {
        return null
    }

    if (hosts.length === 0) {
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
            <div
                ref={listRef}
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
                                        <HostCardWidget
                                            configProfiles={configProfiles}
                                            isSelected={selectedHosts.includes(item.uuid)}
                                            item={item}
                                            onSelect={() => toggleHostSelection(item.uuid)}
                                        />
                                    </motion.div>
                                </Box>
                            )
                        })}
                    </Container>
                </SortableContext>
            </div>

            <DragOverlay>
                {draggedHost && (
                    <Container p={0} size={'lg'} style={{ width: '100%' }}>
                        <HostCardWidget
                            configProfiles={configProfiles}
                            isDragOverlay
                            isSelected={selectedHosts.includes(draggedHost.uuid)}
                            item={draggedHost}
                            onSelect={() => toggleHostSelection(draggedHost.uuid)}
                        />
                    </Container>
                )}
            </DragOverlay>
        </DndContext>
    )
})
