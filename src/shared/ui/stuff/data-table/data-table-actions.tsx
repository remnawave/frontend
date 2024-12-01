import {
    PiTrashDuotone as DeleteIcon,
    PiPencilDuotone as EditIcon,
    PiClockCounterClockwiseDuotone as RestoreIcon,
    PiEyeDuotone as ShowIcon
} from 'react-icons/pi'
import { ActionIcon, Group, GroupProps, Tooltip } from '@mantine/core'

export interface DataTableActionsProps extends GroupProps {
    onDelete?: () => void
    onEdit?: () => void
    onRestore?: () => void
    onView?: () => void
}

export function DataTableActions({
    gap = 'xs',
    justify = 'right',
    wrap = 'nowrap',
    onEdit,
    onView,
    onDelete,
    onRestore,
    children,
    ...props
}: DataTableActionsProps) {
    return (
        <Group gap={gap} justify={justify} wrap={wrap} {...props}>
            {onView && (
                <Tooltip label="Show">
                    <ActionIcon onClick={onView} variant="default">
                        <ShowIcon size="1rem" />
                    </ActionIcon>
                </Tooltip>
            )}
            {onEdit && (
                <Tooltip label="Edit">
                    <ActionIcon onClick={onEdit} variant="default">
                        <EditIcon size="1rem" />
                    </ActionIcon>
                </Tooltip>
            )}

            {onDelete && (
                <Tooltip label="Delete">
                    <ActionIcon onClick={onDelete} variant="default">
                        <DeleteIcon size="1rem" />
                    </ActionIcon>
                </Tooltip>
            )}

            {onRestore && (
                <Tooltip label="Restore">
                    <ActionIcon onClick={onRestore} variant="default">
                        <RestoreIcon size="1rem" />
                    </ActionIcon>
                </Tooltip>
            )}

            {children}
        </Group>
    )
}
