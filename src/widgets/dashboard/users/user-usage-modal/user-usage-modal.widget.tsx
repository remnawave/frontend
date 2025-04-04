import {
    Accordion,
    ActionIcon,
    Box,
    Card,
    Center,
    Drawer,
    Group,
    Modal,
    MultiSelect,
    Paper,
    ScrollArea,
    SegmentedControl,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    Tabs,
    Text,
    Tooltip
} from '@mantine/core'
import { TbChartBar as IconChartBar, TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { GetUserUsageByRangeCommand } from '@remnawave/backend-contract'
import { PiEmpty, PiListBullets } from 'react-icons/pi'
import { BarChart, Sparkline } from '@mantine/charts'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { useGetUserUsageByRange } from '@shared/api/hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import { IProps } from './interfaces'

export const UserUsageModalWidget = (props: IProps) => {
    const { userUuid, opened, onClose } = props
    const { t } = useTranslation()

    const [period, setPeriod] = useState<'7' | '14' | '30' | '60' | '90' | '180' | '365'>('7')
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        dayjs().utc().subtract(7, 'day').startOf('hour').toDate(),
        dayjs().utc().startOf('hour').toDate()
    ])
    const [selectedNodes, setSelectedNodes] = useState<string[]>([])
    const [viewType, setViewType] = useState<'grouped' | 'stacked'>('stacked')
    const [highlightedNode, setHighlightedNode] = useState<null | string>(null)
    const [nodeDetailsActive, setNodeDetailsActive] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<null | string>(null)
    const [selectedDayData, setSelectedDayData] = useState<Array<{
        color: string
        name: string
        value: number
    }> | null>(null)
    const [currentDateIndex, setCurrentDateIndex] = useState<null | number>(null)
    const ch = new ColorHash({ lightness: 0.5, saturation: 0.7 })

    useEffect(() => {
        if (!opened) {
            setSelectedNodes([])
            setHighlightedNode(null)
            setViewType('stacked')
            setPeriod('7')
            setDateRange([
                dayjs().utc().subtract(7, 'day').startOf('hour').toDate(),
                dayjs().utc().startOf('hour').toDate()
            ])
        }
    }, [opened])

    useEffect(() => {
        const end = dayjs().utc().startOf('hour').toDate()
        const start = dayjs().utc().subtract(Number(period), 'day').startOf('hour').toDate()
        setDateRange([start, end])
    }, [period])

    const { data: userUsage, isLoading } = useGetUserUsageByRange({
        route: {
            uuid: userUuid
        },
        query: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
        }
    })

    const formatDataForChart = (dbData: GetUserUsageByRangeCommand.Response['response'] = []) => {
        interface ChartData {
            [key: string]: number | string
            date: string
        }

        const groupedData: Record<string, ChartData> = {}
        const seriesSet = new Set<string>()
        const nodeTotal: Record<string, number> = {}

        dbData.forEach(({ nodeName, total, date }) => {
            const formattedDate = dayjs(date).format('MMM D')
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = { date: formattedDate }
            }

            groupedData[formattedDate][nodeName] = total
            seriesSet.add(nodeName)

            if (!nodeTotal[nodeName]) {
                nodeTotal[nodeName] = 0
            }
            nodeTotal[nodeName] += total
        })

        const sortedNodes = Object.entries(nodeTotal)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name)

        return {
            data: Object.values(groupedData),
            series: Array.from(seriesSet).map((nodeName) => {
                const color = ch.hex(nodeName)

                return {
                    name: nodeName,
                    color,
                    total: nodeTotal[nodeName] || 0
                }
            }),
            topNodes: sortedNodes.slice(0, 3),
            totalUsage: Object.values(nodeTotal).reduce((sum, val) => sum + val, 0)
        }
    }

    const { data, series, topNodes, totalUsage } = formatDataForChart(userUsage ?? [])

    const filteredSeries =
        selectedNodes.length > 0 ? series.filter((s) => selectedNodes.includes(s.name)) : series

    const sortedSeries = [...filteredSeries].sort((a, b) => b.total - a.total)

    const trendData = useMemo(() => {
        const dailyTotals = data.map((day) => {
            const total = Object.entries(day)
                .filter(([key]) => key !== 'date')
                .reduce((sum, [, value]) => {
                    return sum + (typeof value === 'number' ? value : 0)
                }, 0)
            return { date: day.date, value: total }
        })
        return dailyTotals
    }, [data])

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
            'layout'
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

    const renderBarChart = () => {
        if (isLoading) {
            return <Skeleton height={400} mt="md" />
        }

        if (!hasData) {
            return (
                <Center h={400} mt="md" py="xl" ta="center">
                    <Box>
                        <PiEmpty size={'2rem'} />
                        <Text c="dimmed">
                            {t('user-usage-modal.widget.no-data-available-for-the-selected-period')}
                        </Text>
                    </Box>
                </Center>
            )
        }

        return (
            <Box mt="md" style={{ width: '100%', height: 400 }}>
                <BarChart
                    barProps={{
                        radius: 3,
                        cursor: 'pointer',
                        onClick: (barData, index) => {
                            const barIndex = typeof index === 'number' ? index : -1
                            handleBarClick(barData, barIndex)
                        }
                    }}
                    data={data}
                    dataKey="date"
                    h={400}
                    maxBarWidth={35}
                    orientation="vertical"
                    series={displaySeries}
                    tooltipAnimationDuration={200}
                    tooltipProps={{
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
                            const totalForDay = validPayload.reduce((sum, entry) => {
                                return sum + (Number(entry.value) || 0)
                            }, 0)

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
                                    {filteredPayload.length > 10 && (
                                        <Text c="dimmed" fz="xs" mt={8} ta="center">
                                            {`+ ${filteredPayload.length - 10} more`}
                                            <Text c="dimmed" fz="xs" mt={8} ta="center">
                                                {t('user-usage-modal.widget.click-to-see-all')}
                                            </Text>
                                        </Text>
                                    )}
                                </Paper>
                            )
                        }
                    }}
                    type={viewType === 'stacked' ? 'stacked' : 'default'}
                    valueFormatter={(value) => {
                        return prettyBytesToAnyUtil(value) ?? ''
                    }}
                    withLegend={false}
                    withXAxis
                />

                <Text c="dimmed" mt={8} size="sm" ta="center">
                    {t('user-usage-modal.widget.show-nodes')}
                </Text>
            </Box>
        )
    }

    const renderLegend = () => {
        const content = (
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
                {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <Group
                            gap={8}
                            key={i}
                            style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                            }}
                        >
                            <Skeleton circle height={10} width={10} />
                            <Skeleton height={20} width={120} />
                        </Group>
                    ))}

                {!isLoading && !hasData && (
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
                            <PiEmpty size="1.5rem" />
                            <Text c="dimmed" size="sm">
                                {t('user-usage-modal.widget.no-data-available')}
                            </Text>
                        </Stack>
                    </Group>
                )}

                {!isLoading &&
                    sortedSeries.map((node) => (
                        <Group
                            gap={8}
                            key={node.name}
                            onClick={() =>
                                setHighlightedNode(highlightedNode === node.name ? null : node.name)
                            }
                            style={{
                                opacity: highlightedNode && highlightedNode !== node.name ? 0.5 : 1,
                                transition: 'opacity 0.2s',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor:
                                    highlightedNode === node.name
                                        ? 'rgba(0,0,0,0.1)'
                                        : 'transparent'
                            }}
                        >
                            <Box
                                h={10}
                                style={{
                                    backgroundColor: node.color,
                                    borderRadius: '50%'
                                }}
                                w={10}
                            />
                            <Tooltip
                                label={t(
                                    highlightedNode === node.name
                                        ? 'user-usage-modal.widget.click-to-show-all'
                                        : 'user-usage-modal.widget.click-to-highlight-only-this-node'
                                )}
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
        )

        return (
            <Accordion defaultValue="closed" variant="default">
                <Accordion.Item value="legend">
                    <Accordion.Control
                        icon={<PiListBullets color="var(--mantine-color-gray-7)" size={18} />}
                    >
                        {t('user-usage-modal.widget.show-nodes')}
                    </Accordion.Control>
                    <Accordion.Panel>{content}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={onClose}
            opened={opened}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="900px"
            title={t('user-usage-modal.widget.traffic-statistics')}
        >
            <Stack gap="md">
                <Group align="center" justify="flex-start" wrap="nowrap">
                    <Text fw={600} fz="sm">
                        {t('user-usage-modal.widget.usage-by-period')}
                    </Text>
                    <Select
                        allowDeselect={false}
                        data={[
                            { label: t('user-usage-modal.widget.7-days'), value: '7' },
                            { label: t('user-usage-modal.widget.14-days'), value: '14' },
                            { label: t('user-usage-modal.widget.30-days'), value: '30' },
                            { label: t('user-usage-modal.widget.60-days'), value: '60' },
                            { label: t('user-usage-modal.widget.90-days'), value: '90' },
                            { label: t('user-usage-modal.widget.180-days'), value: '180' },
                            { label: t('user-usage-modal.widget.365-days'), value: '365' }
                        ]}
                        defaultValue="7"
                        onChange={(value) =>
                            setPeriod(
                                (value || '7') as '7' | '14' | '30' | '60' | '90' | '180' | '365'
                            )
                        }
                        size="sm"
                        value={period}
                        w={{ base: 130 }}
                    />
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('user-usage-modal.widget.total-traffic')}
                            </Text>
                            <Group align="flex-end" gap="xs">
                                {isLoading ? (
                                    <Skeleton height={28} width={120} />
                                ) : (
                                    <Text fw={700} size="xl">
                                        {prettyBytesToAnyUtil(totalUsage) || '0 GiB'}
                                    </Text>
                                )}
                            </Group>
                            {isLoading && <Skeleton height={40} />}
                            {!isLoading && (
                                <Sparkline
                                    color={trendData.length > 1 ? undefined : 'red'}
                                    curveType="natural"
                                    data={
                                        trendData.length > 1
                                            ? trendData.map((item) => item.value)
                                            : [1, 1, 1]
                                    }
                                    fillOpacity={0.4}
                                    h={40}
                                    strokeWidth={1.5}
                                    trendColors={{
                                        positive: 'teal.6',
                                        negative: 'red.6',
                                        neutral: 'gray.5'
                                    }}
                                    w="100%"
                                />
                            )}
                        </Stack>
                    </Card>

                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('user-usage-modal.widget.top-nodes')}
                            </Text>
                            {isLoading && (
                                <Stack gap={5}>
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                </Stack>
                            )}
                            {!isLoading && topNodesWithUsage.length > 0 && (
                                <Stack gap={4}>
                                    {topNodesWithUsage.map((node, index) => (
                                        <Group gap={8} justify="space-between" key={node.name}>
                                            <Group gap={8}>
                                                <Box
                                                    h={10}
                                                    style={{
                                                        backgroundColor: node.color,
                                                        borderRadius: '50%'
                                                    }}
                                                    w={10}
                                                />
                                                <Text fw={index === 0 ? 600 : 400} size="sm">
                                                    {node.name}
                                                </Text>
                                            </Group>
                                            <Text size="sm">
                                                {prettyBytesToAnyUtil(node.total)}
                                            </Text>
                                        </Group>
                                    ))}
                                </Stack>
                            )}
                            {!isLoading && !topNodesWithUsage.length && (
                                <Center>
                                    <Stack align="center" gap={5}>
                                        <PiEmpty size="1.5rem" />
                                        <Text c="dimmed" size="sm">
                                            {t('user-usage-modal.widget.no-data-available')}
                                        </Text>
                                    </Stack>
                                </Center>
                            )}
                        </Stack>
                    </Card>
                </SimpleGrid>

                <Group align="center" justify="space-between">
                    <Group gap="md">
                        <Group gap="xs" wrap="nowrap">
                            <IconChartBar size={16} />
                            <SegmentedControl
                                data={[
                                    {
                                        label: t('user-usage-modal.widget.stacked'),
                                        value: 'stacked'
                                    },
                                    {
                                        label: t('user-usage-modal.widget.grouped'),
                                        value: 'grouped'
                                    }
                                ]}
                                onChange={(value) =>
                                    setViewType((value || 'stacked') as 'grouped' | 'stacked')
                                }
                                size="xs"
                                value={viewType}
                            />
                        </Group>
                    </Group>
                    <MultiSelect
                        checkIconPosition="left"
                        clearable
                        data={
                            series?.map((s) => ({
                                value: s.name,
                                label: s.name
                            })) || []
                        }
                        maw={{ base: '100%', sm: 400 }}
                        onChange={setSelectedNodes}
                        placeholder={t('user-usage-modal.widget.filter-nodes')}
                        searchable
                        size="sm"
                        value={
                            selectedNodes?.filter((name) => series?.some((s) => s.name === name)) ||
                            []
                        }
                    />
                </Group>

                {renderLegend()}

                <Tabs defaultValue="bar">
                    <Tabs.List>
                        <Tabs.Tab leftSection={<IconChartBar size={16} />} value="bar">
                            {t('user-usage-modal.widget.bar-chart')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="bar">{renderBarChart()}</Tabs.Panel>
                </Tabs>
            </Stack>

            {/* Node details modal */}
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
                                title={t('user-usage-modal.widget.show-nodes')}
                                variant="subtle"
                            >
                                <TbChevronLeft size={16} />
                            </ActionIcon>
                            <Text>{selectedDate}</Text>
                            <ActionIcon
                                disabled={!hasNextDay}
                                onClick={goToNextDay}
                                title={t('user-usage-modal.widget.show-nodes')}
                                variant="subtle"
                            >
                                <TbChevronRight size={16} />
                            </ActionIcon>
                        </Group>
                        <Text c="dimmed" fz="sm">
                            {/* eslint-disable */}
                            {`${t('user-usage-modal.widget.total-traffic')}: ${
                                selectedDayData
                                    ? // prettier-ignore
                                      prettyBytesToAnyUtil(selectedDayData.reduce((sum, item) => sum + (item.value || 0), 0))
                                    : ''
                            }`}
                            {/* eslint-enable */}
                        </Text>
                    </Group>
                }
            >
                {selectedDayData && (
                    <Stack>
                        <Text c="dimmed" fz="sm">
                            {`${t('user-usage-modal.widget.total-traffic')}: ${prettyBytesToAnyUtil(
                                selectedDayData.reduce((sum, item) => sum + (item.value || 0), 0)
                            )}`}
                        </Text>
                        <ScrollArea h={400} offsetScrollbars type="always">
                            <Table highlightOnHover striped withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>
                                            {t('user-usage-modal.widget.show-nodes')}
                                        </Table.Th>
                                        <Table.Th style={{ textAlign: 'right' }}>
                                            {t('user-usage-modal.widget.total-traffic')}
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedDayData.map((entry) => (
                                        <Table.Tr key={entry.name}>
                                            <Table.Td>
                                                <Group gap={8}>
                                                    <Box
                                                        h={12}
                                                        style={{
                                                            backgroundColor: entry.color,
                                                            borderRadius: '50%'
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
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                )}
            </Modal>
        </Drawer>
    )
}
