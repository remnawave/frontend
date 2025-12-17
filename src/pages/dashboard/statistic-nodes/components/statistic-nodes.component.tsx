import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { ActionIcon, SimpleGrid, Stack } from '@mantine/core'
import { TbCalendar, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { HiChartPie } from 'react-icons/hi'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { NodesStatisticSparklineCardWidget } from '@widgets/dashboard/nodes-statistic/statistic-sparkline-card'
import { NodesStatisticTopNodesCardWidget } from '@widgets/dashboard/nodes-statistic/statistic-top-card'
import { NodesStatisticBarchartWidget } from '@widgets/dashboard/nodes-statistic/statistic-barchart'
import { getColorPaletteItemByIndexUtil } from '@shared/utils/color-resolver'
import { useGetNodesUsageByRangeCommand } from '@shared/api/hooks'
import { Page, PageHeaderShared } from '@shared/ui'

const DEFAULT_DATE_RANGE = {
    start: dayjs().utc().subtract(7, 'day').startOf('day').toISOString(),
    end: dayjs().utc().endOf('day').toISOString()
}

export const StatisticNodesPage = () => {
    const { t } = useTranslation()

    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        DEFAULT_DATE_RANGE.start,
        DEFAULT_DATE_RANGE.end
    ])

    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(DEFAULT_DATE_RANGE)

    const {
        data: nodesStats,
        isLoading,
        refetch,
        isRefetching
    } = useGetNodesUsageByRangeCommand({
        query: {
            start: queryRange.start,
            end: queryRange.end
        },
        rQueryParams: {
            enabled: Boolean(queryRange.start && queryRange.end)
        }
    })

    const handleDateRangeChange = (value: DatesRangeValue<string>) => {
        setRawRange(value)
        if (!value[0] || !value[1]) return

        const start = value[0]
        const end = value[1]

        if (!dayjs(start).isValid() || !dayjs(end).isValid()) return

        setQueryRange({
            start: dayjs(start).utc().startOf('day').toISOString(),
            end: dayjs(end).utc().endOf('day').toISOString()
        })
    }

    const { categories, series, sparklineData, topNodes } = useMemo(() => {
        if (!nodesStats) {
            return {
                categories: [],
                series: [],
                sparklineData: [],
                topNodes: []
            }
        }

        const seriesWithColors = nodesStats.series.map((s, index) => ({
            ...s,
            color: getColorPaletteItemByIndexUtil(index).solid
        }))

        const topNodesWithColors = nodesStats.topNodes.map((node, index) => ({
            ...node,
            color: getColorPaletteItemByIndexUtil(
                nodesStats.series.findIndex((s) => s.uuid === node.uuid) ?? index
            ).solid
        }))

        return {
            categories: nodesStats.categories,
            series: seriesWithColors,
            sparklineData: nodesStats.sparklineData,
            topNodes: topNodesWithColors
        }
    }, [nodesStats])

    return (
        <Page title={t('constants.nodes-statistics')}>
            <PageHeaderShared
                actions={
                    <>
                        <DatePickerInput
                            dropdownType="modal"
                            headerControlsOrder={['previous', 'next', 'level']}
                            leftSection={<TbCalendar size="24px" />}
                            maxDate={new Date()}
                            onChange={handleDateRangeChange}
                            presets={[
                                {
                                    label: t('statistic-nodes.component.3-days'),
                                    value: [
                                        dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.7-days'),
                                    value: [
                                        dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.14-days'),
                                    value: [
                                        dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.30-days'),
                                    value: [
                                        dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.60-days'),
                                    value: [
                                        dayjs().subtract(60, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.90-days'),
                                    value: [
                                        dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.180-days'),
                                    value: [
                                        dayjs().subtract(180, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                }
                            ]}
                            size="md"
                            styles={{
                                calendarHeaderLevel: {
                                    justifyContent: 'flex-end'
                                },
                                presetsList: {
                                    justifyContent: 'center'
                                }
                            }}
                            type="range"
                            value={rawRange}
                            valueFormat="DD MMM, YYYY"
                        />

                        <ActionIcon
                            loading={isRefetching}
                            onClick={() => refetch()}
                            size="input-md"
                            variant="light"
                        >
                            <TbRefresh size="24px" />
                        </ActionIcon>
                    </>
                }
                icon={<HiChartPie size={24} />}
                title={t('constants.nodes-statistics')}
            />

            <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <NodesStatisticSparklineCardWidget
                        isLoading={isLoading}
                        sparklineData={sparklineData}
                    />

                    <NodesStatisticTopNodesCardWidget isLoading={isLoading} topNodes={topNodes} />
                </SimpleGrid>

                <NodesStatisticBarchartWidget
                    categories={categories}
                    isLoading={isLoading}
                    series={series}
                />
            </Stack>
        </Page>
    )
}
