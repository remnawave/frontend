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
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useListState, useMediaQuery } from '@mantine/hooks'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Box, Container, em, Stack } from '@mantine/core'
import { motion } from 'framer-motion'

import { HostsFiltersFeature } from '@features/dashboard/hosts/hosts-filters'
import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { useGetNodes, useReorderHosts } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

import { IProps } from './interfaces'

export const HostsTableWidget = memo((props: IProps) => {
    const { configProfiles, hosts, hostTags, selectedHosts, setSelectedHosts } = props
    const [state, handlers] = useListState(hosts || [])
    const [draggedHost, setDraggedHost] = useState<
        GetAllHostsCommand.Response['response'][number] | null
    >(null)
    const [searchValue, setSearchValue] = useState<null | string>(null)
    const [searchAddressValue, setSearchAddressValue] = useState<null | string>(null)

    const [highlightedHost, setHighlightedHost] = useState<null | string>(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const { data: nodes } = useGetNodes()
    const { mutate: reorderHosts } = useReorderHosts()

    const virtualizer = useWindowVirtualizer({
        count: state.length,
        estimateSize: () => (isMobile ? 202 : 60),
        overscan: 5,
        scrollMargin: listRef.current?.offsetTop ?? 0,
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

    const searchOptions = (hosts || []).map((host) => ({
        value: host.uuid,
        label: host.remark
    }))

    const searchAddressOptions = (hosts || []).map((host) => ({
        value: host.uuid,
        label: host.address
    }))

    const handleSearchSelect = useCallback(
        (value: null | string) => {
            if (!value) {
                setSearchValue(null)
                return
            }

            const hostIndex = state.findIndex((host) => host.uuid === value)
            if (hostIndex !== -1) {
                virtualizer.scrollToIndex(hostIndex, {
                    align: 'center',
                    behavior: 'smooth'
                })
                setSearchValue(value)
                setHighlightedHost(value)
            }
        },

        [state, virtualizer.scrollToIndex]
    )

    const handleSearchAddressSelect = useCallback(
        (value: null | string) => {
            if (!value) {
                setSearchAddressValue(null)
                return
            }

            const hostIndex = state.findIndex((host) => host.uuid === value)
            if (hostIndex !== -1) {
                virtualizer.scrollToIndex(hostIndex, {
                    align: 'center',
                    behavior: 'smooth'
                })
                setSearchAddressValue(value)
                setHighlightedHost(value)
            }
        },

        [state, virtualizer.scrollToIndex]
    )

    useEffect(() => {
        if (highlightedHost) {
            const timeout = setTimeout(() => setHighlightedHost(null), 2000)
            return () => clearTimeout(timeout)
        }

        return undefined
    }, [highlightedHost])

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
        <Stack gap="md">
            <HostsFiltersFeature
                configProfiles={configProfiles}
                handleSearchAddressSelect={handleSearchAddressSelect}
                handleSearchSelect={handleSearchSelect}
                hostTags={hostTags}
                searchAddressData={searchAddressOptions}
                searchAddressValue={searchAddressValue}
                searchOptions={searchOptions}
                searchValue={searchValue}
                setSearchAddressValue={setSearchAddressValue}
                setSearchValue={setSearchValue}
            />

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
                        <SortableContext
                            items={dataIds.current}
                            strategy={verticalListSortingStrategy}
                        >
                            <Container fluid>
                                <Stack gap={0}>
                                    {virtualizer.getVirtualItems().map((virtualItem) => {
                                        const item = state[virtualItem.index]
                                        if (!item) return null

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
                                                        isHighlighted={
                                                            highlightedHost === item.uuid
                                                        }
                                                        isSelected={selectedHosts.includes(
                                                            item.uuid
                                                        )}
                                                        item={item}
                                                        nodes={nodes!}
                                                        onSelect={() =>
                                                            toggleHostSelection(item.uuid)
                                                        }
                                                    />
                                                </motion.div>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            </Container>
                        </SortableContext>
                    </div>
                </div>

                <DragOverlay>
                    {draggedHost && (
                        <Container fluid pl={0} pr={0}>
                            <HostCardWidget
                                configProfiles={configProfiles}
                                isDragOverlay
                                isSelected={selectedHosts.includes(draggedHost.uuid)}
                                item={draggedHost}
                                nodes={nodes!}
                                onSelect={() => toggleHostSelection(draggedHost.uuid)}
                            />
                        </Container>
                    )}
                </DragOverlay>
            </DndContext>
        </Stack>
    )
})
