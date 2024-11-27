import {
  PiClockCountdownDuotone,
  PiClockUserDuotone,
  PiProhibitDuotone,
  PiPulseDuotone,
  PiUsersDuotone,
} from 'react-icons/pi';
import { Group, Loader, SimpleGrid } from '@mantine/core';
import {
  useDashboardStoreIsLoading,
  useDashboardStoreSystemInfo,
} from '@/entitites/dashboard/dashboard-store/dashboard-store';
import { MetricCard } from '@/shared/ui/metric-card';
import { formatInt } from '@/shared/utils/number';

export function UsersMetrics() {
  // const isLoading = useDashboardStoreIsLoading();
  const systemInfo = useDashboardStoreSystemInfo();

  if (!systemInfo) return null;

  const users = systemInfo.users;

  const cards = [
    { icon: PiUsersDuotone, title: 'Total users', value: users.totalUsers, color: 'blue' },
    {
      icon: PiPulseDuotone,
      title: 'Active users',
      value: users.statusCounts.ACTIVE,
      color: 'teal',
    },
    {
      icon: PiClockUserDuotone,
      title: 'Expired users',
      value: users.statusCounts.EXPIRED,
      color: 'red',
    },
    {
      icon: PiClockCountdownDuotone,
      title: 'Limited users',
      value: users.statusCounts.LIMITED,
      color: 'orange',
    },
    {
      icon: PiProhibitDuotone,
      title: 'Disabled users',
      value: users.statusCounts.DISABLED,
      color: 'gray',
    },
  ];
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }}>
      {cards.map((card) => (
        <MetricCard.Root key={card.title}>
          <Group>
            <MetricCard.Icon c={card.color}>
              <card.icon size="2rem" />
            </MetricCard.Icon>
            <div>
              <MetricCard.TextMuted>{card.title}</MetricCard.TextMuted>
              <MetricCard.TextEmphasis>
                {/* {isLoading ? <Loader size="sm" color={card.color} /> : formatInt(card.value ?? 0)} */}
                {formatInt(card.value ?? 0)}
              </MetricCard.TextEmphasis>
            </div>
          </Group>
        </MetricCard.Root>
      ))}
    </SimpleGrid>
  );
}
