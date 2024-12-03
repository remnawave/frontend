import { GetNodesStatisticsCommand } from '@remnawave/backend-contract'
import { Box, Group, Paper, Stack, Text } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { prettyBytesToAnyUtil } from '@/shared/utils/bytes'
import { LoadingScreen, PageHeader } from '@/shared/ui'
import { Page } from '@shared/ui/page'

import { BREADCRUMBS } from './constant'
import { IProps } from './interfaces'

export const StatisticNodesPage = (props: IProps) => {
    const { nodesStats } = props
    const ch = new ColorHash()

    if (!nodesStats) {
        return <LoadingScreen />
    }

    const { lastSevenDays } = nodesStats

    const formatDataForChart = (
        dbData: GetNodesStatisticsCommand.Response['response']['lastSevenDays']
    ) => {
        interface ChartData {
            [key: string]: number | string
            date: string
        }

        const groupedData: Record<string, ChartData> = {}
        const seriesSet = new Set<string>()

        dbData.forEach(({ nodeName, totalBytes, date }) => {
            const formattedDate = dayjs(date).format('MMM D')
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { date: formattedDate }
            }

            groupedData[formattedDate][nodeName] = totalBytes
            seriesSet.add(nodeName)
        })

        return {
            data: Object.values(groupedData),
            series: Array.from(seriesSet).map((nodeName) => ({
                name: nodeName,
                color: ch.hex(nodeName)
            }))
        }
    }

    const { data, series } = formatDataForChart(lastSevenDays)

    return (
        <Page title="Nodes Statistics">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Nodes statistics" />

            <Stack gap="sm" mb="xl">
                <Text fw={600}>Last 7 days by nodes</Text>

                <BarChart
                    barProps={{ radius: 0 }}
                    data={data}
                    dataKey="date"
                    gridAxis="xy"
                    h={300}
                    legendProps={{
                        verticalAlign: 'bottom'
                    }}
                    orientation="vertical"
                    series={series}
                    tickLine="y"
                    tooltipAnimationDuration={200}
                    tooltipProps={{
                        content: ({ payload, active }) => {
                            if (!payload || !active) return null

                            const date = payload[0]?.payload.date
                            const sortedPayload = [...payload].sort((a, b) => b.value - a.value)
                            const totalForDay = payload.reduce((sum, entry) => {
                                const value = Number(entry.value) || 0
                                return sum + value
                            }, 0)

                            return (
                                <Paper px="md" py="sm" radius="md" shadow="md" withBorder>
                                    <Group justify="space-between" mb={8}>
                                        <Text fw={600}>{date}</Text>
                                        <Text c="dimmed" fz="sm">
                                            Σ {prettyBytesToAnyUtil(totalForDay)}
                                        </Text>
                                    </Group>
                                    {sortedPayload.map((entry) => (
                                        <Stack gap={4} key={entry.dataKey}>
                                            <Group justify="space-between">
                                                <Group gap={8}>
                                                    <Box
                                                        h={10}
                                                        style={{
                                                            backgroundColor: entry.color,
                                                            borderRadius: '50%'
                                                        }}
                                                        w={10}
                                                    />
                                                    <Text fz="sm">{entry.name}</Text>
                                                </Group>
                                                <Text fw={500} fz="sm">
                                                    {prettyBytesToAnyUtil(entry.value)}
                                                </Text>
                                            </Group>
                                        </Stack>
                                    ))}
                                </Paper>
                            )
                        }
                    }}
                    type="stacked"
                    valueFormatter={(value) => prettyBytesToAnyUtil(value) ?? ''}
                    withLegend
                />
            </Stack>
        </Page>
    )
}
