import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { colorFromId } from '@kastov/uuid-color'
import { ActionIcon, Group, Stack } from '@mantine/core'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import { useDebouncedState } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCalendar, TbChartArcs, TbChartLine, TbQuestionMark, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetInternalSquadUsageInfinite } from '@shared/api/hooks'
import { CompoundDrawerShared } from '@shared/ui/compound-drawer/compound-drawer.shared'
import { TrafficLimitInput } from '@shared/ui/forms/traffic-limit-input/traffic-limit-input'
import { ITopLeaderboardItem, TopLeaderboardCardShared } from '@shared/ui/leaderboard-item-card'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { getDefaultDateRange } from '@shared/utils/time-utils'

import { InternalSquadsUsageInfoModalContent } from './internal-squads-usage-info.modal'

const DEFAULT_MIN_USAGE_THRESHOLD = 107_374_182_400

interface IProps {
    squadUuid: string
}

export const InternalSquadsUsageDrawer = NiceModal.create((props: IProps) => {
    const { squadUuid } = props

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const defaultRange = getDefaultDateRange()

    const { t, i18n } = useTranslation()

    const [rawRange, setRawRange] = useState<[null | string, null | string]>([
        defaultRange.start,
        defaultRange.end
    ])
    const [minUsageThreshold, setMinUsageThreshold] = useDebouncedState<number>(
        DEFAULT_MIN_USAGE_THRESHOLD,
        500
    )

    const [queryRange, setQueryRange] = useState<{ end: string; start: string }>(defaultRange)

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

        const startISO = dayjs.utc(startDate).format('YYYY-MM-DD')
        const endISO = dayjs.utc(endDate).format('YYYY-MM-DD')

        setQueryRange({ start: startISO, end: endISO })
    }

    const {
        data: internalSquadUsage,
        isLoading,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetInternalSquadUsageInfinite({
        route: {
            uuid: squadUuid
        },
        query: {
            start: queryRange.start,
            end: queryRange.end,
            limit: 250,
            minTotalBytes: minUsageThreshold
        },
        rQueryParams: {
            enabled: Boolean(queryRange.start && queryRange.end)
        }
    })

    const usageUsers = internalSquadUsage?.pages.flatMap((page) => page.users) ?? []

    const handleViewUser = async (user: ITopLeaderboardItem) => {
        showModal('users_viewUserModal', { userId: Number(user.name) })
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
                <Group gap="xs" wrap="nowrap">
                    <ActionIcon
                        color="lime"
                        onClick={() =>
                            modals.open({
                                centered: true,
                                size: 'xl',
                                title: (
                                    <BaseOverlayHeader
                                        iconColor="yellow"
                                        IconComponent={TbQuestionMark}
                                        iconVariant="soft"
                                        title={t('internal-squads-usage-drawer.info.title')}
                                    />
                                ),
                                children: <InternalSquadsUsageInfoModalContent />
                            })
                        }
                        size="lg"
                        variant="soft"
                    >
                        <TbQuestionMark size="20px" />
                    </ActionIcon>

                    <ActionIcon
                        loading={isRefetching || isLoading}
                        onClick={() => refetch()}
                        size="lg"
                        variant="soft"
                    >
                        <TbRefresh size="20px" />
                    </ActionIcon>
                </Group>
            }
        >
            <Stack gap="md">
                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <TrafficLimitInput
                        hideControls
                        size="md"
                        leftSection={<TbChartLine size={16} />}
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                        onChange={(value) => setMinUsageThreshold(value ?? 0)}
                        value={minUsageThreshold}
                    />
                </Group>

                <Group gap="xs" justify="flex-end" wrap="nowrap">
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
                        w="100%"
                        styles={{
                            calendarHeaderLevel: {
                                justifyContent: 'flex-end'
                            },
                            presetsList: {
                                justifyContent: 'center'
                            },
                            input: {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'center'
                            }
                        }}
                        type="range"
                        value={rawRange}
                        valueFormat="DD MMM, YYYY"
                    />
                </Group>

                <TopLeaderboardCardShared
                    emptyText={t('node-users-usage-drawer.widget.no-data-available')}
                    isFetchingMore={isFetchingNextPage}
                    isLoading={isLoading}
                    items={usageUsers.map((user) => ({
                        color: colorFromId(user.id),
                        name: user.id.toString(),
                        total: user.totalBytes
                    }))}
                    maxHeight={500}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage()
                        }
                    }}
                    onItemClick={(user) => {
                        handleViewUser(user)
                    }}
                    ordered={false}
                    skeletonCount={11}
                    virtualized
                />
            </Stack>
        </CompoundDrawerShared>
    )
})
