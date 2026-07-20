import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Group, NativeSelect, Stack } from '@mantine/core'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { nprogress } from '@mantine/nprogress'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbChartArcs } from 'react-icons/tb'
import { TbCalendar, TbRefresh, TbUsers } from 'react-icons/tb'

import { NodeUsersSparklineCardWidget } from '@shared/_modals/nodes/node-usage-stats/usage-sparkline-card'
import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetStatsNodesUsersUsage, useResolveUser } from '@shared/api/hooks'
import { CompoundDrawerShared } from '@shared/ui/compound-drawer/compound-drawer.shared'
import { ITopLeaderboardItem, TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { getDefaultDateRange } from '@shared/utils/time-utils'

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

export const NodesUsageStatsModal = NiceModal.create((props: IProps) => {
    const { nodeUuids } = props
    const { t, i18n } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal
    })

    const defaultRange = getDefaultDateRange()

    const [topUsersLimit, setTopUsersLimit] = useState<number>(DEFAULT_TOP_USERS_LIMIT)
    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        defaultRange.start,
        defaultRange.end
    ])
    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(defaultRange)

    const { mutateAsync: resolveUser } = useResolveUser()
    const {
        data: stats,
        isLoading,
        isFetching,
        refetch
    } = useGetStatsNodesUsersUsage({
        query: {
            start: queryRange.start,
            end: queryRange.end,
            topUsersLimit
        },
        body: { nodesUuids: nodeUuids }
    })

    const handleViewUser = async (user: ITopLeaderboardItem) => {
        nprogress.start()
        try {
            const result = await resolveUser({
                variables: {
                    username: user.name
                }
            })

            if (result.id) {
                showModal('users_viewUserModal', {
                    userId: result.id
                })
            }
        } finally {
            nprogress.complete()
        }
    }

    const handleDateRangeChange = (value: DatesRangeValue<string>) => {
        if (value[0] === null && value[1] === null) {
            setRawRange([defaultRange.start, defaultRange.end])
            setQueryRange(defaultRange)
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
        <CompoundDrawerShared
            drawerProps={{
                ...modalProps,
                padding: 'lg',
                position: 'right',
                size: '600px'
            }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbChartArcs}
                    iconVariant="soft"
                    title={t('common.usage-stats')}
                />
            }
            buttons={
                <ActionIcon
                    onClick={() => refetch()}
                    size="lg"
                    variant="soft"
                    loading={isFetching || isLoading}
                >
                    <TbRefresh size="20px" />
                </ActionIcon>
            }
        >
            <Stack gap="md">
                <Group gap="xs" justify="space-between" wrap="nowrap">
                    <NativeSelect
                        data={TOP_USERS_LIMIT_OPTIONS}
                        leftSection={<TbUsers size="20px" />}
                        onChange={(value) => setTopUsersLimit(Number(value.target.value))}
                        size="md"
                        value={String(topUsersLimit)}
                        miw="fit-content"
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
                        miw={0}
                        styles={{
                            calendarHeaderLevel: { justifyContent: 'flex-end' },
                            presetsList: { justifyContent: 'center' },
                            input: {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }
                        }}
                        type="range"
                        value={rawRange}
                        valueFormat="DD MMM, YYYY"
                    />
                </Group>

                <NodeUsersSparklineCardWidget
                    isLoading={isLoading}
                    sparklineData={stats?.sparklineData}
                />

                <TopLeaderboardCardShared
                    emptyText={t('node-users-usage-drawer.widget.no-data-available')}
                    isLoading={isLoading}
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
        </CompoundDrawerShared>
    )
})
