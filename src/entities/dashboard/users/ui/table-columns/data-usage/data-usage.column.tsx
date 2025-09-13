import { RESET_PERIODS } from '@remnawave/backend-contract'
import { Box, Group, Progress, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'
import { prettyBytesUtil } from '@shared/utils/bytes'

export function DataUsageColumnEntity(props: IProps) {
    const { t } = useTranslation()

    const { user } = props

    const usedTrafficPercentage = user.trafficLimitBytes
        ? (user.usedTrafficBytes / user.trafficLimitBytes) * 100
        : 0
    const limitBytes = prettyBytesUtil(user.trafficLimitBytes, true)
    const totalUsedTraffic = prettyBytesUtil(user.usedTrafficBytes, true)
    const lifetimeUsedTraffic = prettyBytesUtil(user.lifetimeUsedTrafficBytes, true)

    const strategy = {
        [RESET_PERIODS.MONTH]: t('data-usage.column.monthly'),
        [RESET_PERIODS.WEEK]: t('data-usage.column.weekly'),
        [RESET_PERIODS.DAY]: t('data-usage.column.daily'),
        [RESET_PERIODS.NO_RESET]: '∞'
    }[user.trafficLimitStrategy]

    return (
        <Box miw={300}>
            <Group justify="space-between">
                <Text c="red.5" fw={700} fz="xs">
                    {usedTrafficPercentage.toFixed(2)}%
                </Text>
                <Text c="teal.5" fw={700} fz="xs">
                    {(100 - usedTrafficPercentage).toFixed(2)}%
                </Text>
            </Group>
            <Progress
                color={usedTrafficPercentage > 100 ? 'orange.7' : 'teal.9'}
                radius="xs"
                size="md"
                striped
                value={usedTrafficPercentage}
            />

            <Group gap="xs" justify="space-between" mt={2}>
                <Text c="dimmed" fw={'550'} size="xs">
                    {totalUsedTraffic} {limitBytes === '0' ? '' : `/ ${limitBytes}`} {strategy}
                </Text>
                <Text c="dimmed" fw={'550'} size="xs">
                    Σ {lifetimeUsedTraffic}
                </Text>
            </Group>
        </Box>
    )
}
