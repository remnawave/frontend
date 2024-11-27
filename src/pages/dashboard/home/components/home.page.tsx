import { Page } from '@shared/ui/page';
import prettyBytes from 'pretty-bytes';
import { BsFillClipboard2DataFill } from 'react-icons/bs';
import {
  FaBan,
  FaCheckCircle,
  FaExclamationCircle,
  FaRegDotCircle,
  FaTimesCircle,
  FaUsers,
} from 'react-icons/fa';
import { LuPieChart } from 'react-icons/lu';
import {
  PiChartBarDuotone,
  PiChartPieSliceDuotone,
  PiClockCountdownDuotone,
  PiClockUserDuotone,
  PiDevicesDuotone,
  PiMemoryDuotone,
  PiProhibitDuotone,
  PiPulseDuotone,
  PiTimerDuotone,
  PiUsersDuotone,
} from 'react-icons/pi';
import { SimpleGrid, Stack, Text } from '@mantine/core';
import { LoadingScreen, PageHeader } from '@/shared/ui';
import { formatInt } from '@/shared/utils';
import { MetricWithIcon } from '@/widgets/dashboard/home/metric-with-icons';
import { IProps } from './interfaces';

export const HomePage = (props: IProps) => {
  const { systemInfo, breadcrumbs } = props;

  if (!systemInfo) {
    return <LoadingScreen />;
  }

  const { users, memory } = systemInfo;

  const simpleMetrics = [
    {
      icon: PiDevicesDuotone,
      title: 'Online users',
      value: formatInt(users.onlineLastMinute ?? 0),
      color: 'teal',
    },
    {
      icon: PiUsersDuotone,
      title: 'Total users',
      value: formatInt(users.totalUsers ?? 0),
      color: 'blue',
    },
    {
      icon: PiChartBarDuotone,
      title: 'Total traffic',
      value: prettyBytes(Number(users.totalTrafficBytes) ?? 0),
      color: 'green',
    },
    {
      icon: PiMemoryDuotone,
      title: 'Available RAM',
      value:
        prettyBytes(Number(memory.available) ?? 0) + ' / ' + prettyBytes(Number(memory.total) ?? 0),
      color: 'cyan',
    },
  ];

  const usersMetrics = [
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
    <Page title="Home">
      <PageHeader title="Short stats" breadcrumbs={breadcrumbs} />

      <Stack gap="sm" mb="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
          {simpleMetrics.map((metric) => (
            <MetricWithIcon key={metric.title} {...metric} />
          ))}
        </SimpleGrid>

        <Text>Users</Text>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
          {usersMetrics.map((metric) => (
            <MetricWithIcon key={metric.title} {...metric} />
          ))}
        </SimpleGrid>
      </Stack>
    </Page>
  );
};