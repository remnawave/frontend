import { RestrictToWindow } from '@dnd-kit/dom/modifiers'
import { move } from '@dnd-kit/helpers'
import {
    DragDropProvider,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent
} from '@dnd-kit/react'
import { Box } from '@mantine/core'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'

import { DndSortableIndexContext } from '@shared/hocs/with-dnd-sortable'

import classes from './virtualized-dnd-grid.module.css'
import { VirtualizedGridComponents } from './virtualized-grid-components'

interface VirtualizedDndGridProps<T extends { uuid: string }> {
    enableDnd?: boolean
    header?: ReactNode
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
        renderItem,
        renderDragOverlay,
        onReorder,
        useWindowScroll = true,
        header,
        style,
        enableDnd = true
    } = props

    const [items, setItems] = useState(initialItems)
    const [prevItems, setPrevItems] = useState(initialItems)
    const [activeId, setActiveId] = useState<null | string>(null)
    const itemsRef = useRef(items)
    const dragSnapshotRef = useRef<null | T[]>(null)

    useEffect(() => {
        itemsRef.current = items
    }, [items])

    if (prevItems !== initialItems && !activeId) {
        setPrevItems(initialItems)
        setItems(initialItems)
    }

    const handleDragStart = (event: DragStartEvent) => {
        const sourceId = event.operation.source?.id
        dragSnapshotRef.current = itemsRef.current
        setActiveId(sourceId ? String(sourceId) : null)
    }

    const handleDragOver = (event: DragOverEvent) => {
        setItems((prev) => {
            const ids = prev.map((item) => item.uuid)
            const newIds = move(ids, event)
            if (newIds === ids) return prev

            const itemsByUuid = new Map(prev.map((item) => [item.uuid, item]))
            return newIds.map((uuid) => itemsByUuid.get(uuid)!)
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null)

        const snapshot = dragSnapshotRef.current
        dragSnapshotRef.current = null

        if (event.canceled) {
            if (snapshot) setItems(snapshot)
            return
        }

        const newItems = itemsRef.current
        const hasOrderChanged = snapshot?.some((item, index) => item.uuid !== newItems[index]?.uuid)

        if (hasOrderChanged) {
            onReorder?.(newItems)
        }
    }

    const draggedItem = activeId ? items.find((item) => item.uuid === activeId) : null

    const computeItemKey = (index: number) => items[index]?.uuid ?? index

    const itemContent = (index: number) => {
        const item = items[index]
        if (!item) return null

        return (
            <DndSortableIndexContext.Provider key={item.uuid} value={index}>
                <div className={classes.itemWrapper}>{renderItem(item, index)}</div>
            </DndSortableIndexContext.Provider>
        )
    }

    if (!enableDnd) {
        return (
            <Box style={style}>
                {header}

                <VirtuosoGrid
                    components={VirtualizedGridComponents}
                    computeItemKey={computeItemKey}
                    itemContent={itemContent}
                    totalCount={items.length}
                    useWindowScroll={useWindowScroll}
                />
            </Box>
        )
    }

    return (
        <DragDropProvider
            modifiers={[RestrictToWindow]}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
        >
            <Box style={style}>
                {header}

                <VirtuosoGrid
                    components={VirtualizedGridComponents}
                    computeItemKey={computeItemKey}
                    itemContent={itemContent}
                    overscan={{
                        main: 10,
                        reverse: 10
                    }}
                    totalCount={items.length}
                    useWindowScroll={useWindowScroll}
                />
            </Box>

            <DragOverlay>
                {draggedItem && renderDragOverlay ? (
                    <Box style={{ width: '100%' }}>{renderDragOverlay(draggedItem)}</Box>
                ) : null}
            </DragOverlay>
        </DragDropProvider>
    )
}
