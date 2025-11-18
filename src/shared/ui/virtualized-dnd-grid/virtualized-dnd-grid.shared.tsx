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
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { VirtuosoMasonry } from '@virtuoso.dev/masonry'
import { ReactNode, useEffect, useState } from 'react'
import { Box } from '@mantine/core'

import classes from './virtualized-dnd-grid.module.css'

interface VirtualizedDndGridProps<T extends { uuid: string }> {
    columnCount: number
    enableDnd?: boolean
    items: T[]
    onReorder?: (items: T[]) => void
    renderDragOverlay?: (item: T) => ReactNode
    renderItem: (item: T, index: number) => ReactNode
    style?: React.CSSProperties
    useWindowScroll?: boolean
}

export function VirtualizedDndGrid<T extends { uuid: string }>(props: VirtualizedDndGridProps<T>) {
    const {
        items: initialItems,
        columnCount,
        renderItem,
        renderDragOverlay,
        onReorder,
        useWindowScroll = true,
        style,
        enableDnd = true
    } = props

    const [items, setItems] = useState(initialItems)
    const [activeId, setActiveId] = useState<null | UniqueIdentifier>(null)

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
        setItems(initialItems)
    }, [initialItems])

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.uuid === active.id)
                const newIndex = items.findIndex((item) => item.uuid === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                onReorder?.(newItems)
                return newItems
            })
        }

        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    const draggedItem = activeId ? items.find((item) => item.uuid === activeId) : null

    const ItemWrapper: React.FC<{
        context?: unknown
        data: T
        index: number
    }> = ({ data, index }) => {
        if (!data) return null

        return (
            <div className={classes.itemWrapper} style={{ padding: '5px', width: '100%' }}>
                {renderItem(data, index)}
            </div>
        )
    }

    if (!enableDnd) {
        return (
            <Box style={style}>
                <VirtuosoMasonry
                    columnCount={columnCount}
                    data={items}
                    ItemContent={ItemWrapper}
                    useWindowScroll={useWindowScroll}
                />
            </Box>
        )
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToWindowEdges]}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
        >
            <SortableContext items={items.map((item) => item.uuid)} strategy={rectSortingStrategy}>
                <Box style={style}>
                    <VirtuosoMasonry
                        columnCount={columnCount}
                        data={items}
                        ItemContent={ItemWrapper}
                        useWindowScroll={useWindowScroll}
                    />
                </Box>
            </SortableContext>

            <DragOverlay>
                {draggedItem && renderDragOverlay ? (
                    <Box style={{ width: '100%' }}>{renderDragOverlay(draggedItem)}</Box>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
