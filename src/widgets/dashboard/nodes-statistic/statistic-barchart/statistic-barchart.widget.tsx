import {
    alpha,
    Box,
    Card,
    Center,
    Group,
    ScrollArea,
    Skeleton,
    Stack,
    Table,
    Text
} from '@mantine/core'
import { GetStatsNodesUsageCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbChartBar } from 'react-icons/tb'
import { Chart } from '@highcharts/react'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { CountryFlag } from '@shared/ui/get-country-flag'

interface IProps {
    categories: string[] | undefined
    isLoading: boolean
    series: GetStatsNodesUsageCommand.Response['response']['series'] | undefined
}

export const NodesStatisticBarchartWidget = (props: IProps) => {
    const { categories = [], series = [], isLoading } = props

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
                <BaseOverlayHeader
                    IconComponent={TbChartBar}
                    iconVariant="gradient-teal"
                    subtitle={t('statistic-nodes.component.total-traffic-placeholder', {
                        totalTraffic: prettyBytesToAnyUtil(totalDayTraffic)
                    })}
                    title={formatTimeUtil(category, 'D MMMM YYYY')}
                />
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
        <Card p="xs" withBorder>
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
                            borderRadius: 0,
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
                            autoRotation: [-45, 45],
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
                            const pointIndex = this.index
                            const seriesData = this.series.data

                            let parsedColor = this.series.color
                            if (typeof parsedColor === 'string' && parsedColor) {
                                parsedColor = alpha(parsedColor, 0.8)
                            } else {
                                parsedColor = '#888'
                            }

                            const totalInThisDay = this.series.chart.series.reduce((sum, s) => {
                                const point = s.data[pointIndex]
                                return sum + (point?.y || 0)
                            }, 0)

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
                                <div style="flex: 1; height: 6px; background: var(--mantine-color-body); border-radius: 3px; overflow: hidden;">
                                    <div style="width: ${Math.max((day.value / maxValue) * 100, 2)}%; height: 100%; background: ${parsedColor}; border-radius: 3px;"></div>
                                </div>
                                <span style="width: 50px; font-size: 0.7rem; font-weight: ${fontWeight};">${prettyBytesToAnyUtil(day.value, true)}</span>
                            </div>
                        `
                            })

                            return `
                            <div style="font-size: 0.875rem; padding: 4px; min-width: 220px;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: 600;">${formatTimeUtil(this.category, 'D MMMM YYYY')}</span>
                                    <span style="font-size: 0.85rem; color: var(--mantine-color-dimmed); display: flex; align-items: center; gap: 4px;">
                                        <span style="font-size: 0.85rem;">Σ</span>
                                        ${prettyBytesToAnyUtil(totalInThisDay, true)}
                                    </span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                    <div style="width: 10px; height: 10px; background: ${parsedColor}; border-radius: 50%; flex-shrink: 0;"></div>
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
                    series: series.map((s) => {
                        return {
                            type: 'bar',
                            name: s.name,
                            data: s.data,
                            color: alpha(s.color, 0.5),
                            borderWidth: 1,
                            borderColor: s.color,
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
