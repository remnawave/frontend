/* eslint-disable @stylistic/indent */
import {
    ActionIcon,
    Box,
    Card,
    Center,
    Drawer,
    Group,
    Modal,
    MultiSelect,
    ScrollArea,
    SegmentedControl,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    Text
} from '@mantine/core'
import {
    TbChartBar as IconChartBar,
    TbChevronLeft,
    TbChevronRight,
    TbRefresh
} from 'react-icons/tb'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import { PiEmpty, PiListBullets } from 'react-icons/pi'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Sparkline } from '@mantine/charts'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'

import { useHighchartsDataProcessor } from '@shared/hooks/use-highcharts-data-processor'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { useGetNodeUsersUsageByRange } from '@shared/api/hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

const MemoizedSparkline = memo(Sparkline)

interface DayDataDetails {
    filtered: Array<{
        color: string
        name: string
        value: number
    }>
    hiddenCount: number
    hiddenTraffic: number
    totalTraffic: number
}

export const NodeUsersUsageDrawer = memo(() => {
    const { isOpen, internalState: nodeUuid } = useModalsStore(
        (state) => state.modals[MODALS.SHOW_NODE_USERS_USAGE_DRAWER]
    )
    const { close } = useModalsStore()

    const { t } = useTranslation()

    const [period, setPeriod] = useState<'7' | '14' | '30' | '60' | '90' | '180' | '365'>('7')
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        dayjs().utc().subtract(7, 'day').startOf('day').toDate(),
        dayjs().utc().endOf('day').toDate()
    ])

    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [viewType, setViewType] = useState<'grouped' | 'stacked'>('stacked')
    const [userDetailsActive, setUserDetailsActive] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<null | string>(null)
    const [selectedDayData, setSelectedDayData] = useState<DayDataDetails | null>(null)
    const [currentDateIndex, setCurrentDateIndex] = useState<null | number>(null)

    const chartRef = useRef<HighchartsReact.RefObject>(null)

    const [debouncedSelectedUsers] = useDebouncedValue(selectedUsers, 300)

    const { processData, processedData, isProcessing, error } = useHighchartsDataProcessor()

    const handleMultiSelectChange = useCallback((newUsers: string[]) => {
        setSelectedUsers(newUsers)
    }, [])

    const handleViewTypeChange = useCallback((value: string) => {
        setViewType((value || 'stacked') as 'grouped' | 'stacked')
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setSelectedUsers([])
            setViewType('stacked')
            setPeriod('7')
            setDateRange([
                dayjs().utc().subtract(7, 'day').startOf('day').toDate(),
                dayjs().utc().endOf('day').toDate()
            ])
        }
    }, [isOpen])

    useEffect(() => {
        const end = dayjs().utc().endOf('day').toDate()
        const start = dayjs().utc().subtract(Number(period), 'day').startOf('day').toDate()
        setDateRange([start, end])
    }, [period])

    const {
        data: nodeUsersUsage,
        isLoading,
        refetch,
        isRefetching
    } = useGetNodeUsersUsageByRange({
        route: {
            uuid: nodeUuid?.nodeUuid ?? ''
        },
        rQueryParams: {
            enabled: !!nodeUuid?.nodeUuid
        },
        query: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
        }
    })

    useEffect(() => {
        if (!isOpen) return

        if (nodeUsersUsage && nodeUsersUsage.length > 0) {
            const processDataAsync = async () => {
                await processData(nodeUsersUsage, {
                    maxDisplayedUsers: 2_00,
                    minTrafficThreshold: 100 * 1024,
                    selectedUsers: debouncedSelectedUsers
                })
            }

            processDataAsync()
        }
    }, [isOpen, nodeUsersUsage, debouncedSelectedUsers, processData])

    const {
        categories = [],
        displayedUserCount = 0,
        series = [],
        significantUserCount = 0,
        topUsers = [],
        totalUsage = 0,
        trendData = [],
        userCount = 0,
        allAvailableUsers = []
    } = processedData || {}

    const topUsersWithUsage = useMemo(() => {
        return topUsers.map((userName) => {
            const userInfo = series.find((s) => s.name === userName)
            return {
                color: userInfo?.color || '#888',
                name: userName,
                total: userInfo?.total || 0
            }
        })
    }, [series, topUsers])

    const hasData = categories.length > 0 && series.length > 0
    const showLoading = isLoading || isProcessing

    const handleBarClick = useCallback(
        (category: string, pointIndex: number) => {
            if (!category) return

            const allDayData = series
                .map((s) => ({
                    color: s.color,
                    name: s.name,
                    value: s.data[pointIndex] || 0
                }))
                .filter((item) => item.value > 0)
                .sort((a, b) => b.value - a.value)

            const MIN_TRAFFIC_THRESHOLD = 100 * 1024
            const significantDayData = allDayData.filter(
                (item) => item.value >= MIN_TRAFFIC_THRESHOLD
            )
            const hiddenUserCount = allDayData.length - significantDayData.length
            const totalDayTraffic = allDayData.reduce((sum, item) => sum + item.value, 0)
            const hiddenDayTraffic =
                totalDayTraffic - significantDayData.reduce((sum, item) => sum + item.value, 0)

            if (allDayData.length === 0) return

            setSelectedDate(category)
            setSelectedDayData({
                filtered: significantDayData,
                hiddenCount: hiddenUserCount,
                hiddenTraffic: hiddenDayTraffic,
                totalTraffic: totalDayTraffic
            })
            setCurrentDateIndex(pointIndex)
            setUserDetailsActive(true)
        },
        [series]
    )

    const chartOptions: Highcharts.Options = useMemo(() => {
        if (!hasData) return {}

        const options: Highcharts.Options = {
            chart: {
                type: 'column',
                height: 400,
                backgroundColor: 'transparent',
                style: {
                    fontFamily: 'inherit'
                }
            },
            accessibility: {
                enabled: false
            },
            title: {
                text: undefined
            },
            subtitle: {
                text: undefined
            },
            xAxis: {
                categories,
                crosshair: true,
                labels: {
                    style: {
                        color: 'var(--mantine-color-text)'
                    }
                },
                gridLineColor: 'var(--mantine-color-gray-4)',
                gridLineWidth: 1,
                gridLineDashStyle: 'ShortDot'
            },
            yAxis: {
                title: undefined,
                labels: {
                    style: {
                        color: 'var(--mantine-color-text)'
                    },
                    formatter() {
                        return prettyBytesToAnyUtil(this.value as number) || ''
                    }
                },
                gridLineColor: undefined
            },
            plotOptions: {
                column: {
                    stacking: viewType === 'stacked' ? 'normal' : undefined,
                    borderWidth: 0,
                    borderRadius: 3,
                    maxPointWidth: 35,
                    point: {
                        events: {
                            click() {
                                handleBarClick(this.category as string, this.index)
                            }
                        }
                    },

                    cursor: 'pointer'
                }
            },
            tooltip: {
                shared: true,
                backgroundColor: 'var(--mantine-color-body)',
                borderColor: 'var(--mantine-color-gray-4)',
                style: {
                    color: 'var(--mantine-color-text)'
                },
                formatter() {
                    const points = this.points || []

                    if (points.length === 0) return ''

                    const date = points[0].category

                    const totalForDay = points.reduce((sum, point) => sum + (point.y || 0), 0)

                    let html = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.875rem;">
                        <div style="font-weight: 600;">${dayjs(date).format('D MMMM')}</div>
                        <div style="color: var(--mantine-color-dimmed);">Σ ${prettyBytesToAnyUtil(totalForDay)}</div>
                    </div>`

                    const sortedPoints = [...points]
                        .filter((point) => (point.y || 0) > 50_000)
                        .sort((a, b) => (b.y || 0) - (a.y || 0))
                        .slice(0, 10)

                    sortedPoints.forEach((point) => {
                        html += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <div style="width: 10px; height: 10px; background-color: ${point.color}; border-radius: 50%;"></div>
                            <span style="flex: 1;">${point.series.name}</span>
                            <span style="font-weight: 500;">${prettyBytesToAnyUtil(point.y || 0)}</span>
                        </div>`
                    })

                    html += `<div style="color: var(--mantine-color-dimmed); font-size: 0.75rem; text-align: center; margin-top: 8px;">${t('node-users-usage-drawer.widget.click-to-see-all-users')}</div>`

                    return html
                },
                useHTML: true
            },
            legend: {
                enabled: false
            },
            series: series.map((s) => ({
                name: s.name,
                data: s.data,
                color: s.color,
                type: 'column'
            })),
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            }
        }

        return options
    }, [hasData, categories, series, viewType, t, handleBarClick])

    const goToPreviousDay = useCallback(() => {
        if (currentDateIndex === null || currentDateIndex <= 0) return
        const previousIndex = currentDateIndex - 1
        const previousCategory = categories[previousIndex]
        if (!previousCategory) return
        handleBarClick(previousCategory, previousIndex)
    }, [currentDateIndex, categories, handleBarClick])

    const goToNextDay = useCallback(() => {
        if (currentDateIndex === null || currentDateIndex >= categories.length - 1) return
        const nextIndex = currentDateIndex + 1
        const nextCategory = categories[nextIndex]
        if (!nextCategory) return
        handleBarClick(nextCategory, nextIndex)
    }, [currentDateIndex, categories, handleBarClick])

    const hasPreviousDay = currentDateIndex !== null && currentDateIndex > 0
    const hasNextDay = currentDateIndex !== null && currentDateIndex < categories.length - 1

    const renderChart = useCallback(() => {
        if (showLoading) {
            return <Skeleton height={400} mt="md" />
        }

        if (!hasData) {
            return (
                <Center h={400} mt="md" py="xl" ta="center">
                    <Box>
                        <PiEmpty size={'2rem'} />
                        <Text c="dimmed">
                            {t(
                                'node-users-usage-drawer.widget.no-data-available-for-the-selected-period'
                            )}
                        </Text>
                    </Box>
                </Center>
            )
        }

        return (
            <Box mt="md" style={{ width: '100%', height: 400 }}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
                <Text c="dimmed" mt={8} size="sm" ta="center">
                    {t('node-users-usage-drawer.widget.click-on-bars-to-view-details')}
                </Text>
            </Box>
        )
    }, [showLoading, hasData, chartOptions, t])

    const renderLegend = useCallback(() => {
        return (
            <Card withBorder>
                <Group gap="xs" wrap="nowrap">
                    <PiListBullets size={18} />
                    <Text>
                        {t('node-users-usage-drawer.widget.users-accordeon', {
                            displayedUserCount,
                            significantUserCount,
                            userCount
                        })}
                    </Text>
                </Group>
            </Card>
        )
    }, [displayedUserCount, significantUserCount, t, userCount])

    if (error) {
        return (
            <Drawer
                onClose={() => close(MODALS.SHOW_NODE_USERS_USAGE_DRAWER)}
                opened={isOpen}
                size="400px"
                title="Error"
            >
                <Text c="red">Error processing data: {error}</Text>
            </Drawer>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={() => close(MODALS.SHOW_NODE_USERS_USAGE_DRAWER)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="900px"
            title={t('node-users-usage-drawer.widget.user-traffic-statistics')}
        >
            <Stack gap="md">
                <Group align="center" justify="flex-start" wrap="nowrap">
                    <Text fw={600} fz="sm">
                        {t('node-users-usage-drawer.widget.usage-by-period')}
                    </Text>
                    <Select
                        allowDeselect={false}
                        data={[
                            { label: t('node-users-usage-drawer.widget.7-days'), value: '7' },
                            { label: t('node-users-usage-drawer.widget.14-days'), value: '14' },
                            { label: t('node-users-usage-drawer.widget.30-days'), value: '30' },
                            { label: t('node-users-usage-drawer.widget.60-days'), value: '60' },
                            { label: t('node-users-usage-drawer.widget.90-days'), value: '90' },
                            { label: t('node-users-usage-drawer.widget.180-days'), value: '180' },
                            { label: t('node-users-usage-drawer.widget.365-days'), value: '365' }
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
                    <ActionIcon
                        loading={isRefetching}
                        onClick={() => refetch()}
                        size="input-sm"
                        variant="subtle"
                    >
                        <TbRefresh size={20} />
                    </ActionIcon>
                </Group>

                <Text c="dimmed" fw={500} fz="sm">
                    {t('node-users-usage-drawer.widget.performance-line-1')} <br />
                    {t('node-users-usage-drawer.widget.performance-line-2')}
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('node-users-usage-drawer.widget.total-traffic')}
                            </Text>
                            <Group align="flex-end" gap="xs">
                                {showLoading ? (
                                    <Skeleton height={28} width={120} />
                                ) : (
                                    <Text fw={700} size="xl">
                                        {prettyBytesToAnyUtil(totalUsage) || '0 GiB'}
                                    </Text>
                                )}
                            </Group>
                            {showLoading && <Skeleton height={40} />}
                            {!showLoading && (
                                <MemoizedSparkline
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
                                        negative: 'red.6',
                                        neutral: 'gray.5',
                                        positive: 'teal.6'
                                    }}
                                    w="100%"
                                />
                            )}
                        </Stack>
                    </Card>

                    <Card p="xs" withBorder>
                        <Stack gap="xs">
                            <Text c="dimmed" size="sm">
                                {t('node-users-usage-drawer.widget.top-users')}
                            </Text>
                            {showLoading && (
                                <Stack gap={5}>
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                </Stack>
                            )}
                            {!showLoading && topUsersWithUsage.length > 0 && (
                                <Stack gap={4}>
                                    {topUsersWithUsage.map((user, index) => (
                                        <Group gap={8} justify="space-between" key={user.name}>
                                            <Group gap={8}>
                                                <Box
                                                    h={10}
                                                    style={{
                                                        backgroundColor: user.color,
                                                        borderRadius: '50%'
                                                    }}
                                                    w={10}
                                                />
                                                <Text fw={index === 0 ? 600 : 400} size="sm">
                                                    {user.name}
                                                </Text>
                                            </Group>
                                            <Text size="sm">
                                                {prettyBytesToAnyUtil(user.total)}
                                            </Text>
                                        </Group>
                                    ))}
                                </Stack>
                            )}
                            {!showLoading && !topUsersWithUsage.length && (
                                <Center>
                                    <Stack align="center" gap={5}>
                                        <PiEmpty size="24px" />
                                        <Text c="dimmed" size="sm">
                                            {t('node-users-usage-drawer.widget.no-data-available')}
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
                                        label: t('node-users-usage-drawer.widget.stacked'),
                                        value: 'stacked'
                                    },
                                    {
                                        label: t('node-users-usage-drawer.widget.grouped'),
                                        value: 'grouped'
                                    }
                                ]}
                                onChange={handleViewTypeChange}
                                size="xs"
                                value={viewType}
                            />
                        </Group>
                    </Group>
                    <MultiSelect
                        checkIconPosition="left"
                        clearable
                        data={
                            allAvailableUsers?.map((user) => ({
                                label: user.name,
                                value: user.name
                            })) || []
                        }
                        maw={{ base: '100%', sm: 400 }}
                        onChange={handleMultiSelectChange}
                        placeholder={t('node-users-usage-drawer.widget.filter-users')}
                        searchable
                        size="sm"
                        value={
                            selectedUsers?.filter((name) =>
                                allAvailableUsers?.some((user) => user.name === name)
                            ) || []
                        }
                    />
                </Group>

                {renderLegend()}

                {renderChart()}
            </Stack>

            <Modal
                centered
                component="div"
                onClose={() => {
                    setUserDetailsActive(false)
                    setCurrentDateIndex(null)
                }}
                opened={userDetailsActive}
                size="600px"
                title={
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Group gap="md">
                            <ActionIcon
                                disabled={!hasPreviousDay}
                                onClick={goToPreviousDay}
                                title={t('node-users-usage-drawer.widget.previous-day')}
                                variant="subtle"
                            >
                                <TbChevronLeft size={16} />
                            </ActionIcon>
                            <Text>{selectedDate}</Text>
                            <ActionIcon
                                disabled={!hasNextDay}
                                onClick={goToNextDay}
                                title={t('node-users-usage-drawer.widget.next-day')}
                                variant="subtle"
                            >
                                <TbChevronRight size={16} />
                            </ActionIcon>
                        </Group>
                        <Text c="dimmed" fz="sm">
                            {selectedDayData
                                ? t(
                                      'node-users-usage-drawer.widget.total-traffic-prettybytestoanyutil',
                                      {
                                          totalTraffic: prettyBytesToAnyUtil(
                                              selectedDayData.totalTraffic
                                          )
                                      }
                                  )
                                : ''}
                            {selectedDayData && selectedDayData.hiddenCount > 0 && (
                                <Text c="dimmed" fz="xs" mt={2}>
                                    {t('node-users-usage-drawer.widget.hidden-users', {
                                        hiddenCount: selectedDayData.hiddenCount
                                    })}
                                </Text>
                            )}
                        </Text>
                    </Group>
                }
            >
                {selectedDayData && (
                    <Stack>
                        <ScrollArea h={400} offsetScrollbars type="always">
                            {selectedDayData.filtered.length > 0 ? (
                                <Table highlightOnHover striped withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>
                                                {t('node-users-usage-drawer.widget.user')}
                                            </Table.Th>
                                            <Table.Th style={{ textAlign: 'right' }}>
                                                {t('node-users-usage-drawer.widget.traffic')}
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {selectedDayData.filtered.map((entry) => (
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
                            ) : (
                                <Center h={300}>
                                    <Text c="dimmed">
                                        {t(
                                            'node-users-usage-drawer.widget.no-users-with-traffic-100-kb'
                                        )}
                                    </Text>
                                </Center>
                            )}

                            {selectedDayData.hiddenCount > 0 && (
                                <Text c="dimmed" mt={16} size="sm" ta="center">
                                    {t(
                                        'node-users-usage-drawer.widget.users-hidden-with-less-than-100-kb',
                                        {
                                            totalTraffic: prettyBytesToAnyUtil(
                                                selectedDayData.hiddenTraffic
                                            ),
                                            usersCount: selectedDayData.hiddenCount
                                        }
                                    )}
                                </Text>
                            )}
                        </ScrollArea>
                    </Stack>
                )}
            </Modal>
        </Drawer>
    )
})
