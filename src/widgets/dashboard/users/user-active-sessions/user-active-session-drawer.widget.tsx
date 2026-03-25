import {
    TbAlertTriangle,
    TbBrandDocker,
    TbClock,
    TbClockCheck,
    TbClockExclamation,
    TbClockPause,
    TbExternalLink,
    TbHourglass,
    TbRadar,
    TbRefresh,
    TbServer,
    TbTag,
    TbTrash,
    TbUnlink
} from 'react-icons/tb'
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Center,
    Drawer,
    Group,
    Paper,
    Progress,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { CodeHighlight } from '@mantine/code-highlight'
import { notifications } from '@mantine/notifications'
import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { PiEmptyDuotone } from 'react-icons/pi'

import { useDropConnections, useFetchIps, useFetchIpsResult } from '@shared/api/hooks'
import { formatRelativeDateUtil, formatTimeUtil } from '@shared/utils/time-utils'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LottieGlobeShared } from '@shared/ui/lotties/globe'
import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    onClose: () => void
    opened: boolean
    userUuid: string
}

const DOCKER_SNIPPET = `
    cap_add:
      - NET_ADMIN
`

const HIGHLIGHT_SPAN = <Text c="white" component="span" fw={600} size="sm" />

const getLastSeenIndicator = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return { color: 'var(--mantine-color-teal-6)', Icon: TbClockCheck }
    if (diffMinutes <= 60) return { color: 'var(--mantine-color-yellow-6)', Icon: TbClockPause }
    return { color: 'var(--mantine-color-red-6)', Icon: TbClockExclamation }
}

