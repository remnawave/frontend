/* eslint-disable no-nested-ternary */

import {
    PiCalculatorDuotone,
    PiChartPieDuotone,
    PiDeviceMobileDuotone,
    PiDevicesDuotone
} from 'react-icons/pi'
import { Box, Card, Center, Group, Loader, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Chart } from '@highcharts/react'
import { useMemo } from 'react'

import { IMetricCardProps, MetricCardShared } from '@shared/ui/metrics/metric-card'
import { useGetHwidDevicesStats } from '@shared/api/hooks'

export function HwidInspectorMetrics() {
    const { t } = useTranslation()

    const { data: stats, isLoading } = useGetHwidDevicesStats()

    const getHighchartsConfig = (chartFor: 'apps' | 'platforms') => {
        return {
            chart: {
                type: 'pie',
                backgroundColor: 'transparent',
                height: 300,
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
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b> – <b>{point.y}<b>',
                valueSuffix: ' device(s)',
                backgroundColor: 'var(--mantine-color-body)',
                borderColor: 'var(--mantine-color-gray-4)',
                style: {
                    color: 'var(--mantine-color-text)'
                }
            },
            plotOptions: {
                pie: {
                    innerSize: '60%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>, {point.percentage:.1f}%',
                        style: {
                            color: 'var(--mantine-color-text)',
                            fontSize: '12px'
                        },
                        distance: 20
                    },
                    showInLegend: false,
                    borderWidth: 2,
                    borderColor: 'var(--mantine-color-body)'
                }
            },
            series: [
                {
                    type: 'pie',
                    name:
                        chartFor === 'apps'
                            ? t('hwid-inspector-metrics.widget.apps')
                            : t('hwid-inspector-metrics.widget.platforms'),
                    colorByPoint: true
                }
            ],
            credits: {
                enabled: false
            }
        }
    }

    const platformChartOptions = useMemo(() => {
        if (!stats?.byPlatform || stats.byPlatform.length === 0) return {}

        const data = stats.byPlatform.map((item) => ({
            name: item.platform || 'Unknown',
            y: item.count
        }))

        return {
            ...getHighchartsConfig('platforms'),
            series: [{ ...getHighchartsConfig('platforms').series[0], data }]
        }
    }, [stats?.byPlatform])

    const appChartOptions = useMemo(() => {
        if (!stats?.byApp || stats.byApp.length === 0) return {}

        const data = stats.byApp.map((item) => ({
            name: item.app || 'Unknown',
            y: item.count
        }))

        return {
            ...getHighchartsConfig('apps'),
            series: [{ ...getHighchartsConfig('apps').series[0], data }]
        }
    }, [stats?.byApp])

    const metricCards: IMetricCardProps[] = [
        {
            IconComponent: PiDevicesDuotone,
            title: t('hwid-inspector-metrics.widget.total-unique-devices'),
            value: stats?.stats.totalUniqueDevices ?? 0,
            iconVariant: 'gradient-blue'
        },
        {
            IconComponent: PiDeviceMobileDuotone,
            title: t('hwid-inspector-metrics.widget.total-hwid-devices'),
            value: stats?.stats.totalHwidDevices ?? 0,
            iconVariant: 'gradient-teal'
        },
        {
            IconComponent: PiCalculatorDuotone,
            title: t('hwid-inspector-metrics.widget.avg-devices-per-user'),
            value: stats?.stats.averageHwidDevicesPerUser ?? 0,
            iconVariant: 'gradient-orange'
        }
    ]

    const loaderCard = (
        <Center h={300}>
            <Loader size="lg" />
        </Center>
    )

    return (
        <Stack gap="md" mb={0}>
            {/* Metric Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                {metricCards.map((card) => (
                    <MetricCardShared key={card.title} {...card} />
                ))}
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, lg: 2 }}>
                {/* Platform Distribution */}
                <Card
                    p="lg"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
                    }}
                    withBorder
                >
                    <Group align="center" gap="sm" mb="lg" wrap="nowrap">
                        <ThemeIcon color="blue" size="lg" variant="outline">
                            <PiChartPieDuotone size="20px" />
                        </ThemeIcon>
                        <Text
                            fw={600}
                            size="lg"
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                        >
                            {t('hwid-inspector-metrics.widget.platform-distribution')}
                        </Text>
                    </Group>

                    {isLoading ? (
                        loaderCard
                    ) : stats?.byPlatform && stats.byPlatform.length > 0 ? (
                        <Box h={300}>
                            <Chart options={platformChartOptions} />
                        </Box>
                    ) : (
                        <Center h={300}>
                            <Stack align="center" gap="sm">
                                <PiChartPieDuotone
                                    color="var(--mantine-color-gray-4)"
                                    size="48px"
                                />
                                <Text c="dimmed" size="sm">
                                    {t('hwid-inspector-metrics.widget.no-platform-data')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Card>

                {/* App Distribution */}
                <Card
                    p="lg"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
                    }}
                >
                    <Group align="center" gap="sm" mb="lg" wrap="nowrap">
                        <ThemeIcon color="teal" size="lg" variant="outline">
                            <PiChartPieDuotone size="20px" />
                        </ThemeIcon>

                        <Text
                            fw={600}
                            size="lg"
                            style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}
                        >
                            {t('hwid-inspector-metrics.widget.app-distribution')}
                        </Text>
                    </Group>
                    {isLoading ? (
                        loaderCard
                    ) : stats?.byApp && stats.byApp.length > 0 ? (
                        <Box h={300}>
                            <Chart options={appChartOptions} />
                        </Box>
                    ) : (
                        <Center h={300}>
                            <Stack align="center" gap="sm">
                                <PiChartPieDuotone
                                    color="var(--mantine-color-gray-4)"
                                    size="48px"
                                />
                                <Text c="dimmed" size="sm">
                                    {t('hwid-inspector-metrics.widget.no-app-data')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Card>
            </SimpleGrid>
        </Stack>
    )
}
