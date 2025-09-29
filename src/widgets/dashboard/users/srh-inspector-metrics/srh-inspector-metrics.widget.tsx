import { Box, Card, Center, Group, Loader, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { PiChartBar, PiChartPieDuotone } from 'react-icons/pi'
import HighchartsReact from 'highcharts-react-official'
import { useTranslation } from 'react-i18next'
import * as Highcharts from 'highcharts'
import { useMemo, useRef } from 'react'
import dayjs from 'dayjs'

import { useGetSubscriptionRequestHistoryStats } from '@shared/api/hooks'

export function SrhInspectorMetrics() {
    const { t } = useTranslation()
    const appChartRef = useRef<HighchartsReact.RefObject>(null)
    const hourlyChartRef = useRef<HighchartsReact.RefObject>(null)

    const { data: stats, isLoading } = useGetSubscriptionRequestHistoryStats()

    const getPieChartConfig = (chartFor: 'apps' | 'platforms') => {
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
                valueSuffix: ' request(s)',
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
                        distance: 1
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

    const getBarChartConfig = () => {
        return {
            chart: {
                type: 'column',
                backgroundColor: 'transparent',
                height: 400,
                style: {
                    fontFamily: 'inherit'
                }
            },
            time: {
                useUTC: false
            },
            accessibility: {
                enabled: false
            },
            title: {
                text: undefined
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    hour: '%H:00'
                },

                units: [['hour', [1, 2, 3, 4, 6, 8, 12]]],
                labels: {
                    style: {
                        color: 'var(--mantine-color-text)'
                    }
                },
                gridLineColor: 'var(--mantine-color-gray-6)',
                lineColor: 'var(--mantine-color-gray-6)'
            },
            yAxis: {
                title: {
                    text: t('srh-inspector-metrics.widget.requests'),
                    style: {
                        color: 'var(--mantine-color-text)'
                    }
                },
                labels: {
                    style: {
                        color: 'var(--mantine-color-text)'
                    }
                },
                gridLineColor: 'var(--mantine-color-gray-6)',
                lineColor: 'var(--mantine-color-gray-6)'
            },

            tooltip: {
                shared: true,
                backgroundColor: 'var(--mantine-color-body)',
                borderColor: 'var(--mantine-color-gray-4)',
                headerFormat: '',
                style: {
                    color: 'var(--mantine-color-text)'
                },
                pointFormatter(this: { x: number; y: number }): string {
                    return `<b>${dayjs(this.x).format('DD.MM.YYYY, HH:mm')}</b> </br> Requests: <b>${this.y}<b>`
                }
            },
            plotOptions: {
                column: {
                    borderWidth: 0,
                    borderRadius: 4,
                    pointPadding: 0.1,
                    groupPadding: 0.1,
                    color: 'var(--mantine-color-indigo-6)',
                    states: {
                        hover: {
                            color: 'var(--mantine-color-indigo-3)'
                        }
                    },
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            }
        }
    }

    const platformChartOptions: Highcharts.Options = useMemo(() => {
        if (!stats?.byParsedApp || stats.byParsedApp.length === 0) return {}

        const data = stats.byParsedApp.map((item) => ({
            name: item.app || 'Unknown',
            y: item.count
        }))

        return {
            ...getPieChartConfig('platforms'),
            series: [{ ...getPieChartConfig('platforms').series[0], data }]
        }
    }, [stats?.byParsedApp])

    const hourlyChartOptions: Highcharts.Options = useMemo(() => {
        if (!stats?.hourlyRequestStats || stats.hourlyRequestStats.length === 0) return {}

        const data = stats.hourlyRequestStats.map((item) => {
            const utcDate = new Date(item.dateTime)
            return [utcDate.getTime(), item.requestCount]
        })

        return {
            ...getBarChartConfig(),
            series: [
                {
                    type: 'column',
                    name: t('srh-inspector-metrics.widget.requests'),
                    data
                }
            ]
        }
    }, [stats?.hourlyRequestStats, t])

    if (isLoading) {
        return (
            <Stack gap="md">
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                    {[1, 2].map((i) => (
                        <Card key={i} p="lg" radius="md" withBorder>
                            <Center h={i === 1 ? 300 : 400}>
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
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                <Card
                    p="lg"
                    radius="md"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
                    }}
                >
                    <Group align="center" gap="sm" mb="lg">
                        <ThemeIcon color="teal" size="lg" variant="outline">
                            <PiChartPieDuotone size="20px" />
                        </ThemeIcon>

                        <Text fw={600} size="lg">
                            {t('hwid-inspector-metrics.widget.app-distribution')}
                        </Text>
                    </Group>
                    {stats?.byParsedApp && stats.byParsedApp.length > 0 ? (
                        <Box h={300}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={platformChartOptions}
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

                <Card
                    p="lg"
                    radius="md"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
                    }}
                >
                    <Group align="center" gap="sm" mb="lg">
                        <ThemeIcon color="blue" size="lg" variant="outline">
                            <PiChartBar size="20px" />
                        </ThemeIcon>

                        <Text fw={600} size="lg">
                            {t('srh-inspector-metrics.widget.hourly-request-statistics')}
                        </Text>
                    </Group>
                    {stats?.hourlyRequestStats && stats.hourlyRequestStats.length > 0 ? (
                        <Box h={400}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={hourlyChartOptions}
                                ref={hourlyChartRef}
                            />
                        </Box>
                    ) : (
                        <Center h={400}>
                            <Stack align="center" gap="sm">
                                <PiChartBar color="var(--mantine-color-gray-4)" size="48px" />
                                <Text c="dimmed" size="sm">
                                    {t('srh-inspector-metrics.widget.no-hourly-data-available')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Card>
            </SimpleGrid>
        </Stack>
    )
}
