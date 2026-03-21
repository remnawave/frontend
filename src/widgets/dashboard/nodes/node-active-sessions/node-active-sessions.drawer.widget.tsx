import {
    TbAlertTriangle,
    TbBrandDocker,
    TbClock,
    TbClockCheck,
    TbClockExclamation,
    TbClockPause,
    TbRadar,
    TbRefresh,
    TbSortAscending,
    TbSortDescending,
    TbTrash,
    TbUser
} from 'react-icons/tb'
import {
    ActionIcon,
    Box,
    Button,
    Center,
    Drawer,
    Group,
    Paper,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CodeHighlight } from '@mantine/code-highlight'
import { Trans, useTranslation } from 'react-i18next'
import { PiEmptyDuotone } from 'react-icons/pi'
import { Virtuoso } from 'react-virtuoso'
import clsx from 'clsx'

import { useFetchUsersIps, useFetchUsersIpsResult } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LottieGlobeShared } from '@shared/ui/lotties/globe'
import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

import { NodeActiveSessionItem } from './node-active-session.item.widget'
import classes from './node-active-sessions.module.css'

interface IProps {
    nodeUuid: string
    onClose: () => void
    opened: boolean
}

const DOCKER_SNIPPET = `
    cap_add:
      - NET_ADMIN
`

const HIGHLIGHT_SPAN = <Text c="white" component="span" fw={600} size="sm" />

