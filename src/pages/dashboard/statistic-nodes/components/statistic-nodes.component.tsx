import { Box, Group, MultiSelect, Paper, SegmentedControl, Stack, Text } from '@mantine/core'
import { GetNodesUsageByRangeCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { BarChart } from '@mantine/charts'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { useGetNodesUsageByRangeCommand } from '@shared/api/hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

export const StatisticNodesPage = () => {
    const { t } = useTranslation()

    const [period, setPeriod] = useState<'7' | '14' | '30' | '60' | '90'>('7')
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        dayjs().utc().subtract(7, 'day').startOf('hour').toDate(),
        dayjs().utc().startOf('hour').toDate()
    ])

    const { data: nodesStats, isLoading } = useGetNodesUsageByRangeCommand({
        query: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
        }
    })

    const ch = new ColorHash()
    const [selectedNodes, setSelectedNodes] = useState<string[]>([])

    useEffect(() => {
        const end = dayjs().utc().startOf('hour').toDate()
        const start = dayjs().utc().subtract(Number(period), 'day').startOf('hour').toDate()
        setDateRange([start, end])
    }, [period])

    if (isLoading) {
        return <LoadingScreen />
    }

    const formatDataForChart = (dbData: GetNodesUsageByRangeCommand.Response['response']) => {
        interface ChartData {
            [key: string]: number | string
            date: string
        }

        const groupedData: Record<string, ChartData> = {}
        const seriesSet = new Set<string>()

        dbData.forEach(({ nodeName, total, date }) => {
            const formattedDate = dayjs(date).format('MMM D')
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { date: formattedDate }
            }

            groupedData[formattedDate][nodeName] = total
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

    const { data, series } = formatDataForChart(nodesStats ?? [])

    const filteredSeries =
        selectedNodes.length > 0 ? series.filter((s) => selectedNodes.includes(s.name)) : series

    return (
        <Page title={t('constants.nodes-statistics')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: t('constants.nodes'), href: ROUTES.DASHBOARD.MANAGEMENT.NODES },
                    { label: t('constants.nodes-statistics') }
                ]}
                title={t('constants.nodes-statistics')}
            />

            <Stack gap="sm" mb="xl">
                <Group align="center" justify="space-between">
                    <Text fw={600}>{t('statistic-nodes.component.last-7-days-by-nodes')}</Text>
                    <SegmentedControl
                        data={[
                            { label: t('statistic-nodes.component.last-7-days'), value: '7' },
                            { label: t('statistic-nodes.component.last-14-days'), value: '14' },
                            { label: t('statistic-nodes.component.last-30-days'), value: '30' },
                            { label: t('statistic-nodes.component.last-60-days'), value: '60' },
                            { label: t('statistic-nodes.component.last-90-days'), value: '90' }
                        ]}
                        onChange={(value) => setPeriod(value as '7' | '14' | '30' | '60' | '90')}
                        value={period}
                    />
                </Group>
                <Group align="center" justify="center">
                    <Group gap="xs" maw={600}>
                        <MultiSelect
                            checkIconPosition="left"
                            clearable
                            data={series.map((s) => ({ value: s.name, label: s.name }))}
                            onChange={setSelectedNodes}
                            placeholder={t('statistic-nodes.component.filter-nodes')}
                            searchable
                            value={selectedNodes}
                        />
                    </Group>
                </Group>
                <BarChart
                    barProps={{ radius: 0 }}
                    data={data}
                    dataKey="date"
                    h={'800px'}
                    legendProps={{
                        verticalAlign: 'bottom'
                    }}
                    maxBarWidth={40}
                    orientation="vertical"
                    series={filteredSeries}
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
