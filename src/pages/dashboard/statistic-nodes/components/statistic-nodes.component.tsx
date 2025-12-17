import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { ActionIcon, SimpleGrid, Stack } from '@mantine/core'
import { TbCalendar, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { HiChartPie } from 'react-icons/hi'
import { useState } from 'react'
import dayjs from 'dayjs'

import { NodesStatisticSparklineCardWidget } from '@widgets/dashboard/nodes-statistic/statistic-sparkline-card'
import { NodesStatisticTopNodesCardWidget } from '@widgets/dashboard/nodes-statistic/statistic-top-card'
import { NodesStatisticBarchartWidget } from '@widgets/dashboard/nodes-statistic/statistic-barchart'
import { useGetStatsNodesUsage } from '@shared/api/hooks'
import { Page, PageHeaderShared } from '@shared/ui'

const DEFAULT_DATE_RANGE = {
    start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
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
    } = useGetStatsNodesUsage({
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

        const startDate = value[0]
        const endDate = value[1]

        if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) return

        const startISO = dayjs(startDate).format('YYYY-MM-DD')
        const endISO = dayjs(endDate).format('YYYY-MM-DD')

        setQueryRange({ start: startISO, end: endISO })
    }

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
                                        dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.7-days'),
                                    value: [
                                        dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.14-days'),
                                    value: [
                                        dayjs().subtract(13, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.30-days'),
                                    value: [
                                        dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.60-days'),
                                    value: [
                                        dayjs().subtract(59, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.90-days'),
                                    value: [
                                        dayjs().subtract(89, 'day').format('YYYY-MM-DD'),
                                        dayjs().format('YYYY-MM-DD')
                                    ]
                                },
                                {
                                    label: t('statistic-nodes.component.180-days'),
                                    value: [
                                        dayjs().subtract(179, 'day').format('YYYY-MM-DD'),
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
                        sparklineData={nodesStats?.sparklineData}
                    />

                    <NodesStatisticTopNodesCardWidget
                        isLoading={isLoading}
                        topNodes={nodesStats?.topNodes}
                    />
                </SimpleGrid>

                <NodesStatisticBarchartWidget
                    categories={nodesStats?.categories}
                    isLoading={isLoading}
                    series={nodesStats?.series}
                />
            </Stack>
        </Page>
    )
}
