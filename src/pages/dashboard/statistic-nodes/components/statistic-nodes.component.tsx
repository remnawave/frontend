import {
    Accordion,
    ActionIcon,
    Box,
    Card,
    Center,
    Group,
    Modal,
    MultiSelect,
    Paper,
    ScrollArea,
    Select,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Tooltip
} from '@mantine/core'
import {
    TbChartBar as IconChartBar,
    TbChevronLeft,
    TbChevronRight,
    TbRefresh
} from 'react-icons/tb'
import { GetNodesUsageByRangeCommand } from '@remnawave/backend-contract'
import { PiEmpty, PiListBullets } from 'react-icons/pi'
import { BarChart, Sparkline } from '@mantine/charts'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { useGetNodesUsageByRangeCommand } from '@shared/api/hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

export const StatisticNodesPage = () => {
    const { t } = useTranslation()

    const [period, setPeriod] = useState<'7' | '14' | '30' | '60' | '90' | '180'>('7')
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        dayjs().utc().subtract(7, 'day').startOf('day').toDate(),
        dayjs().utc().endOf('day').toDate()
    ])

    const [selectedNodes, setSelectedNodes] = useState<string[]>([])
    const [highlightedNode, setHighlightedNode] = useState<null | string>(null)
    const [nodeDetailsActive, setNodeDetailsActive] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<null | string>(null)
    const [activeBarLabel, setActiveBarLabel] = useState(null)
    const [selectedDayTotal, setSelectedDayTotal] = useState<null | number>(null)

    const ch = new ColorHash({
        hue: [
            { min: 120, max: 125 }, // green (#7EB26D)
            { min: 45, max: 50 }, // yellow (#EAB839)
            { min: 185, max: 190 }, // light blue (#6ED0E0)
            { min: 25, max: 30 }, // orange (#EF843C)
            { min: 0, max: 5 }, // red (#E24D42)
            { min: 210, max: 215 }, // blue (#1F78C1)
            { min: 300, max: 305 }, // purple (#BA43A9)
            { min: 270, max: 275 }, // violet (#705DA0)
            { min: 100, max: 105 }, // dark green (#508642)
            { min: 45, max: 50 }, // dark yellow (#CCA300)
            { min: 210, max: 215 }, // dark blue (#447EBC)
            { min: 25, max: 30 }, // dark orange (#C15C17)
            { min: 0, max: 5 }, // dark red (#890F02)
            { min: 150, max: 155 }, // teal (#2B908F)
            { min: 330, max: 335 }, // pink (#EA6460)
            { min: 240, max: 245 }, // indigo (#5195CE)
            { min: 60, max: 65 }, // lime (#B3DE69)
            { min: 15, max: 20 }, // coral (#FFA07A)
            { min: 285, max: 290 }, // magenta (#C71585)
            { min: 165, max: 170 } // turquoise (#40E0D0)
        ],
        lightness: [0.3, 0.4, 0.5, 0.6, 0.7],
        saturation: [0.4, 0.5, 0.6, 0.7, 0.8]
    })

    const [selectedDayData, setSelectedDayData] = useState<Array<{
        color: string
        name: string
        value: number
    }> | null>(null)
    const [currentDateIndex, setCurrentDateIndex] = useState<null | number>(null)

    useEffect(() => {
        const end = dayjs().utc().endOf('day').toDate()
        const start = dayjs().utc().subtract(Number(period), 'day').startOf('day').toDate()
        setDateRange([start, end])
    }, [period])

    const {
        data: nodesStats,
        isLoading,
        refetch,
        isRefetching
    } = useGetNodesUsageByRangeCommand({
        query: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
        }
    })

    const formatDataForChart = (dbData: GetNodesUsageByRangeCommand.Response['response']) => {
        interface ChartData {
            [key: string]: number | string
            date: string
            totalForDay: number
        }

        const groupedData: Record<string, ChartData> = {}
        const seriesSet = new Set<string>()
        const nodeTotal: Record<string, number> = {}

        dbData.forEach(({ nodeName, total, date }) => {
            const formattedDate = dayjs(date).format('MMM D')
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { date: formattedDate, totalForDay: 0 }
            }

            groupedData[formattedDate][nodeName] = total
            groupedData[formattedDate].totalForDay += total
            seriesSet.add(nodeName)

            if (!nodeTotal[nodeName]) {
                nodeTotal[nodeName] = 0
            }
            nodeTotal[nodeName] += total
        })

        const sortedNodes = Object.entries(nodeTotal)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name)

        const nodeNames = Array.from(seriesSet)
        const series = nodeNames.map((nodeName, index) => {
            return {
                name: nodeName,
                color: ch.hex(`${nodeName}-${index}`),
                total: nodeTotal[nodeName] || 0
            }
        })

        const chartData = Object.values(groupedData)
        const trendData = chartData.map((day) => ({
            date: day.date,
            value: day.totalForDay
        }))

        return {
            data: chartData,
            series,
            topNodes: sortedNodes.slice(0, 3),
            totalUsage: Object.values(nodeTotal).reduce((sum, val) => sum + val, 0),
            trendData
        }
    }

    const { data, series, topNodes, totalUsage, trendData } = formatDataForChart(nodesStats ?? [])

    const filteredSeries =
        selectedNodes.length > 0 ? series.filter((s) => selectedNodes.includes(s.name)) : series

    const sortedSeries = [...filteredSeries].sort((a, b) => b.total - a.total)

    const displaySeries = useMemo(() => {
        if (highlightedNode) {
            return sortedSeries.filter((s) => s.name === highlightedNode)
        }
        return sortedSeries
    }, [sortedSeries, highlightedNode])

    const topNodesWithUsage = useMemo(() => {
        return topNodes.map((nodeName) => {
            const nodeInfo = series.find((s) => s.name === nodeName)
            return {
                name: nodeName,
                color: nodeInfo?.color || '#888',
                total: nodeInfo?.total || 0
            }
        })
    }, [series, topNodes])

    const hasData = data.length > 0 && displaySeries.length > 0

    const handleBarClick = (barData: Record<string, unknown>, clickIndex?: number) => {
        const date = barData.date as string
        if (!date) return

        const totalForDay = barData.totalForDay as number

        const technicalFields = [
            'width',
            'y',
            'x',
            'height',
            'value',
            'payload',
            'background',
            'fill',
            'tooltipPayload',
            'tooltipPosition',
            'cursor',
            'className',
            'index',
            'stroke',
            'strokeWidth',
            'strokeDasharray',
            'stackedData',
            'dataKey',
            'layout',
            'totalForDay'
        ]

        const dayData = Object.entries(barData)
            .filter(([key]) => key !== 'date' && !technicalFields.includes(key))
            .map(([name, value]) => {
                const nodeInfo = series.find((s) => s.name === name)
                return {
                    name,
                    value: Number(value) || 0,
                    color: nodeInfo?.color || '#ccc'
                }
            })
            .sort((a, b) => b.value - a.value)

        if (dayData.length === 0) return

        let dateIndex: null | number = null

        if (typeof clickIndex === 'number') {
            dateIndex = clickIndex
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].date === date) {
                    dateIndex = i
                    break
                }
            }
        }

        setSelectedDate(date)
        setSelectedDayData(dayData)
        setSelectedDayTotal(totalForDay)
        setCurrentDateIndex(dateIndex)
        setNodeDetailsActive(true)
    }

    const goToPreviousDay = () => {
        if (currentDateIndex === null || currentDateIndex <= 0) return

        const previousIndex = currentDateIndex - 1
        const previousData = data[previousIndex]

        if (!previousData) return

        handleBarClick(previousData, previousIndex)
    }

    const goToNextDay = () => {
        if (currentDateIndex === null || currentDateIndex >= data.length - 1) return

        const nextIndex = currentDateIndex + 1
        const nextData = data[nextIndex]

        if (!nextData) return

        handleBarClick(nextData, nextIndex)
    }

    const hasPreviousDay = currentDateIndex !== null && currentDateIndex > 0
    const hasNextDay = currentDateIndex !== null && currentDateIndex < data.length - 1

    if (isLoading) {
        return <LoadingScreen />
    }

    const renderBarChart = () => {
        if (!hasData) {
            return (
                <Center h={400} mt="md" py="xl" ta="center">
                    <Box>
                        <PiEmpty size={'2rem'} />
                        <Text c="dimmed">
                            {t(
                                'statistic-nodes.component.no-data-available-for-the-selected-period'
                            )}
                        </Text>
                    </Box>
                </Center>
            )
        }

        return (
            <Box mt="md" style={{ width: '100%', height: 600, position: 'relative' }}>
                <BarChart
                    barProps={(series) => ({
                        radius: 1,
                        fill: activeBarLabel === series.name ? '#404040' : series.color,
                        cursor: 'pointer',
                        onClick: (barData, index) => {
                            const barIndex = typeof index === 'number' ? index : -1
                            handleBarClick(barData, barIndex)
                        },
                        onMouseEnter: (barData) => {
                            const activeBar = barData.tooltipPayload[0].dataKey
                            setActiveBarLabel(activeBar)
                        },
                        onMouseLeave: () => {
                            setActiveBarLabel(null)
                        }
                    })}
                    data={data}
                    dataKey="date"
                    fillOpacity={0.7}
                    h={500}
                    maxBarWidth={35}
                    minBarSize={10}
                    orientation="vertical"
                    series={displaySeries}
                    tooltipAnimationDuration={200}
                    tooltipProps={{
                        position: { y: -200 },
                        content: ({ payload, active }) => {
                            if (!active || !payload || payload.length === 0) return null

                            const date = payload[0]?.payload?.date
                            if (!date) return null

                            const validPayload = payload.filter(
                                (entry) => entry && typeof entry.value === 'number'
                            )
                            if (validPayload.length === 0) return null

                            const sortedPayload = [...validPayload].sort(
                                (a, b) => b.value - a.value
                            )
                            const totalForDay = payload[0]?.payload?.totalForDay || 0

                            const filteredPayload = sortedPayload.filter(
                                (entry) => entry.value > 50_000
                            )

                            return (
                                <Paper px="md" py="sm" radius="md" shadow="md" withBorder>
                                    <Group justify="space-between" mb={8}>
                                        <Text fw={600}>{date}</Text>
                                        <Text c="dimmed" fz="sm">
                                            {`Σ ${prettyBytesToAnyUtil(totalForDay)}`}
                                        </Text>
                                    </Group>
                                    {activeBarLabel && (
                                        <Stack mb={8}>
                                            <Group justify="space-between">
                                                <Group gap={8}>
                                                    <Box
                                                        h={10}
                                                        style={{
                                                            background: validPayload.find(
                                                                (entry) =>
                                                                    entry.name === activeBarLabel
                                                            )?.color,
                                                            borderRadius: '50%'
                                                        }}
                                                        w={10}
                                                    />
                                                    <Text fz="sm">{activeBarLabel}</Text>
                                                </Group>
                                                <Text fw={500} fz="sm">
                                                    {prettyBytesToAnyUtil(
                                                        validPayload.find(
                                                            (entry) => entry.name === activeBarLabel
                                                        )?.value
                                                    )}
                                                </Text>
                                            </Group>
                                        </Stack>
                                    )}

                                    {filteredPayload.slice(0, 10).map((entry) => (
                                        <Stack
                                            gap={4}
                                            key={entry.dataKey || `${entry.name}-${Math.random()}`}
                                        >
                                            <Group justify="space-between">
                                                <Group gap={8}>
                                                    <Box
                                                        h={10}
                                                        style={{
                                                            background: entry.color,
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
                                    {filteredPayload.length > 10 && (
                                        <>
                                            <Text c="dimmed" fz="xs" mt={8} ta="center">
                                                {`+ ${filteredPayload.length - 10} more`}
                                            </Text>
                                            <Text c="dimmed" fz="xs" mt={4} ta="center">
                                                {t('statistic-nodes.component.click-to-see-all')}
                                            </Text>
                                        </>
                                    )}
                                </Paper>
                            )
                        }
                    }}
                    type="stacked"
                    valueFormatter={(value) => prettyBytesToAnyUtil(value) ?? ''}
                    withLegend={false}
                    withXAxis
                />
            </Box>
        )
    }

    const renderColorDot = (color: string) => (
        <Box
            h={10}
            style={{
                background: color,
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
            w={10}
        />
    )

    const renderLegend = () => {
        return (
            <Accordion defaultValue="closed" variant="default">
                <Accordion.Item value="legend">
                    <Accordion.Control
                        icon={<PiListBullets color="var(--mantine-color-gray-7)" size={18} />}
                    >
                        {t('statistic-nodes.component.show-nodes')}
                    </Accordion.Control>
                    <Accordion.Panel>
                        <SimpleGrid
                            cols={{ base: 1, xs: 2, sm: 3, md: 4 }}
                            spacing={'xs'}
                            style={{
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                marginBottom: '0.5rem'
                            }}
                            verticalSpacing={'xs'}
                        >
                            {!hasData && (
                                <Group
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        gridColumn: '1 / -1',
                                        height: '100%',
                                        minHeight: '66px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Stack align="center" gap={8}>
                                        <PiEmpty size="24px" />
                                        <Text c="dimmed" size="sm">
                                            {t('statistic-nodes.component.no-data-available')}
                                        </Text>
                                    </Stack>
                                </Group>
                            )}

                            {sortedSeries.map((node) => (
                                <Group
                                    gap={8}
                                    key={node.name}
                                    onClick={() =>
                                        setHighlightedNode(
                                            highlightedNode === node.name ? null : node.name
                                        )
                                    }
                                    style={{
                                        opacity:
                                            highlightedNode && highlightedNode !== node.name
                                                ? 0.5
                                                : 1,
                                        transition: 'opacity 0.2s',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        backgroundColor:
                                            highlightedNode === node.name
                                                ? 'rgba(0,0,0,0.1)'
                                                : 'transparent'
                                    }}
                                >
                                    {renderColorDot(node.color)}
                                    <Tooltip
                                        label={
                                            /* eslint-disable */
                                            highlightedNode === node.name
                                                ? t('statistic-nodes.component.click-to-show-all')
                                                : t(
                                                      'statistic-nodes.component.click-to-highlight-only-this-node'
                                                  )
                                        }
                                        /* eslint-enable */
                                        position="top"
                                    >
                                        <Text
                                            size="sm"
                                            style={{
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {node.name}
                                        </Text>
                                    </Tooltip>
                                </Group>
                            ))}
                        </SimpleGrid>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        )
    }

    return (
        <Page title={t('constants.nodes-statistics')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    { label: t('constants.nodes'), href: ROUTES.DASHBOARD.MANAGEMENT.NODES },
                    { label: t('constants.nodes-statistics') }
                ]}
                title={t('constants.nodes-statistics')}
            />

            <Stack gap="md">
                <Group align="center" justify="flex-start" wrap="nowrap">
                    <Text fw={600} fz="sm">
                        {t('statistic-nodes.component.usage-by-period')}
                    </Text>
                    <Select
                        allowDeselect={false}
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        data={[
                            { label: t('statistic-nodes.component.7-days'), value: '7' },
                            { label: t('statistic-nodes.component.14-days'), value: '14' },
                            { label: t('statistic-nodes.component.30-days'), value: '30' },
                            { label: t('statistic-nodes.component.60-days'), value: '60' },
                            { label: t('statistic-nodes.component.90-days'), value: '90' },
                            { label: t('statistic-nodes.component.180-days'), value: '180' }
                        ]}
                        defaultValue="7"
                        onChange={(value) =>
                            setPeriod((value || '7') as '7' | '14' | '30' | '60' | '90' | '180')
                        }
                        size="sm"
                        value={period}
                        w={{ base: 130 }}
                    />
                    <ActionIcon
                        loading={isRefetching}
                        onClick={() => refetch()}
                        size="input-sm"
                        variant="subtle"
                    >
                        <TbRefresh size={20} />
                    </ActionIcon>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('statistic-nodes.component.total-traffic')}
                            </Text>
                            <Group align="flex-end" gap="xs">
                                <Text fw={700} size="xl">
                                    {prettyBytesToAnyUtil(totalUsage) || '0 GiB'}
                                </Text>
                            </Group>
                            <Sparkline
                                color={trendData.length > 1 ? 'rgba(0, 150, 255, 0.8)' : 'red'}
                                curveType="natural"
                                data={
                                    trendData.length > 1
                                        ? trendData.map((item) => item.value)
                                        : [1, 1, 1]
                                }
                                fillOpacity={0.2}
                                h={40}
                                strokeWidth={1.5}
                                trendColors={{
                                    positive: 'rgba(0, 191, 165, 0.7)',
                                    negative: 'rgba(242, 73, 92, 0.7)',
                                    neutral: 'rgba(110, 117, 139, 0.5)'
                                }}
                                w="100%"
                            />
                        </Stack>
                    </Card>

                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('statistic-nodes.component.top-nodes')}
                            </Text>
                            {topNodesWithUsage.length > 0 ? (
                                <Stack gap={4}>
                                    {topNodesWithUsage.map((node, index) => {
                                        return (
                                            <Group gap={8} justify="space-between" key={node.name}>
                                                <Group gap={8}>
                                                    {renderColorDot(node.color)}
                                                    <Text fw={index === 0 ? 600 : 400} size="sm">
                                                        {node.name}
                                                    </Text>
                                                </Group>
                                                <Text size="sm">
                                                    {prettyBytesToAnyUtil(node.total)}
                                                </Text>
                                            </Group>
                                        )
                                    })}
                                </Stack>
                            ) : (
                                <Center>
                                    <Stack align="center" gap={5}>
                                        <PiEmpty size="24px" />
                                        <Text c="dimmed" size="sm">
                                            {t('statistic-nodes.component.no-data-available')}
                                        </Text>
                                    </Stack>
                                </Center>
                            )}
                        </Stack>
                    </Card>
                </SimpleGrid>

                <Group align="center" justify="flex-start">
                    <IconChartBar size={16} />
                    <MultiSelect
                        checkIconPosition="left"
                        clearable
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        data={series.map((s) => ({ value: s.name, label: s.name }))}
                        maw={{ base: '100%', sm: 400 }}
                        onChange={setSelectedNodes}
                        placeholder={t('statistic-nodes.component.filter-nodes')}
                        searchable
                        size="sm"
                        value={selectedNodes}
                    />
                </Group>

                {renderLegend()}
                {renderBarChart()}
            </Stack>

            <Modal
                centered
                onClose={() => {
                    setNodeDetailsActive(false)
                    setCurrentDateIndex(null)
                }}
                opened={nodeDetailsActive}
                size="600px"
                title={
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Group gap="md">
                            <ActionIcon
                                disabled={!hasPreviousDay}
                                onClick={goToPreviousDay}
                                title={t('statistic-nodes.component.previous-day')}
                                variant="subtle"
                            >
                                <TbChevronLeft size={16} />
                            </ActionIcon>
                            <Text>{selectedDate}</Text>
                            <ActionIcon
                                disabled={!hasNextDay}
                                onClick={goToNextDay}
                                title={t('statistic-nodes.component.next-day')}
                                variant="subtle"
                            >
                                <TbChevronRight size={16} />
                            </ActionIcon>
                        </Group>
                        <Text c="dimmed" fz="sm">
                            {t('statistic-nodes.component.total-traffic')}:{' '}
                            {selectedDayTotal ? prettyBytesToAnyUtil(selectedDayTotal) : ''}
                        </Text>
                    </Group>
                }
            >
                {selectedDayData && (
                    <Stack>
                        <ScrollArea h={400} offsetScrollbars type="always">
                            <Table highlightOnHover striped withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t('statistic-nodes.component.node')}</Table.Th>
                                        <Table.Th style={{ textAlign: 'right' }}>
                                            {t('statistic-nodes.component.traffic')}
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedDayData.map((entry) => {
                                        return (
                                            <Table.Tr key={entry.name}>
                                                <Table.Td>
                                                    <Group gap={8}>
                                                        <Box
                                                            h={12}
                                                            style={{
                                                                background: entry.color,
                                                                borderRadius: '50%',
                                                                boxShadow:
                                                                    '0 1px 2px rgba(0,0,0,0.1)'
                                                            }}
                                                            w={12}
                                                        />
                                                        <Text>{entry.name}</Text>
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td style={{ textAlign: 'right' }}>
                                                    <Text fw={500}>
                                                        {prettyBytesToAnyUtil(entry.value)}
                                                    </Text>
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    })}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                )}
            </Modal>
        </Page>
    )
}
