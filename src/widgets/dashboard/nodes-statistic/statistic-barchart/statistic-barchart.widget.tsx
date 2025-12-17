import { Box, Card, Center, Group, ScrollArea, Skeleton, Stack, Table, Text } from '@mantine/core'
import { GetNodesUsageByRangeCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Chart } from '@highcharts/react'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { getColorPaletteItemByIndexUtil } from '@shared/utils/color-resolver'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { CountryFlag } from '@shared/ui/get-country-flag'

interface IProps {
    categories: string[]
    isLoading: boolean
    series: (GetNodesUsageByRangeCommand.Response['response']['series'][number] & {
        color: string
    })[]
}

export const NodesStatisticBarchartWidget = (props: IProps) => {
    const { categories, series, isLoading } = props

    const { t } = useTranslation()

    if (isLoading) {
        return <Skeleton height={500} />
    }

    if (categories.length === 0 || series.length === 0) {
        return (
            <Card mih={600} p="xs" withBorder>
                <Center h={600}>
                    <Stack align="center" gap={8}>
                        <PiEmpty size="2rem" />
                        <Text c="dimmed">
                            {t(
                                'statistic-nodes.component.no-data-available-for-the-selected-period'
                            )}
                        </Text>
                    </Stack>
                </Center>
            </Card>
        )
    }

    const handleBarClick = (category: string, pointIndex: number) => {
        if (!category) return

        const allDayData = series
            .map((s) => ({
                color: s.color,
                name: s.name,
                value: s.data[pointIndex] || 0,
                countryCode: s.countryCode
            }))
            .filter((item) => item.value > 0)
            .sort((a, b) => b.value - a.value)

        const totalDayTraffic = allDayData.reduce((sum, item) => sum + item.value, 0)

        if (allDayData.length === 0) return

        modals.open({
            centered: true,
            size: '600px',
            title: (
                <Group align="center" justify="space-between" wrap="nowrap">
                    <Text>{formatTimeUtil(category, 'D MMMM YYYY')}</Text>
                    <Text c="dimmed" fz="sm">
                        {t('statistic-nodes.component.total-traffic-placeholder', {
                            totalTraffic: prettyBytesToAnyUtil(totalDayTraffic)
                        })}
                    </Text>
                </Group>
            ),
            children: (
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
                                {allDayData.map((entry) => (
                                    <Table.Tr key={entry.name}>
                                        <Table.Td>
                                            <Group gap={8}>
                                                <Box
                                                    h={12}
                                                    style={{
                                                        background: entry.color,
                                                        borderRadius: '50%',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                    }}
                                                    w={12}
                                                />
                                                <Group gap={6}>
                                                    <CountryFlag countryCode={entry.countryCode} />
                                                    <Text>{entry.name}</Text>
                                                </Group>
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
            )
        })
    }

    return (
        <Card mih={600} p="xs" withBorder>
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                        height: '60%',
                        backgroundColor: 'transparent',
                        style: { fontFamily: 'inherit' }
                    },
                    accessibility: { enabled: false },
                    plotOptions: {
                        bar: {
                            stacking: 'normal',
                            borderWidth: 0,
                            borderRadius: 3,
                            cursor: 'pointer'
                        },
                        series: {
                            states: {
                                hover: { enabled: true, brightness: 0.1 },
                                inactive: { opacity: 0.2 }
                            },
                            stickyTracking: false
                        }
                    },
                    legend: {
                        enabled: true,
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',

                        backgroundColor: 'var(--mantine-color-body)',
                        borderWidth: 2,
                        padding: 20,
                        borderRadius: 14,
                        borderColor: 'var(--mantine-color-gray-7)',
                        itemMarginTop: 4,
                        itemMarginBottom: 4,
                        itemStyle: {
                            color: 'var(--mantine-color-text)',
                            fontSize: '14px',
                            fontWeight: '400'
                        },
                        itemHoverStyle: {
                            color: 'var(--mantine-color-text)',
                            fontWeight: '600',
                            textDecoration: 'underline'
                        },
                        itemHiddenStyle: {
                            color: 'var(--mantine-color-dimmed)'
                        },
                        symbolRadius: 2,
                        symbolHeight: 10,
                        symbolWidth: 10,
                        navigation: {
                            enabled: true,
                            activeColor: 'var(--mantine-color-primary-filled)',
                            inactiveColor: 'var(--mantine-color-dimmed)',
                            style: {
                                fontWeight: '500',
                                color: 'var(--mantine-color-text)',
                                fontSize: '12px'
                            }
                        }
                    },
                    credits: { enabled: false },
                    exporting: { enabled: false },
                    xAxis: {
                        reversed: false,
                        reversedStacks: true,
                        categories,
                        crosshair: true,
                        labels: {
                            style: { color: 'var(--mantine-color-text)' },
                            formatter: ({ value }) => formatTimeUtil(value, 'D MMM')
                        },
                        gridLineColor: 'var(--mantine-color-gray-light-hover)',
                        gridLineWidth: 1,
                        gridLineDashStyle: 'LongDash'
                    },
                    yAxis: {
                        title: undefined,
                        reversedStacks: false,
                        labels: {
                            style: { color: 'var(--mantine-color-text)' },
                            formatter: ({ value }) => prettyBytesToAnyUtil(value, true)
                        },
                        gridLineColor: undefined
                    },
                    tooltip: {
                        shared: false,
                        backgroundColor: 'var(--mantine-color-body)',
                        borderColor: 'var(--mantine-color-gray-4)',
                        style: { color: 'var(--mantine-color-text)' },
                        useHTML: true,
                        formatter() {
                            const value = this.y || 0
                            const { color } = this.series
                            const pointIndex = this.index
                            const seriesData = this.series.data

                            let gradientCss = '#888'
                            if (typeof color === 'string') {
                                gradientCss = color
                            } else if (color && 'stops' in color && Array.isArray(color.stops)) {
                                const stops = color.stops
                                    .map((stop) => {
                                        const [position, stopColor] = stop as [number, string]
                                        return `${stopColor} ${position * 100}%`
                                    })
                                    .join(', ')
                                gradientCss = `linear-gradient(90deg, ${stops})`
                            }

                            const nearbyDays: {
                                date: string
                                isCurrent: boolean
                                value: number
                            }[] = []

                            for (let i = 5; i >= -5; i--) {
                                const idx = pointIndex + i
                                if (idx >= 0 && idx < seriesData.length) {
                                    const point = seriesData[idx]
                                    nearbyDays.push({
                                        date: formatTimeUtil(point.category, 'D MMM'),
                                        isCurrent: i === 0,
                                        value: point.y || 0
                                    })
                                }
                            }

                            const maxValue = Math.max(...nearbyDays.map((d) => d.value), 1)

                            let nearbyDaysHtml = ''

                            nearbyDays.forEach((day) => {
                                if (day.value === 0) {
                                    return
                                }

                                const fontWeight = day.isCurrent ? 600 : 400

                                nearbyDaysHtml += `
                            <div style="display: flex; align-items: center; gap: 6px; opacity: ${day.isCurrent ? 1 : 0.5};">
                                <span style="width: 42px; font-size: 0.7rem; text-align: right; font-weight: ${fontWeight};">${day.date}</span>
                                <div style="flex: 1; height: 6px; background: var(--mantine-color-gray-3); border-radius: 3px; overflow: hidden;">
                                    <div style="width: ${Math.max((day.value / maxValue) * 100, 2)}%; height: 100%; background: ${gradientCss}; border-radius: 3px;"></div>
                                </div>
                                <span style="width: 50px; font-size: 0.7rem; font-weight: ${fontWeight};">${prettyBytesToAnyUtil(day.value, true)}</span>
                            </div>
                        `
                            })

                            return `
                            <div style="font-size: 0.875rem; padding: 4px; min-width: 220px;">
                                <div style="font-weight: 600; margin-bottom: 8px;">${formatTimeUtil(this.category, 'D MMMM YYYY')}</div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                    <div style="width: 10px; height: 10px; background: ${gradientCss}; border-radius: 50%; flex-shrink: 0;"></div>
                                    <span style="flex: 1;">${this.series.name}</span>
                                    <span style="font-weight: 600;">${prettyBytesToAnyUtil(value)}</span>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 3px; padding-top: 8px; border-top: 1px solid var(--mantine-color-gray-4);">
                                    ${nearbyDaysHtml}
                                </div>
                                <div style="color: var(--mantine-color-dimmed); font-size: 0.7rem; text-align: center; margin-top: 10px;">${t('statistic-nodes.component.click-to-see-all')}</div>
                            </div>
                        `
                        }
                    },
                    series: series.map((s, index) => {
                        const originalIndex = series.findIndex(
                            (original) => original.name === s.name
                        )
                        const colorSet = getColorPaletteItemByIndexUtil(
                            originalIndex !== -1 ? originalIndex : index
                        )
                        return {
                            type: 'bar' as const,
                            name: s.name,
                            data: s.data,
                            color: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                                stops: [
                                    [0, colorSet.gradient[1]],
                                    [1, colorSet.gradient[0]]
                                ] as Array<[number, string]>
                            },
                            point: {
                                events: {
                                    click(this) {
                                        handleBarClick(this.category as string, this.index)
                                    }
                                }
                            }
                        }
                    })
                }}
            />
        </Card>
    )
}
