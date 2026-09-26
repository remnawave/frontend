import { OptimisticSortingPlugin } from '@dnd-kit/dom/sortable'
import { useSortable } from '@dnd-kit/react/sortable'
import { ActionIcon } from '@mantine/core'
import { createContext, CSSProperties, forwardRef, useContext } from 'react'
import { RiDraggable } from 'react-icons/ri'

import classes from './with-dnd-sortable.module.css'

export const DndSortableIndexContext = createContext(0)

interface WithDndSortableProps {
    children: React.ReactNode
    disableReordering?: boolean
    dragHandlePosition?:
        | 'bottom-left'
        | 'bottom-right'
        | 'inline-end'
        | 'inline-start'
        | 'top-left'
        | 'top-right'
    id: string
    isDragOverlay?: boolean
    showDragHandle?: boolean
}

export const WithDndSortable = forwardRef<HTMLDivElement, WithDndSortableProps>(
    (props, externalRef) => {
        const {
            id,
            isDragOverlay = false,
            children,
            showDragHandle = true,
            disableReordering = false,
            dragHandlePosition = 'top-right'
        } = props

        const index = useContext(DndSortableIndexContext)

        const sortable = useSortable({
            id,
            index,
            disabled: isDragOverlay || disableReordering,
            plugins: (defaults) => defaults.filter((plugin) => plugin !== OptimisticSortingPlugin)
        })

        const isDragging = !isDragOverlay && sortable.isDragging
        const hasDragHandle = showDragHandle && !disableReordering
        const { ref, handleRef } = sortable

        const style: CSSProperties = {
            opacity: isDragging ? 0 : 1,
            position: 'relative'
        }

        const dragHandleClasses = {
            'top-left': classes.dragHandleTopLeft,
            'top-right': classes.dragHandleTopRight,
            'bottom-left': classes.dragHandleBottomLeft,
            'bottom-right': classes.dragHandleBottomRight,
            'inline-start': classes.dragHandleInline,
            'inline-end': classes.dragHandleInlineEnd
        }

        return (
            <div
                className={dragHandlePosition === 'inline-start' ? classes.inlineRoot : undefined}
                data-drag-handle={hasDragHandle ? undefined : 'hidden'}
                ref={isDragOverlay ? externalRef : ref}
                style={style}
            >
                {hasDragHandle && (
                    <ActionIcon
                        className={`${classes.dragHandle} ${dragHandleClasses[dragHandlePosition]}`}
                        color="gray"
                        ref={isDragOverlay ? undefined : handleRef}
                        size="30"
                        variant="subtle"
                    >
                        <RiDraggable size={16} />
                    </ActionIcon>
                )}
                {children}
            </div>
        )
    }
)

WithDndSortable.displayName = 'WithDndSortable'
