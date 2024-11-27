import { Badge, BadgeProps } from '@mantine/core';
import { Customer } from '@/api/entities/customers';
import { match } from '@/utilities/match';

interface CustomerStatusBadgeProps extends Omit<BadgeProps, 'children' | 'color'> {
  status: Customer['status'];
}

export function CustomerStatusBadge({
  status,
  variant = 'outline',
  ...props
}: CustomerStatusBadgeProps) {
  const color = match(
    [status === 'active', 'teal'],
    [status === 'banned', 'orange'],
    [status === 'archived', 'red'],
    [true, 'gray']
  );

  return (
    <Badge color={color} variant={variant} {...props}>
      {status}
    </Badge>
  );
}
