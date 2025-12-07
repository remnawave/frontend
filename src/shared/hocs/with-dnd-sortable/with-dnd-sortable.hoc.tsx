import { CSSProperties, forwardRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { RiDraggable } from 'react-icons/ri'
import { ActionIcon } from '@mantine/core'
import { CSS } from '@dnd-kit/utilities'

import classes from './with-dnd-sortable.module.css'

interface WithDndSortableProps {
    children: React.ReactNode
    dragHandlePosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
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
            dragHandlePosition = 'top-right'
        } = props

        const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
            useSortable({
                id,
                disabled: isDragOverlay,
                animateLayoutChanges: () => false
            })

        const style: CSSProperties = {
            transform: CSS.Translate.toString(transform),
            transition,
            opacity: isDragging ? 0 : 1,
            position: 'relative'
        }

        const dragHandleClasses = {
            'top-left': classes.dragHandleTopLeft,
            'top-right': classes.dragHandleTopRight,
            'bottom-left': classes.dragHandleBottomLeft,
            'bottom-right': classes.dragHandleBottomRight
        }

        return (
            <div ref={isDragOverlay ? externalRef : setNodeRef} style={style}>
                {showDragHandle && (
                    <ActionIcon
                        {...attributes}
                        {...listeners}
                        className={`${classes.dragHandle} ${dragHandleClasses[dragHandlePosition]}`}
                        size="lg"
                        variant="transparent"
                    >
                        <RiDraggable size={24} />
                    </ActionIcon>
                )}
                {children}
            </div>
        )
    }
)

WithDndSortable.displayName = 'WithDndSortable'
