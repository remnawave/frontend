import { Box, Card, Center, Group, Loader, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import HighchartsReact from 'highcharts-react-official'
import { PiChartPieDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import * as Highcharts from 'highcharts'
import { useMemo, useRef } from 'react'

import { useGetSubscriptionRequestHistoryStats } from '@shared/api/hooks'

export function SrhInspectorMetrics() {
    const { t } = useTranslation()
    const appChartRef = useRef<HighchartsReact.RefObject>(null)

    const { data: stats, isLoading } = useGetSubscriptionRequestHistoryStats()

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

    const platformChartOptions: Highcharts.Options = useMemo(() => {
        if (!stats?.byParsedApp || stats.byParsedApp.length === 0) return {}

        const data = stats.byParsedApp.map((item) => ({
            name: item.app || 'Unknown',
            y: item.count
        }))

        return {
            ...getHighchartsConfig('platforms'),
            series: [{ ...getHighchartsConfig('platforms').series[0], data }]
        }
    }, [stats?.byParsedApp])

    if (isLoading) {
        return (
            <Stack gap="md">
                <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="md">
                    {[1].map((i) => (
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
            <SimpleGrid cols={{ base: 1 }} spacing="lg">
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
            </SimpleGrid>
        </Stack>
    )
}
