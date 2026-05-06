import { createSearchParams, useNavigate } from 'react-router-dom'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { ActionIcon, Group, Select, Stack } from '@mantine/core'
import { TbCalendar, TbRefresh, TbUsers } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import dayjs from 'dayjs'

import { NodeUsersSparklineCardWidget } from '@widgets/dashboard/nodes/node-users-usage-statistic'
import { ITopLeaderboardItem, TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { useGetStatsNodesUsersUsage, useResolveUser } from '@shared/api/hooks'
import { openOrNavigate } from '@shared/utils/open-or-navigate'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { ROUTES } from '@shared/constants/routes'

interface IProps {
    nodeUuids: string[]
}

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

export const NodesUsersUsageStatisticsContent = (props: IProps) => {
    const { nodeUuids } = props
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const [topUsersLimit, setTopUsersLimit] = useState<number>(DEFAULT_TOP_USERS_LIMIT)
    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        DEFAULT_DATE_RANGE.start,
        DEFAULT_DATE_RANGE.end
    ])
    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(DEFAULT_DATE_RANGE)

    const { mutateAsync: resolveUser } = useResolveUser()
    const {
        data: stats,
        isLoading: isStatsLoading,
        isFetching: isStatsFetching,
        refetch: refetchStats
    } = useGetStatsNodesUsersUsage({
        query: {
            start: queryRange.start,
            end: queryRange.end,
            topUsersLimit
        },
        body: { nodesUuids: nodeUuids },
        rQueryParams: {
            enabled: nodeUuids.length > 0
        }
    })

    const handleViewUser = async (user: ITopLeaderboardItem) => {
        const result = await resolveUser({
            variables: {
                username: user.name
            }
        })

        if (result.uuid) {
            const searchParams = createSearchParams({
                [SEARCH_PARAMS.USER]: String(result.uuid)
            })

            const url = `${ROUTES.DASHBOARD.MANAGEMENT.USERS}?${searchParams.toString()}`
            openOrNavigate(url, navigate)
        }
    }

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

        setQueryRange({
            start: dayjs.utc(startDate).format('YYYY-MM-DD'),
            end: dayjs.utc(endDate).format('YYYY-MM-DD')
        })
    }

    return (
        <Stack gap="md">
            <Group gap="xs" justify="flex-end" wrap="nowrap">
                <Select
                    allowDeselect={false}
                    data={TOP_USERS_LIMIT_OPTIONS}
                    leftSection={<TbUsers size="20px" />}
                    onChange={(value) => setTopUsersLimit(Number(value))}
                    size="md"
                    value={String(topUsersLimit)}
                    w={160}
                />

                <DatePickerInput
                    allowSingleDateInRange
                    dropdownType="modal"
                    headerControlsOrder={['previous', 'next', 'level']}
                    leftSection={<TbCalendar size="20px" />}
                    locale={i18n.language}
                    maxDate={new Date()}
                    onChange={handleDateRangeChange}
                    presets={[
                        {
                            label: t('statistic-nodes.component.current-month'),
                            value: [
                                dayjs().startOf('month').format('YYYY-MM-DD'),
                                dayjs().format('YYYY-MM-DD')
                            ]
                        },
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
                        calendarHeaderLevel: { justifyContent: 'flex-end' },
                        presetsList: { justifyContent: 'center' }
                    }}
                    type="range"
                    value={rawRange}
                    valueFormat="DD MMM, YYYY"
                />

                <ActionIcon
                    disabled={nodeUuids.length === 0}
                    loading={isStatsFetching}
                    onClick={() => refetchStats()}
                    size="input-md"
                    variant="soft"
                >
                    <TbRefresh size="24px" />
                </ActionIcon>
            </Group>

            <NodeUsersSparklineCardWidget
                isLoading={isStatsLoading}
                sparklineData={stats?.sparklineData}
            />

            <TopLeaderboardCardShared
                emptyText={t('node-users-usage-drawer.widget.no-data-available')}
                isLoading={isStatsLoading}
                items={stats?.topUsers?.map((user) => ({
                    color: user.color,
                    name: user.username,
                    total: user.total
                }))}
                maxHeight={500}
                onItemClick={(user) => {
                    handleViewUser(user)
                }}
                skeletonCount={11}
            />
        </Stack>
    )
}
