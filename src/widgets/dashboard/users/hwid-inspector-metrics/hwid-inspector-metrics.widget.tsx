import {
    PiCalculatorDuotone,
    PiChartPieDuotone,
    PiDeviceMobileDuotone,
    PiDevicesDuotone
} from 'react-icons/pi'
import { Box, Card, Center, Group, Loader, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import HighchartsReact from 'highcharts-react-official'
import { useTranslation } from 'react-i18next'
import * as Highcharts from 'highcharts'
import { useMemo, useRef } from 'react'

import { MetricCard } from '@shared/ui/metrics/metric-card'
import { useGetHwidDevicesStats } from '@shared/api/hooks'
import { formatInt } from '@shared/utils/misc'

export function HwidInspectorMetrics() {
    const { t } = useTranslation()
    const platformChartRef = useRef<HighchartsReact.RefObject>(null)
    const appChartRef = useRef<HighchartsReact.RefObject>(null)

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

    const platformChartOptions: Highcharts.Options = useMemo(() => {
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

    const appChartOptions: Highcharts.Options = useMemo(() => {
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

    const metricCards = [
        {
            icon: PiDevicesDuotone,
            title: t('hwid-inspector-metrics.widget.total-unique-devices'),
            value: stats?.stats.totalUniqueDevices,
            color: 'blue'
        },
        {
            icon: PiDeviceMobileDuotone,
            title: t('hwid-inspector-metrics.widget.total-hwid-devices'),
            value: stats?.stats.totalHwidDevices,
            color: 'teal'
        },
        {
            icon: PiCalculatorDuotone,
            title: t('hwid-inspector-metrics.widget.avg-devices-per-user'),
            value: stats?.stats.averageHwidDevicesPerUser,
            color: 'orange',
            format: (value: number) => value?.toFixed(2) || '0.00'
        }
    ]

    if (isLoading) {
        return (
            <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} p="lg" radius="md" withBorder>
                            <Center h={80}>
                                <Loader size="md" />
                            </Center>
                        </Card>
                    ))}
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                    {[1, 2].map((i) => (
                        <Card key={i} p="lg" radius="md" withBorder>
                            <Center h={300}>
                                <Loader size="lg" />
                            </Center>
                        </Card>
                    ))}
                </SimpleGrid>
            </Stack>
        )
    }

    return (
        <Stack gap="xl">
            {/* Metric Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
                {metricCards.map((card) => (
                    <MetricCard.Root key={card.title}>
                        <Group wrap="nowrap">
                            <MetricCard.Icon c={card.color} p="sm">
                                <card.icon size="32px" />
                            </MetricCard.Icon>
                            <Stack align="self-start" gap="xs" miw={0} w="100%">
                                <MetricCard.TextMuted>{card.title}</MetricCard.TextMuted>
                                <Box miw={0} w={'100%'}>
                                    <MetricCard.TextEmphasis ff={'monospace'} truncate>
                                        {card.format
                                            ? card.format(card.value ?? 0)
                                            : formatInt(card.value ?? 0)}
                                    </MetricCard.TextEmphasis>
                                </Box>
                            </Stack>
                        </Group>
                    </MetricCard.Root>
                ))}
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                {/* Platform Distribution */}
                <Card
                    p="lg"
                    radius="md"
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
                    {stats?.byPlatform && stats.byPlatform.length > 0 ? (
                        <Box h={300}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={platformChartOptions}
                                ref={platformChartRef}
                            />
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
                    radius="md"
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
                    {stats?.byApp && stats.byApp.length > 0 ? (
                        <Box h={300}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={appChartOptions}
                                ref={appChartRef}
                            />
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
