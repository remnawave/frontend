import {
  PiTrashDuotone as DeleteIcon,
  PiPencilDuotone as EditIcon,
  PiClockCounterClockwiseDuotone as RestoreIcon,
  PiEyeDuotone as ShowIcon,
} from 'react-icons/pi';
import { ActionIcon, Group, GroupProps, Tooltip } from '@mantine/core';

export interface DataTableActionsProps extends GroupProps {
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
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
          <ActionIcon variant="default" onClick={onView}>
            <ShowIcon size="1rem" />
          </ActionIcon>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip label="Edit">
          <ActionIcon variant="default" onClick={onEdit}>
            <EditIcon size="1rem" />
          </ActionIcon>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip label="Delete">
          <ActionIcon variant="default" onClick={onDelete}>
            <DeleteIcon size="1rem" />
          </ActionIcon>
        </Tooltip>
      )}

      {onRestore && (
        <Tooltip label="Restore">
          <ActionIcon variant="default" onClick={onRestore}>
            <RestoreIcon size="1rem" />
          </ActionIcon>
        </Tooltip>
      )}

      {children}
    </Group>
  );
}
