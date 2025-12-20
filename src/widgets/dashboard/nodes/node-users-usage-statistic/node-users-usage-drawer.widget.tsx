import { TbCalendar, TbChartArcs, TbRefresh, TbUsers } from 'react-icons/tb'
import { ActionIcon, Drawer, Group, Select, Stack } from '@mantine/core'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import dayjs from 'dayjs'

import { MODALS, useModalCloseActions, useModalState } from '@entities/dashboard/modal-store'
import { TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetStatsNodeUsersUsage } from '@shared/api/hooks'

import { NodeUsersSparklineCardWidget } from './usage-sparkline-card'

const TOP_USERS_LIMIT_OPTIONS = [
    { value: '5', label: 'Top 5' },
    { value: '10', label: 'Top 10' },
    { value: '30', label: 'Top 30' },
    { value: '50', label: 'Top 50' },
    { value: '100', label: 'Top 100' },
    { value: '500', label: 'Top 500' },
    { value: '1000', label: 'Top 1000' },
    { value: '2000', label: 'Top 2000' }
]

const DEFAULT_TOP_USERS_LIMIT = 100

const DEFAULT_DATE_RANGE = {
    start: dayjs.utc().subtract(6, 'day').format('YYYY-MM-DD'),
    end: dayjs.utc().format('YYYY-MM-DD')
}

export const NodeUsersUsageDrawer = () => {
    const { isOpen, internalState: nodeUuid } = useModalState(MODALS.SHOW_NODE_USERS_USAGE_DRAWER)
    const [handleClose, clearInternalState] = useModalCloseActions(
        MODALS.SHOW_NODE_USERS_USAGE_DRAWER
    )

    const { t } = useTranslation()

    const [topUsersLimit, setTopUsersLimit] = useState<number>(DEFAULT_TOP_USERS_LIMIT)
    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        DEFAULT_DATE_RANGE.start,
        DEFAULT_DATE_RANGE.end
    ])

    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(DEFAULT_DATE_RANGE)

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

        const startISO = dayjs.utc(startDate).format('YYYY-MM-DD')
        const endISO = dayjs.utc(endDate).format('YYYY-MM-DD')

        setQueryRange({ start: startISO, end: endISO })
    }

    const {
        data: nodeUsersStats,
        isLoading,
        refetch,
        isRefetching
    } = useGetStatsNodeUsersUsage({
        route: {
            uuid: nodeUuid?.nodeUuid ?? ''
        },
        query: {
            start: queryRange.start,
            end: queryRange.end,
            topUsersLimit
        },
        rQueryParams: {
            enabled: isOpen && Boolean(nodeUuid?.nodeUuid && queryRange.start && queryRange.end)
        }
    })

    return (
        <Drawer
            keepMounted={false}
            onClose={handleClose}
            onExitTransitionEnd={() => {
                setRawRange([DEFAULT_DATE_RANGE.start, DEFAULT_DATE_RANGE.end])
                setQueryRange(DEFAULT_DATE_RANGE)
                setTopUsersLimit(DEFAULT_TOP_USERS_LIMIT)
                clearInternalState()
            }}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="600px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbChartArcs}
                    iconVariant="gradient-teal"
                    title={t('node-users-usage-drawer.widget.user-traffic-statistics')}
                />
            }
        >
            <Stack gap="md">
                <Group justify="space-between">
                    <Select
                        allowDeselect={false}
                        data={TOP_USERS_LIMIT_OPTIONS}
                        leftSection={<TbUsers size="20px" />}
                        onChange={(value) => setTopUsersLimit(Number(value))}
                        size="md"
                        value={String(topUsersLimit)}
                        w={200}
                    />

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

                <NodeUsersSparklineCardWidget
                    isLoading={isLoading}
                    sparklineData={nodeUsersStats?.sparklineData}
                />

                <TopLeaderboardCardShared
                    emptyText={t('node-users-usage-drawer.widget.no-data-available')}
                    isLoading={isLoading}
                    items={nodeUsersStats?.topUsers?.map((user) => ({
                        color: user.color,
                        name: user.username,
                        total: user.total
                    }))}
                    maxHeight={500}
                    skeletonCount={25}
                />
            </Stack>
        </Drawer>
    )
}
