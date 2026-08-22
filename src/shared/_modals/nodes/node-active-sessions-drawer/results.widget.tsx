import { Stack, Tabs } from '@mantine/core'
import { useMemo, useState } from 'react'
import { TbRadar, TbSortAscending, TbSortDescending } from 'react-icons/tb'

import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

import { IpStatsWidget } from './ip-stats.widget'
import { SessionsListWidget } from './sessions-list.widget'
import { SummaryCardWidget } from './summary-card.widget'
import { ActiveSessionUser } from './use-node-active-sessions'

type SortMode = 'default' | 'ips-asc' | 'ips-desc'

interface IProps {
    onRefresh: () => void
    users: ActiveSessionUser[]
}

export const ResultsWidget = ({ onRefresh, users }: IProps) => {
    const [sortMode, setSortMode] = useState<SortMode>('default')

    const sortedUsers = useMemo(() => {
        switch (sortMode) {
            case 'ips-asc':
                return [...users].sort((a, b) => a.ips.length - b.ips.length)
            case 'ips-desc':
                return [...users].sort((a, b) => b.ips.length - a.ips.length)
            default:
                return users
        }
    }, [users, sortMode])

    const hasUsers = sortedUsers.length > 0

    return (
        <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
            <SummaryCardWidget
                onRefresh={onRefresh}
                totalUsers={sortedUsers.length}
                ipStats={hasUsers && <IpStatsWidget users={sortedUsers} />}
            />

            {hasUsers && (
                <Tabs
                    onChange={(value) => setSortMode((value as SortMode) ?? 'default')}
                    value={sortMode}
                >
                    <Tabs.List grow>
                        <Tabs.Tab leftSection={<TbSortAscending size={16} />} value="default">
                            Default
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<TbSortAscending size={16} />} value="ips-asc">
                            IPs
                        </Tabs.Tab>
                        <Tabs.Tab leftSection={<TbSortDescending size={16} />} value="ips-desc">
                            IPs
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            )}

            {!hasUsers && <EmptyPageLayout icon={<TbRadar size="3rem" />} />}

            {hasUsers && <SessionsListWidget users={sortedUsers} />}
        </Stack>
    )
}
