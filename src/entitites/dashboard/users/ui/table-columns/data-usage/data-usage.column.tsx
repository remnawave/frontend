import { RESET_PERIODS } from '@remnawave/backend-contract';
import { Box, Group, Indicator, Progress, Text } from '@mantine/core';
import { IProps } from '@/entitites/dashboard/users/ui/table-columns/username/interface';
import { prettyBytesUtil } from '@/shared/utils/bytes';

export function DataUsageColumnEntity(props: IProps) {
  const { user } = props;

  const usedTrafficPercentage = (user.usedTrafficBytes / user.trafficLimitBytes) * 100;
  const limitBytes = prettyBytesUtil(user.trafficLimitBytes, true);
  const totalUsedTraffic = prettyBytesUtil(user.usedTrafficBytes, true);
  const lifetimeUsedTraffic = prettyBytesUtil(user.totalUsedBytes, true);

  const strategy = {
    [RESET_PERIODS.YEAR]: 'Yearly',
    [RESET_PERIODS.MONTH]: 'Montly',
    [RESET_PERIODS.WEEK]: 'Weekly',
    [RESET_PERIODS.DAY]: 'Daily',
    [RESET_PERIODS.NO_RESET]: '∞',
  }[user.trafficLimitStrategy];

  return (
    <Box w={300}>
      <Progress
        radius="xs"
        size="md"
        value={usedTrafficPercentage}
        color={usedTrafficPercentage > 100 ? 'yellow' : 'cyan'}
        striped
        animated
      />
      <Group gap="xs" justify="space-between" mt={2}>
        <Text size="xs" c="dimmed">
          {totalUsedTraffic} / {limitBytes} {strategy}
        </Text>
        <Text size="xs" c="dimmed">
          Σ {lifetimeUsedTraffic}
        </Text>
      </Group>
    </Box>
  );
}
