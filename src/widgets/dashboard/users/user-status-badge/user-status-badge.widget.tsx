import { USERS_STATUS } from '@remnawave/backend-contract';
import {
  PiClockCountdownDuotone,
  PiClockUserDuotone,
  PiProhibitDuotone,
  PiPulseDuotone,
} from 'react-icons/pi';
import { Badge } from '@mantine/core';
import { UserStatusBadgeProps } from './interfaces';

export function UserStatusBadge({ status, variant = 'outline', ...props }: UserStatusBadgeProps) {
  let icon: React.ReactNode;
  let color = '';
  switch (status) {
    case USERS_STATUS.ACTIVE:
      icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />;
      color = 'teal';
      break;
    case USERS_STATUS.DISABLED:
      icon = <PiProhibitDuotone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />;
      color = 'gray';
      break;
    case USERS_STATUS.LIMITED:
      icon = (
        <PiClockCountdownDuotone size={18} style={{ color: 'var(--mantine-color-orange-3)' }} />
      );
      color = 'orange';
      break;
    case USERS_STATUS.EXPIRED:
      icon = <PiClockUserDuotone size={18} style={{ color: 'var(--mantine-color-red-6)' }} />;
      color = 'red';
      break;
  }

  return (
    <Badge color={color} leftSection={icon} variant={variant} size="lg" {...props}>
      {status}
    </Badge>
  );
}