export const NodeActiveSessionsDrawerWidget = (props: IProps) => {
    const { nodeUuid, opened, onClose } = props
    const { t } = useTranslation()

    const [jobId, setJobId] = useState<null | string>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isFailed, setIsFailed] = useState(false)
    const [sortMode, setSortMode] = useState<'default' | 'ips-asc' | 'ips-desc'>('default')
    const [isScrolled, setIsScrolled] = useState(false)

    const { mutate: fetchUsersIps, isPending: isFetchingUsersIps } = useFetchUsersIps({
        route: {
            nodeUuid
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            }
        }
    })

    const shouldPoll = opened && !!jobId && !isCompleted && !isFailed

    const { data: usersIpsResult } = useFetchUsersIpsResult({
        route: {
            jobId: jobId ?? ''
        },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    useEffect(() => {
        if (!usersIpsResult) return undefined
        if (
            usersIpsResult.isFailed ||
            (usersIpsResult.isCompleted && !usersIpsResult.result?.success)
        ) {
            setIsFailed(true)
            return undefined
        }
        if (usersIpsResult.isCompleted) {
            const timer = setTimeout(() => setIsCompleted(true), 500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [usersIpsResult])

    const handleGetData = useCallback(() => {
        fetchUsersIps({})
    }, [nodeUuid, fetchUsersIps])

    const handleClearResults = useCallback(() => {
        setJobId(null)
        setIsCompleted(false)
        setIsFailed(false)
    }, [])

    const handleClose = useCallback(() => {
        handleClearResults()
        onClose()
    }, [onClose, handleClearResults])

    const isIdle = !jobId && !isCompleted && !isFetchingUsersIps
    const isInProgress = isFetchingUsersIps || (!!jobId && !isCompleted && !isFailed)

    const renderSummaryCard = (totalUsers: number) => (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbUser}
                        iconVariant="soft"
                        subtitle={t('node-active-sessions.drawer.widget.active-users-on-this-node')}
                        title={formatInt(totalUsers)}
                    />

                    <Group gap="xs">
                        <Tooltip label={t('active-sessions-drawer.widget.clear')}>
                            <ActionIcon
                                color="red"
                                onClick={handleClearResults}
                                size="lg"
                                variant="soft"
                            >
                                <TbTrash size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('common.refresh')}>
                            <ActionIcon
                                color="indigo"
                                onClick={() => {
                                    handleClearResults()
                                    handleGetData()
                                }}
                                size="lg"
                                variant="soft"
                            >
                                <TbRefresh size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </SectionCard.Section>
        </SectionCard.Root>
    )

    const ipStats = useMemo(() => {
        const users = usersIpsResult?.result?.users
        if (!users) return null

        const now = new Date()
        let active = 0
        let idle = 0
        let stale = 0

        for (const user of users) {
            for (const ip of user.ips) {
                const diffMinutes = (now.getTime() - new Date(ip.lastSeen).getTime()) / 60_000
                if (diffMinutes <= 5) active++
                else if (diffMinutes <= 60) idle++
                else stale++
            }
        }

        return { active, idle, stale, total: active + idle + stale }
    }, [usersIpsResult?.result?.users])

    const renderIpStatsCard = () => {
        if (!ipStats) return null

        return (
            <SectionCard.Root gap="sm">
                <SectionCard.Section>
                    <Group gap="xs" grow>
                        <Paper
                            bd="1px solid rgba(45, 212, 191, 0.2)"
                            bg="rgba(45, 212, 191, 0.08)"
                            p="xs"
                            radius="md"
                        >
                            <Group gap={4} justify="center">
                                <TbClockCheck color="var(--mantine-color-teal-6)" size={18} />
                                <Text c="teal.6" fw={700} size="sm">
                                    {formatInt(ipStats.active)}
                                </Text>
                            </Group>
                        </Paper>

                        <Paper
                            bd="1px solid rgba(251, 191, 36, 0.2)"
                            bg="rgba(251, 191, 36, 0.08)"
                            p="xs"
                            radius="md"
                        >
                            <Group gap={4} justify="center">
                                <TbClockPause color="var(--mantine-color-yellow-6)" size={18} />
                                <Text c="yellow.6" fw={700} size="sm">
                                    {formatInt(ipStats.idle)}
                                </Text>
                            </Group>
                        </Paper>

                        <Paper
                            bd="1px solid rgba(239, 68, 68, 0.2)"
                            bg="rgba(239, 68, 68, 0.08)"
                            p="xs"
                            radius="md"
                        >
                            <Group gap={4} justify="center">
                                <TbClockExclamation color="var(--mantine-color-red-6)" size={18} />
                                <Text c="red.6" fw={700} size="sm">
                                    {formatInt(ipStats.stale)}
                                </Text>
                            </Group>
                        </Paper>
                    </Group>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    const renderWarning = () => (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <BaseOverlayHeader
                    iconColor="yellow"
                    IconComponent={TbAlertTriangle}
                    iconVariant="soft"
                    title={t('active-sessions-drawer.widget.requirements')}
                />
            </SectionCard.Section>

            <Stack gap="xs">
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color="violet" size="md" variant="soft">
                        <TbBrandDocker size={16} />
                    </ThemeIcon>
                    <Text c="dimmed" size="sm">
                        <Trans
                            components={{ highlight: HIGHLIGHT_SPAN }}
                            i18nKey="active-sessions-drawer.widget.warning-docker"
                        />
                    </Text>
                </Group>
                <CodeHighlight
                    background="rgba(22, 27, 35)"
                    code={DOCKER_SNIPPET}
                    language="yaml"
                    radius="md"
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--mantine-radius-md)'
                    }}
                />
            </Stack>

            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="cyan" size="md" variant="soft">
                    <TbClock size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={{ highlight: HIGHLIGHT_SPAN }}
                        i18nKey="active-sessions-drawer.widget.warning-activity"
                    />
                </Text>
            </Group>

            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="yellow" size="md" variant="soft">
                    <TbRadar size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={{ highlight: HIGHLIGHT_SPAN }}
                        i18nKey="active-sessions-drawer.widget.warning-n-plus-one"
                    />
                </Text>
            </Group>
        </SectionCard.Root>
    )

    const renderProgress = () => (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <Stack align="center" gap="md" py="xl">
                    <div style={{ height: 120, display: 'flex', alignItems: 'center' }}>
                        <LottieGlobeShared />
                    </div>

                    <Text c="white" fw={600} size="md">
                        {t('active-sessions-drawer.widget.fetching')}
                    </Text>
                </Stack>
            </SectionCard.Section>
        </SectionCard.Root>
    )

    const renderFailed = () => (
        <Stack gap="md">
            {renderSummaryCard(0)}

            <SectionCard.Root gap="sm">
                <SectionCard.Section>
                    <Center h="230">
                        <Stack align="center" gap="xs">
                            <ThemeIcon color="red" radius="md" size="xl" variant="soft">
                                <TbAlertTriangle size={24} />
                            </ThemeIcon>
                            <Text c="dimmed" size="md">
                                {t('active-sessions-drawer.widget.job-failed-description')}
                            </Text>

                            <Button
                                color="teal"
                                leftSection={<TbRefresh size={20} />}
                                onClick={handleClearResults}
                                size="sm"
                                variant="soft"
                            >
                                {t('active-sessions-drawer.widget.try-again')}
                            </Button>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        </Stack>
    )

    const sortedUsers = useMemo(() => {
        const users = usersIpsResult?.result?.users
        if (!users) return undefined

        switch (sortMode) {
            case 'ips-asc':
                return [...users].sort((a, b) => a.ips.length - b.ips.length)
            case 'ips-desc':
                return [...users].sort((a, b) => b.ips.length - a.ips.length)
            default:
                return users
        }
    }, [usersIpsResult?.result?.users, sortMode])

    const renderResults = () => {
        const users = sortedUsers

        return (
            <Stack gap="md" style={{ flex: 1 }}>
                {renderSummaryCard(users?.length ?? 0)}
                {users && users.length > 0 && renderIpStatsCard()}

                {users && users.length > 0 && (
                    <Tabs
                        classNames={{
                            tab: classes.sortTab,
                            tabLabel: classes.sortTabLabel
                        }}
                        onChange={(value) =>
                            setSortMode((value as 'default' | 'ips-asc' | 'ips-desc') ?? 'default')
                        }
                        value={sortMode}
                        variant="unstyled"
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

                {users && users.length === 0 && (
                    <SectionCard.Root gap="sm">
                        <SectionCard.Section>
                            <Center h="230">
                                <Stack align="center" gap="xs">
                                    <PiEmptyDuotone
                                        color="var(--mantine-color-gray-5)"
                                        size="3rem"
                                    />
                                    <Text c="dimmed" size="sm">
                                        {t('active-sessions-drawer.widget.no-active-sessions')}
                                    </Text>
                                </Stack>
                            </Center>
                        </SectionCard.Section>
                    </SectionCard.Root>
                )}

                {users && users.length > 0 && (
                    <Box
                        className={clsx(
                            classes.listContainer,
                            classes.fadeBottom,
                            isScrolled && classes.fadeTop
                        )}
                    >
                        <Virtuoso
                            data={users}
                            itemContent={(_index, user) => {
                                return (
                                    <Box className={classes.itemWrapper}>
                                        <NodeActiveSessionItem user={user} />
                                    </Box>
                                )
                            }}
                            onScroll={(e) => {
                                const target = e.target as HTMLElement
                                setIsScrolled(target.scrollTop > 0)
                            }}
                            style={{
                                height: '100%'
                            }}
                            totalCount={users.length}
                            useWindowScroll={false}
                        />
                    </Box>
                )}
            </Stack>
        )
    }

    const renderContent = () => (
        <Stack gap="md" style={{ flex: 1 }}>
            {isIdle && (
                <>
                    {renderWarning()}
                    <Button
                        color="teal"
                        fullWidth
                        leftSection={<TbRadar size={20} />}
                        loading={isFetchingUsersIps}
                        onClick={handleGetData}
                        size="md"
                        variant="light"
                    >
                        {t('active-sessions-drawer.widget.get-data')}
                    </Button>
                </>
            )}

            {isInProgress && renderProgress()}

            {isFailed && <>{renderFailed()}</>}

            {isCompleted && renderResults()}
        </Stack>
    )

    return (
        <Drawer
            keepMounted={false}
            onClose={handleClose}
            opened={opened}
            position="right"
            size="500px"
            styles={{
                body: {
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbRadar}
                    iconVariant="soft"
                    title={t('active-sessions-drawer.widget.title')}
                />
            }
        >
            <Transition
                duration={300}
                mounted={opened}
                timingFunction="ease-in-out"
                transition="fade"
            >
                {(styles) => (
                    <Box style={{ ...styles, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {renderContent()}
                    </Box>
                )}
            </Transition>
        </Drawer>
    )
}
