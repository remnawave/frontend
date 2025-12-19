import { ActionIcon, Drawer, Group, SimpleGrid, Stack } from '@mantine/core'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { TbCalendar, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { UserUsageSparklineCardWidget } from '@widgets/dashboard/users/user-usage-statistic/usage-sparkline-card'
import { UserUsageBarchartWidget } from '@widgets/dashboard/users/user-usage-statistic/usage-barchart'
import { TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { useGetStatsUserUsage } from '@shared/api/hooks'

import { IProps } from './interfaces'

const DEFAULT_DATE_RANGE = {
    start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
}

export const UserUsageModalWidget = (props: IProps) => {
    const { userUuid, opened, onClose } = props
    const { t } = useTranslation()

    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        DEFAULT_DATE_RANGE.start,
        DEFAULT_DATE_RANGE.end
    ])

    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(DEFAULT_DATE_RANGE)

    useEffect(() => {
        if (!opened) {
            setRawRange([DEFAULT_DATE_RANGE.start, DEFAULT_DATE_RANGE.end])
            setQueryRange(DEFAULT_DATE_RANGE)
        }
    }, [opened])

    const handleDateRangeChange = (value: DatesRangeValue<string>) => {
        if (value[0] === null && value[1] === null) {
            setRawRange([DEFAULT_DATE_RANGE.start, DEFAULT_DATE_RANGE.end])
            setQueryRange(DEFAULT_DATE_RANGE)
            return
        }

        setRawRange(value)
        if (!value[0] || !value[1]) return

        const startDate = value[0]
        const endDate = value[1]

        if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) return

        const startISO = dayjs(startDate).format('YYYY-MM-DD')
        const endISO = dayjs(endDate).format('YYYY-MM-DD')

        setQueryRange({ start: startISO, end: endISO })
    }

    const {
        data: userUsageStats,
        isLoading,
        refetch,
        isRefetching
    } = useGetStatsUserUsage({
        route: {
            uuid: userUuid
        },
        query: {
            start: queryRange.start,
            end: queryRange.end
        },
        rQueryParams: {
            enabled: opened && Boolean(queryRange.start && queryRange.end)
        }
    })

    return (
        <Drawer
            keepMounted={false}
            onClose={onClose}
            opened={opened}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="900px"
            title={t('user-usage-modal.widget.traffic-statistics')}
        >
            <Stack gap="md">
                <Group justify="flex-end" wrap="nowrap">
                    <DatePickerInput
                        dropdownType="modal"
                        headerControlsOrder={['previous', 'next', 'level']}
                        leftSection={<TbCalendar size="20px" />}
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
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <UserUsageSparklineCardWidget
                        isLoading={isLoading}
                        sparklineData={userUsageStats?.sparklineData}
                    />

                    <TopLeaderboardCardShared
                        emptyText={t('user-usage-modal.widget.no-data-available')}
                        isLoading={isLoading}
                        items={userUsageStats?.topNodes?.map((node) => ({
                            color: node.color,
                            countryCode: node.countryCode,
                            name: node.name,
                            total: node.total
                        }))}
                        renderCountryFlag={(item) => <CountryFlag countryCode={item.countryCode} />}
                    />
                </SimpleGrid>

                <UserUsageBarchartWidget
                    categories={userUsageStats?.categories}
                    isLoading={isLoading}
                    series={userUsageStats?.series}
                />
            </Stack>
        </Drawer>
    )
}