export const UserActiveSessionDrawerWidget = (props: IProps) => {
    const { userUuid, opened, onClose } = props
    const { t, i18n } = useTranslation()

    const [jobId, setJobId] = useState<null | string>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isFailed, setIsFailed] = useState(false)

    const { mutate: fetchIps, isPending: isFetchingIps } = useFetchIps({
        route: {
            uuid: userUuid
        },
        mutationFns: {
            onSuccess: (data) => {
                setJobId(data.jobId)
            }
        }
    })

    const { mutate: dropConnections } = useDropConnections({
        mutationFns: {
            onSuccess: () => {
                notifications.show({
                    title: t('common.success'),
                    message: t('common.event-sent'),
                    color: 'teal'
                })
            }
        }
    })

    const shouldPoll = opened && !!jobId && !isCompleted && !isFailed

    const { data: userIpsResult } = useFetchIpsResult({
        route: { jobId: jobId ?? '' },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    const [prevResult, setPrevResult] = useState(userIpsResult)

    if (prevResult !== userIpsResult) {
        setPrevResult(userIpsResult)
        if (
            userIpsResult &&
            (userIpsResult.isFailed ||
                (userIpsResult.isCompleted && !userIpsResult.result?.success))
        ) {
            setIsFailed(true)
        }
    }

    useEffect(() => {
        if (!userIpsResult?.isCompleted || isFailed) return undefined
        const timer = setTimeout(() => setIsCompleted(true), 500)
        return () => clearTimeout(timer)
    }, [userIpsResult?.isCompleted, isFailed])

    const ipStats = useMemo(() => {
        const nodes = userIpsResult?.result?.nodes
        if (!nodes) return null

        const now = new Date().getTime()
        let active = 0
        let idle = 0
        let stale = 0

        for (const node of nodes) {
            for (const ip of node.ips) {
                const diffMinutes = (now - new Date(ip.lastSeen).getTime()) / 60_000
                if (diffMinutes <= 5) active++
                else if (diffMinutes <= 60) idle++
                else stale++
            }
        }

        return { active, idle, stale, total: active + idle + stale }
    }, [userIpsResult?.result?.nodes])

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

    const handleGetData = () => {
        fetchIps({})
    }

    const handleClearResults = () => {
        setJobId(null)
        setIsCompleted(false)
    }

    const handleClose = () => {
        handleClearResults()
        onClose()
        setIsFailed(false)
    }

    const isIdle = !jobId && !isCompleted && !isFetchingIps
    const isInProgress = isFetchingIps || (!!jobId && !isCompleted && !isFailed)

    const renderSummaryCard = (totalIps: number, distinctIps: number) => (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbRadar}
                        iconVariant="soft"
                        subtitle={t('active-sessions-drawer.widget.active-ips-across-nodes')}
                        title={formatInt(totalIps)}
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

                        <Tooltip
                            label={t(
                                'user-active-session-drawer.widget.drop-all-user-connections-all-nodes'
                            )}
                        >
                            <ActionIcon
                                color="orange"
                                onClick={() =>
                                    dropConnections({
                                        variables: {
                                            dropBy: {
                                                by: 'userUuids',
                                                userUuids: [userUuid]
                                            },
                                            targetNodes: {
                                                target: 'allNodes'
                                            }
                                        }
                                    })
                                }
                                size="lg"
                                variant="soft"
                            >
                                <TbUnlink size={20} />
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

            {distinctIps > 0 && (
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="yellow"
                        IconComponent={TbAlertTriangle}
                        iconVariant="soft"
                        subtitle={t('active-sessions-drawer.widget.distinct-ips')}
                        title={formatInt(distinctIps)}
                    />
                </SectionCard.Section>
            )}
        </SectionCard.Root>
    )

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

            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="teal" size="md" variant="soft">
                    <TbTag size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={{ highlight: HIGHLIGHT_SPAN }}
                        i18nKey="active-sessions-drawer.widget.warning-version"
                        values={{ version: '2.7.0' }}
                    />
                </Text>
            </Group>

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
                <ThemeIcon color="orange" size="md" variant="soft">
                    <TbHourglass size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                    {t('active-sessions-drawer.widget.warning-patience')}
                </Text>
            </Group>
        </SectionCard.Root>
    )

    const renderProgress = () => {
        const progress = userIpsResult?.progress
        const percent = progress?.percent ?? 0
        const completed = progress?.completed ?? 0
        const total = progress?.total ?? 0

        return (
            <SectionCard.Root gap="md">
                <SectionCard.Section>
                    <Stack align="center" gap="md" py="xl">
                        <div style={{ height: 120, display: 'flex', alignItems: 'center' }}>
                            <LottieGlobeShared />
                        </div>

                        <Stack align="center" gap={4}>
                            <Text c="white" fw={600} size="md">
                                {t('active-sessions-drawer.widget.fetching')}
                            </Text>
                            <Text c="dimmed" size="sm">
                                {t('active-sessions-drawer.widget.progress', { completed, total })}
                            </Text>
                        </Stack>

                        <Box mt={6} w="100%">
                            <Progress.Root
                                radius="md"
                                size={18}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <Progress.Section
                                    animated
                                    color="teal"
                                    style={{
                                        transition: 'width 400ms ease'
                                    }}
                                    value={percent}
                                />
                            </Progress.Root>
                            <Group justify="center" mt={6}>
                                <Text c="white" ff="monospace" fw={700} size="sm">
                                    {Math.round(percent)}%
                                </Text>
                            </Group>
                        </Box>
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    const renderFailed = () => (
        <Stack gap="md">
            {renderSummaryCard(0, 0)}

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
                                size="md"
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

    const renderResults = () => {
        const nodes = userIpsResult?.result?.nodes

        const allIps = nodes?.flatMap((node) => node.ips.map((item) => item.ip)) ?? []
        const totalIps = allIps.length
        const distinctIps = new Set(allIps).size

        return (
            <Stack gap="md">
                {renderSummaryCard(totalIps, distinctIps)}

                {renderIpStatsCard()}

                {nodes && nodes.length === 0 && (
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

                {nodes &&
                    nodes.length > 0 &&
                    nodes.map((node) => (
                        <SectionCard.Root gap="sm" key={node.nodeUuid}>
                            <SectionCard.Section>
                                <Group gap="xs" justify="space-between">
                                    <BaseOverlayHeader
                                        countryCode={node.countryCode}
                                        iconColor="blue"
                                        IconComponent={TbServer}
                                        iconVariant="soft"
                                        title={node.nodeName}
                                    />
                                    <Group gap="xs">
                                        <Badge color="teal" size="lg" variant="default">
                                            {node.ips.length}
                                        </Badge>
                                        <Tooltip
                                            label={t(
                                                'user-active-session-drawer.widget.drop-all-user-connections-this-node'
                                            )}
                                        >
                                            <ActionIcon
                                                color="orange"
                                                onClick={() =>
                                                    dropConnections({
                                                        variables: {
                                                            dropBy: {
                                                                by: 'userUuids',
                                                                userUuids: [userUuid]
                                                            },
                                                            targetNodes: {
                                                                target: 'specificNodes',
                                                                nodeUuids: [node.nodeUuid]
                                                            }
                                                        }
                                                    })
                                                }
                                                size="lg"
                                                variant="soft"
                                            >
                                                <TbUnlink size={20} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Group>
                            </SectionCard.Section>

                            {node.ips.length === 0 && (
                                <Stack align="center" gap="xs">
                                    <PiEmptyDuotone
                                        color="var(--mantine-color-gray-5)"
                                        size="3rem"
                                    />
                                    <Text c="dimmed" size="sm">
                                        {t('common.nothing-found')}
                                    </Text>
                                </Stack>
                            )}

                            {node.ips.length > 0 &&
                                node.ips.map((item) => (
                                    <Group align="center" gap="xs" key={item.ip} wrap="nowrap">
                                        <ActionIcon
                                            color="cyan"
                                            component="a"
                                            href={`https://ipinfo.io/${item.ip}`}
                                            rel="noopener noreferrer"
                                            size="input-sm"
                                            target="_blank"
                                            variant="soft"
                                        >
                                            <TbExternalLink size={18} />
                                        </ActionIcon>

                                        <Box style={{ flex: 1 }}>
                                            <CopyableFieldShared
                                                leftSection={
                                                    <Tooltip
                                                        color="dark.6"
                                                        label={
                                                            <Stack gap={2} p={4}>
                                                                <Text c="white" fw={600} size="xs">
                                                                    {formatRelativeDateUtil(
                                                                        item.lastSeen,
                                                                        t,
                                                                        i18n.language
                                                                    )}
                                                                </Text>
                                                                <Text
                                                                    c="dimmed"
                                                                    ff="monospace"
                                                                    size="xs"
                                                                >
                                                                    {formatTimeUtil({
                                                                        time: item.lastSeen,
                                                                        template:
                                                                            'TIME_FIRST_DATETIME',
                                                                        language: i18n.language
                                                                    })}
                                                                </Text>
                                                            </Stack>
                                                        }
                                                        radius="md"
                                                        styles={{
                                                            tooltip: {
                                                                border: '1px solid var(--mantine-color-dark-4)',
                                                                backdropFilter: 'blur(8px)'
                                                            }
                                                        }}
                                                    >
                                                        {(() => {
                                                            const { color, Icon } =
                                                                getLastSeenIndicator(item.lastSeen)
                                                            return (
                                                                <Box
                                                                    style={{
                                                                        display: 'flex',
                                                                        cursor: 'help',
                                                                        color
                                                                    }}
                                                                >
                                                                    <Icon size={16} />
                                                                </Box>
                                                            )
                                                        })()}
                                                    </Tooltip>
                                                }
                                                size="sm"
                                                value={item.ip}
                                            />
                                        </Box>
                                        <Tooltip
                                            label={t(
                                                'user-active-session-drawer.widget.drop-this-connection-on-this-node'
                                            )}
                                        >
                                            <ActionIcon
                                                color="orange"
                                                onClick={() =>
                                                    dropConnections({
                                                        variables: {
                                                            dropBy: {
                                                                by: 'ipAddresses',
                                                                ipAddresses: [item.ip]
                                                            },
                                                            targetNodes: {
                                                                target: 'specificNodes',
                                                                nodeUuids: [node.nodeUuid]
                                                            }
                                                        }
                                                    })
                                                }
                                                size="lg"
                                                variant="soft"
                                            >
                                                <TbUnlink size={20} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                ))}
                        </SectionCard.Root>
                    ))}
            </Stack>
        )
    }

    const renderContent = () => (
        <Stack gap="md">
            {isIdle && (
                <>
                    {renderWarning()}
                    <Button
                        color="teal"
                        fullWidth
                        leftSection={<TbRadar size={20} />}
                        loading={isFetchingIps}
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
                {(styles) => <Box style={{ ...styles }}>{renderContent()}</Box>}
            </Transition>
        </Drawer>
    )
}
