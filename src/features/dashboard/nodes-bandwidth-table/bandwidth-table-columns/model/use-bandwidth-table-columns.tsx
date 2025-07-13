import { ListViewTableColumn } from '@gfazioli/mantine-list-view-table'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { Flex, Progress, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import { getNodeResetPeriodUtil } from '@shared/utils/time-utils/get-node-reset-days'
import { prettyBytesUtil } from '@shared/utils/bytes'

export const useBandwidthTableColumns = () => {
    const { t } = useTranslation()

    const getProgressColor = (percentage: number) => {
        if (percentage > 95) return 'red.6'
        if (percentage > 80) return 'yellow.6'
        return 'teal.6'
    }

    return useMemo<ListViewTableColumn<GetAllNodesCommand.Response['response'][number]>[]>(
        () => [
            {
                key: 'name',
                sortable: true,
                title: t('use-bandwidth-table-columns.node-name'),
                renderCell: (node) => <Text ff="monospace">{node.name}</Text>
            },
            {
                key: 'trafficResetDay',
                sortable: true,
                title: t('use-bandwidth-table-columns.traffic-cycle'),
                renderCell: (node) => (
                    <Text>{getNodeResetPeriodUtil(node.trafficResetDay ?? 0)}</Text>
                )
            },
            {
                key: 'trafficUsedBytes',
                title: t('use-bandwidth-table-columns.traffic'),
                sortable: true,
                renderCell: (node) => {
                    let percentage = 0

                    if (node.trafficLimitBytes === 0) {
                        percentage = 100
                    } else {
                        percentage = Math.floor(
                            ((node.trafficUsedBytes ?? 0) * 100) / (node.trafficLimitBytes ?? 0)
                        )
                    }

                    return (
                        <Flex direction="column" gap={4}>
                            <Flex align="center" justify="space-between">
                                <Text c="dimmed" ff="monospace" fw={600} size="md">
                                    {prettyBytesUtil(node.trafficUsedBytes || 0) || '0 GB'}
                                </Text>
                            </Flex>
                            <Progress
                                color={getProgressColor(percentage)}
                                radius="sm"
                                size="md"
                                value={percentage}
                            />
                        </Flex>
                    )
                },
                textAlign: 'left'
            },
            {
                key: 'trafficLimitBytes',
                title: t('use-bandwidth-table-columns.traffic-limit'),
                sortable: true,
                renderCell: (node) => (
                    <Text ff="monospace">
                        {prettyBytesUtil(node.trafficLimitBytes || 0) || '0 GB'}
                    </Text>
                ),
                textAlign: 'left'
            }
        ],
        []
    )
}
