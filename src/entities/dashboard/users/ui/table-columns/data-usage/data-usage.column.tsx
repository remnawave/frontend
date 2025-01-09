import { RESET_PERIODS } from '@remnawave/backend-contract'
import { Box, Group, Progress, Text } from '@mantine/core'

import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'
import { prettyBytesUtil } from '@shared/utils/bytes'

export function DataUsageColumnEntity(props: IProps) {
    const { user } = props

    const usedTrafficPercentage = (user.usedTrafficBytes / user.trafficLimitBytes) * 100
    const limitBytes = prettyBytesUtil(user.trafficLimitBytes, true)
    const totalUsedTraffic = prettyBytesUtil(user.usedTrafficBytes, true)
    const lifetimeUsedTraffic = prettyBytesUtil(user.totalUsedBytes, true)

    const strategy = {
        [RESET_PERIODS.YEAR]: 'Yearly',
        [RESET_PERIODS.MONTH]: 'Montly',
        [RESET_PERIODS.WEEK]: 'Weekly',
        [RESET_PERIODS.DAY]: 'Daily',
        [RESET_PERIODS.CALENDAR_MONTH]: 'Calendar Month',
        [RESET_PERIODS.NO_RESET]: '∞'
    }[user.trafficLimitStrategy]

    return (
        <Box w={300}>
            <Progress
                animated
                color={usedTrafficPercentage > 100 ? 'yellow.9' : 'teal.9'}
                radius="xs"
                size="md"
                striped
                value={usedTrafficPercentage}
            />
            <Group gap="xs" justify="space-between" mt={2}>
                <Text c="dimmed" fw={'550'} size="xs">
                    {totalUsedTraffic} / {limitBytes} {strategy}
                </Text>
                <Text c="dimmed" fw={'550'} size="xs">
                    Σ {lifetimeUsedTraffic}
                </Text>
            </Group>
        </Box>
    )
}
