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
import {
    TbChartBar as IconChartBar,
    TbChevronLeft,
    TbChevronRight,
    TbRefresh
} from 'react-icons/tb'
import { GetNodeUserUsageByRangeCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PiEmpty, PiListBullets } from 'react-icons/pi'
import { BarChart, Sparkline } from '@mantine/charts'
import { useTranslation } from 'react-i18next'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { useGetNodeUsersUsageByRange } from '@shared/api/hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import { IProps } from './interfaces'

export const NodeUsersUsageDrawer = (props: IProps) => {
    const { nodeUuid, opened, onClose } = props
    const { t } = useTranslation()

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

    const [period, setPeriod] = useState<'7' | '14' | '30' | '60' | '90' | '180' | '365'>('7')
    const [dateRange, setDateRange] = useState<[Date, Date]>([
        dayjs().utc().subtract(7, 'day').startOf('hour').toDate(),
        dayjs().utc().startOf('hour').toDate()
    ])
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [viewType, setViewType] = useState<'grouped' | 'stacked'>('stacked')
    const [highlightedUser, setHighlightedUser] = useState<null | string>(null)
    const [userDetailsActive, setUserDetailsActive] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<null | string>(null)
    const [selectedDayData, setSelectedDayData] = useState<DayDataDetails | null>(null)
    const [currentDateIndex, setCurrentDateIndex] = useState<null | number>(null)
    const ch = new ColorHash({ lightness: 0.5, saturation: 0.7 })

    const handleMultiSelectChange = useCallback((newUsers: string[]) => {
        setSelectedUsers(newUsers)
    }, [])

    const handleViewTypeChange = useCallback((value: string) => {
        setViewType((value || 'stacked') as 'grouped' | 'stacked')
    }, [])

    const handleHighlightUser = useCallback((userName: string) => {
        setHighlightedUser((prevValue) => (prevValue === userName ? null : userName))
    }, [])

    useEffect(() => {
        if (!opened) {
            setSelectedUsers([])
            setHighlightedUser(null)
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

    const {
        data: nodeUsersUsage,
        isLoading,
        refetch,
        isRefetching
    } = useGetNodeUsersUsageByRange({
        route: {
            uuid: nodeUuid
        },
        query: {
            start: dateRange[0].toISOString(),
            end: dateRange[1].toISOString()
        }
    })

    const formatDataForChart = (
        dbData: GetNodeUserUsageByRangeCommand.Response['response'] = []
    ) => {
        if (!dbData || dbData.length === 0) {
            return {
                data: [],
                series: [],
                topUsers: [],
                totalUsage: 0,
                userCount: 0,
                significantUserCount: 0,
                displayedUserCount: 0
            }
        }

        interface ChartData {
            [key: string]: number | string
            date: string
        }

        const groupedData: Record<string, ChartData> = {}
        const seriesSet = new Set<string>()
        const userTotal: Record<string, number> = {}

        const uniqueDates = new Set<string>()
        dbData.forEach(({ date }) => {
            uniqueDates.add(dayjs(date).format('MMM D'))
        })
        uniqueDates.forEach((date) => {
            groupedData[date] = { date }
        })

        dbData.forEach(({ username, total, date }) => {
            const formattedDate = dayjs(date).format('MMM D')
            groupedData[formattedDate][username] = total
            seriesSet.add(username)

            if (!userTotal[username]) {
                userTotal[username] = 0
            }
            userTotal[username] += total
        })

        const totalUsage = Object.values(userTotal).reduce((sum, val) => sum + val, 0)

        const MIN_TRAFFIC_THRESHOLD = 100 * 1024 // 100 КБ

        const significantUsersData = Object.entries(userTotal)
            .filter(([, total]) => total >= MIN_TRAFFIC_THRESHOLD)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)

        const significantUsers = significantUsersData.map((item) => item.name)

        const MAX_DISPLAYED_USERS = 100
        const topSignificantUsers = significantUsers.slice(0, MAX_DISPLAYED_USERS)

        const allUserCount = seriesSet.size
        const significantUserCount = significantUsers.length
        const displayedUserCount = topSignificantUsers.length

        const generatedSeries = topSignificantUsers.map((userName) => {
            const color = ch.hex(userName)
            return {
                name: userName,
                color,
                total: userTotal[userName] || 0
            }
        })

        return {
            data: Object.values(groupedData),
            series: generatedSeries,
            topUsers: significantUsersData.slice(0, 3).map((item) => item.name),
            totalUsage,
            userCount: allUserCount,
            significantUserCount,
            displayedUserCount
        }
    }

    const {
        data,
        series,
        topUsers,
        totalUsage,
        userCount,
        significantUserCount,
        displayedUserCount
    } = useMemo(() => {
        return formatDataForChart(nodeUsersUsage ?? [])
    }, [nodeUsersUsage])

    const filteredSeries = useMemo(() => {
        return selectedUsers.length > 0
            ? series.filter((s) => selectedUsers.includes(s.name))
            : series
    }, [series, selectedUsers])

    const sortedSeries = useMemo(() => {
        return [...filteredSeries].sort((a, b) => b.total - a.total)
    }, [filteredSeries])

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
        if (highlightedUser) {
            return sortedSeries.filter((s) => s.name === highlightedUser)
        }

        if (Number(period) > 30 && sortedSeries.length > 10) {
            return sortedSeries.slice(0, 10)
        }

        return sortedSeries
    }, [sortedSeries, highlightedUser, period])

    const topUsersWithUsage = useMemo(() => {
        return topUsers.map((userName) => {
            const userInfo = series.find((s) => s.name === userName)
            return {
                name: userName,
                color: userInfo?.color || '#888',
                total: userInfo?.total || 0
            }
        })
    }, [series, topUsers])

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

        const allDayData = Object.entries(barData)
            .filter(([key]) => key !== 'date' && !technicalFields.includes(key))
            .map(([name, value]) => {
                const userInfo = series.find((s) => s.name === name)
                return {
                    name,
                    value: Number(value) || 0,
                    color: userInfo?.color || '#ccc'
                }
            })
            .sort((a, b) => b.value - a.value)

        const MIN_TRAFFIC_THRESHOLD = 100 * 1024

        const significantDayData = allDayData.filter((item) => item.value >= MIN_TRAFFIC_THRESHOLD)

        const hiddenUserCount = allDayData.length - significantDayData.length

        const totalDayTraffic = allDayData.reduce((sum, item) => sum + (item.value || 0), 0)

        const displayedDayTraffic = significantDayData.reduce(
            (sum, item) => sum + (item.value || 0),
            0
        )

        const hiddenDayTraffic = totalDayTraffic - displayedDayTraffic

        if (allDayData.length === 0) return

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
        setSelectedDayData({
            filtered: significantDayData,
            hiddenCount: hiddenUserCount,
            totalTraffic: totalDayTraffic,
            hiddenTraffic: hiddenDayTraffic
        })
        setCurrentDateIndex(dateIndex)
        setUserDetailsActive(true)
    }

    const goToPreviousDay = useCallback(() => {
        if (currentDateIndex === null || currentDateIndex <= 0) return

        const previousIndex = currentDateIndex - 1
        const previousData = data[previousIndex]

        if (!previousData) return

        handleBarClick(previousData, previousIndex)
    }, [currentDateIndex, data])

    const goToNextDay = useCallback(() => {
        if (currentDateIndex === null || currentDateIndex >= data.length - 1) return

        const nextIndex = currentDateIndex + 1
        const nextData = data[nextIndex]

        if (!nextData) return

        handleBarClick(nextData, nextIndex)
    }, [currentDateIndex, data, handleBarClick])

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

                                    <Text c="dimmed" fz="xs" mt={8} ta="center">
                                        {t('node-users-usage-drawer.widget.click-to-see-all-users')}
                                    </Text>
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
                    {t('node-users-usage-drawer.widget.click-on-bars-to-view-details')}
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
                                {t('node-users-usage-drawer.widget.no-data-available')}
                            </Text>
                        </Stack>
                    </Group>
                )}

                {!isLoading &&
                    sortedSeries.map((user) => (
                        <Group
                            gap={8}
                            key={user.name}
                            onClick={() => handleHighlightUser(user.name)}
                            style={{
                                opacity: highlightedUser && highlightedUser !== user.name ? 0.5 : 1,
                                transition: 'opacity 0.2s',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor:
                                    highlightedUser === user.name
                                        ? 'rgba(0,0,0,0.1)'
                                        : 'transparent'
                            }}
                        >
                            <Box
                                h={10}
                                style={{
                                    backgroundColor: user.color,
                                    borderRadius: '50%'
                                }}
                                w={10}
                            />
                            <Tooltip
                                label={
                                    /* eslint-disable indent */
                                    highlightedUser === user.name
                                        ? t(
                                              'node-users-usage-drawer.widget.click-to-show-all-users'
                                          )
                                        : t(
                                              'node-users-usage-drawer.widget.click-to-highlight-only-this-user'
                                          )
                                    /* eslint-enable indent */
                                }
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
                                    {user.name}
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
                        {t('node-users-usage-drawer.widget.users-accordeon', {
                            displayedUserCount,
                            significantUserCount,
                            userCount
                        })}
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
                                {t('node-users-usage-drawer.widget.top-users')}
                            </Text>
                            {isLoading && (
                                <Stack gap={5}>
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                    <Skeleton height={20} />
                                </Stack>
                            )}
                            {!isLoading && topUsersWithUsage.length > 0 && (
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
                            {!isLoading && !topUsersWithUsage.length && (
                                <Center>
                                    <Stack align="center" gap={5}>
                                        <PiEmpty size="1.5rem" />
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
                            series?.map((s) => ({
                                value: s.name,
                                label: s.name
                            })) || []
                        }
                        maw={{ base: '100%', sm: 400 }}
                        onChange={handleMultiSelectChange}
                        placeholder={t('node-users-usage-drawer.widget.filter-users')}
                        searchable
                        size="sm"
                        value={
                            selectedUsers?.filter((name) => series?.some((s) => s.name === name)) ||
                            []
                        }
                    />
                </Group>

                {renderLegend()}

                <Tabs defaultValue="bar">
                    <Tabs.List>
                        <Tabs.Tab leftSection={<IconChartBar size={16} />} value="bar">
                            {t('node-users-usage-drawer.widget.bar-chart')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="bar">{renderBarChart()}</Tabs.Panel>
                </Tabs>
            </Stack>

            <Modal
                centered
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
                            {/* eslint-disable indent */}
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
                            {/* eslint-enable indent */}
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
                                            usersCount: selectedDayData.hiddenCount,
                                            totalTraffic: prettyBytesToAnyUtil(
                                                selectedDayData.hiddenTraffic
                                            )
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
}
