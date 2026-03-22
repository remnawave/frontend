import {
    ActionIcon,
    Affix,
    Badge,
    Button,
    Center,
    Group,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import {
    TbAlertTriangle,
    TbArrowUp,
    TbFingerprint,
    TbNetwork,
    TbRadar2,
    TbRefresh,
    TbSearch,
    TbServer,
    TbTrash,
    TbUser,
    TbX
} from 'react-icons/tb'
import { useDebouncedValue, useWindowScroll } from '@mantine/hooks'
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso'
import { useMemo, useRef, useState } from 'react'
import { PiEmptyDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { MetricCardShared } from '@shared/ui/metrics/metric-card'
import { PageHeaderShared } from '@shared/ui/page-header'
import { SectionCard } from '@shared/ui/section-card'
import { useGetNodes } from '@shared/api/hooks'

import { SessionsExplorerVirtualizedGridComponents } from './grid-components'
import { SessionsExplorerProgress } from './sessions-explorer-progress'
import { SessionsExplorerIdle } from './sessions-explorer-idle'
import { SessionsExplorerCard } from './sessions-explorer-card'
import { useSessionsExplorer } from './use-sessions-explorer'

export function SessionsExplorerWidget() {
    const { t } = useTranslation()

    const { data: nodes } = useGetNodes()
    const { phase, progress, aggregatedUsers, stats, onlineNodes, start, reset } =
        useSessionsExplorer(nodes)

    const [scroll] = useWindowScroll()
    const virtuosoRef = useRef<VirtuosoGridHandle>(null)

    const [ipSearch, setIpSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(ipSearch, 200)

    const filteredUsers = useMemo(() => {
        const q = debouncedSearch.trim()
        if (!q) return aggregatedUsers
        return aggregatedUsers.filter((u) =>
            u.nodes.some((n) => n.ips.some((ip) => ip.ip.includes(q)))
        )
    }, [aggregatedUsers, debouncedSearch])

    const isSearchActive = debouncedSearch.trim().length > 0

    const ipThresholds = useMemo(() => {
        if (aggregatedUsers.length === 0) return { high: 0, mid: 0 }
        const max = aggregatedUsers[0].uniqueIps
        const min = aggregatedUsers[aggregatedUsers.length - 1].uniqueIps
        const range = max - min
        if (range === 0) return { high: max + 1, mid: max + 1 }
        return {
            high: min + range * 0.66,
            mid: min + range * 0.33
        }
    }, [aggregatedUsers])

    const itemContent = (index: number) => {
        const item = filteredUsers[index]
        if (!item) return null

        return (
            <div style={{ width: '100%' }}>
                <SessionsExplorerCard
                    highThreshold={ipThresholds.high}
                    ipSearchQuery={debouncedSearch.trim() || undefined}
                    midThreshold={ipThresholds.mid}
                    user={item}
                />
            </div>
        )
    }

    const handleStart = () => {
        setIpSearch('')
        start()
    }

    const handleReset = () => {
        setIpSearch('')
        reset()
    }

    const renderFailedState = () => (
        <SectionCard.Root gap="sm">
            <SectionCard.Section>
                <Center h="230">
                    <Stack align="center" gap="xs">
                        <ThemeIcon color="red" radius="md" size="xl" variant="soft">
                            <TbAlertTriangle size={24} />
                        </ThemeIcon>
                        <Text c="dimmed" size="md">
                            {t('sessions-explorer.widget.all-nodes-failed-to-return-session-data')}
                        </Text>
                        <Button
                            color="teal"
                            leftSection={<TbRefresh size={20} />}
                            onClick={handleReset}
                            size="sm"
                            variant="soft"
                        >
                            {t('active-sessions-drawer.widget.try-again')}
                        </Button>
                    </Stack>
                </Center>
            </SectionCard.Section>
        </SectionCard.Root>
    )

    const renderCompletedState = () => (
        <Stack gap="md">
            {stats && (
                <SimpleGrid cols={{ xs: 2, sm: 2, md: 4 }} spacing="xs">
                    <MetricCardShared
                        iconColor="blue"
                        IconComponent={TbNetwork}
                        iconVariant="soft"
                        title={t('sessions-explorer.widget.total-ips')}
                        value={stats.totalIps}
                    />
                    <MetricCardShared
                        iconColor="teal"
                        IconComponent={TbFingerprint}
                        iconVariant="soft"
                        title={t('sessions-explorer.widget.unique-ips')}
                        value={stats.uniqueIps}
                    />
                    <MetricCardShared
                        iconColor="indigo"
                        IconComponent={TbServer}
                        iconVariant="soft"
                        title={t('sessions-explorer.widget.nodes-explored')}
                        value={stats.nodesScanned}
                    />
                    <MetricCardShared
                        iconColor="violet"
                        IconComponent={TbUser}
                        iconVariant="soft"
                        title={t('sessions-explorer.widget.total-users')}
                        value={stats.totalUsers}
                    />
                </SimpleGrid>
            )}

            {aggregatedUsers.length > 0 && (
                <Group gap="xs">
                    <TextInput
                        leftSection={<TbSearch size={16} />}
                        onChange={(e) => setIpSearch(e.currentTarget.value)}
                        placeholder={t('sessions-explorer.widget.search-by-ip')}
                        rightSection={
                            ipSearch ? (
                                <ActionIcon
                                    color="gray"
                                    onClick={() => setIpSearch('')}
                                    size="sm"
                                    variant="subtle"
                                >
                                    <TbX size={14} />
                                </ActionIcon>
                            ) : null
                        }
                        style={{ flex: 1 }}
                        value={ipSearch}
                    />
                    {isSearchActive && (
                        <Badge color="teal" size="xl" variant="soft">
                            {filteredUsers.length}
                        </Badge>
                    )}
                </Group>
            )}

            {aggregatedUsers.length === 0 && (
                <SectionCard.Root gap="sm">
                    <SectionCard.Section>
                        <Center h="230">
                            <Stack align="center" gap="xs">
                                <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                                <Text c="dimmed" size="sm">
                                    {t(
                                        'sessions-explorer.widget.no-active-sessions-found-on-any-node'
                                    )}
                                </Text>
                            </Stack>
                        </Center>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}

            {isSearchActive && filteredUsers.length === 0 && (
                <SectionCard.Root gap="sm">
                    <SectionCard.Section>
                        <Center h="160">
                            <Stack align="center" gap="xs">
                                <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="2rem" />
                                <Text c="dimmed" size="sm">
                                    {t('sessions-explorer.widget.no-results-for-ip', {
                                        ip: debouncedSearch.trim()
                                    })}
                                </Text>
                            </Stack>
                        </Center>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}

            {filteredUsers.length > 0 && (
                <VirtuosoGrid
                    components={SessionsExplorerVirtualizedGridComponents}
                    itemContent={itemContent}
                    overscan={{
                        main: 4,
                        reverse: 4
                    }}
                    ref={virtuosoRef}
                    totalCount={filteredUsers.length}
                    useWindowScroll={true}
                />
            )}
        </Stack>
    )

    return (
        <>
            <PageHeaderShared
                actions={
                    <Group>
                        {phase === 'completed' && (
                            <>
                                <Tooltip label={t('sessions-explorer.widget.restart-scan')}>
                                    <ActionIcon
                                        color="teal"
                                        onClick={handleStart}
                                        size="input-md"
                                        variant="soft"
                                    >
                                        <TbRefresh size={20} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={t('sessions-explorer.widget.clear-results')}>
                                    <ActionIcon
                                        color="red"
                                        onClick={handleReset}
                                        size="input-md"
                                        variant="soft"
                                    >
                                        <TbTrash size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </>
                        )}
                    </Group>
                }
                icon={<TbRadar2 size={24} />}
                title={t('constants.sessions-explorer')}
            />

            {phase === 'idle' && (
                <SessionsExplorerIdle onlineNodesCount={onlineNodes.length} onStart={handleStart} />
            )}
            {phase === 'running' && <SessionsExplorerProgress progress={progress} />}
            {phase === 'failed' && renderFailedState()}
            {phase === 'completed' && renderCompletedState()}

            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition mounted={scroll.y > 300} transition="slide-up">
                    {(transitionStyles) => (
                        <ActionIcon
                            color="teal"
                            onClick={() => {
                                if (virtuosoRef.current) {
                                    virtuosoRef.current.scrollToIndex({
                                        index: 0,
                                        align: 'start',
                                        behavior: 'auto'
                                    })
                                }
                            }}
                            radius="xl"
                            size="xl"
                            style={transitionStyles}
                            variant="filled"
                        >
                            <TbArrowUp size={20} />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    )
}
