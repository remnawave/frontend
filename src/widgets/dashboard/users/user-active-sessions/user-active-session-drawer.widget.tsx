import {
    TbAlertTriangle,
    TbBrandDocker,
    TbClock,
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
    Progress,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { CodeHighlight } from '@mantine/code-highlight'
import { notifications } from '@mantine/notifications'
import { Trans, useTranslation } from 'react-i18next'
import { PiEmptyDuotone } from 'react-icons/pi'

import { useDropConnections, useFetchIps, useFetchIpsResult } from '@shared/api/hooks'
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

export const UserActiveSessionDrawerWidget = (props: IProps) => {
    const { userUuid, opened, onClose } = props
    const { t } = useTranslation()

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
        route: {
            jobId: jobId ?? ''
        },
        rQueryParams: {
            enabled: shouldPoll,
            refetchInterval: shouldPoll ? 1000 : false
        }
    })

    useEffect(() => {
        if (!userIpsResult) return undefined
        if (
            userIpsResult.isFailed ||
            (userIpsResult.isCompleted && !userIpsResult.result?.success)
        ) {
            setIsFailed(true)
            return undefined
        }
        if (userIpsResult.isCompleted) {
            const timer = setTimeout(() => setIsCompleted(true), 500)
            return () => clearTimeout(timer)
        }
        return undefined
    }, [userIpsResult])

    const handleGetData = useCallback(() => {
        fetchIps({})
    }, [userUuid, fetchIps])

    const handleClearResults = useCallback(() => {
        setJobId(null)
        setIsCompleted(false)
        setIsFailed(false)
    }, [])

    const handleClose = useCallback(() => {
        handleClearResults()
        onClose()
    }, [onClose, handleClearResults])

    const isIdle = !jobId && !isCompleted && !isFetchingIps
    const isInProgress = isFetchingIps || (!!jobId && !isCompleted && !isFailed)

    const renderSummaryCard = (totalIps: number, distinctIps: number) => (
        <SectionCard.Root gap="md">
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        IconComponent={TbRadar}
                        iconVariant="gradient-teal"
                        subtitle={t('active-sessions-drawer.widget.active-ips-across-nodes')}
                        title={formatInt(totalIps)}
                    />

                    <Group gap="xs">
                        <Tooltip label={t('active-sessions-drawer.widget.clear')}>
                            <ActionIcon
                                onClick={handleClearResults}
                                size="lg"
                                variant="gradient-red"
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
                                color="red"
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
                                variant="gradient-orange"
                            >
                                <TbUnlink size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('common.refresh')}>
                            <ActionIcon
                                onClick={() => {
                                    handleClearResults()
                                    handleGetData()
                                }}
                                size="lg"
                                variant="gradient-indigo"
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
                        IconComponent={TbAlertTriangle}
                        iconVariant="gradient-yellow"
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
                    IconComponent={TbAlertTriangle}
                    iconVariant="gradient-yellow"
                    title={t('active-sessions-drawer.widget.requirements')}
                />
            </SectionCard.Section>

            <Group gap="sm" wrap="nowrap">
                <ThemeIcon size="md" variant="gradient-teal">
                    <TbTag size={16} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={{ highlight: HIGHLIGHT_SPAN }}
                        i18nKey="active-sessions-drawer.widget.warning-version"
                        values={{ version: '2.6.0' }}
                    />
                </Text>
            </Group>

            <Stack gap="xs">
                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size="md" variant="gradient-violet">
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
                <ThemeIcon size="md" variant="gradient-cyan">
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
                <ThemeIcon size="md" variant="gradient-orange">
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
                            <ThemeIcon radius="md" size="xl" variant="gradient-red">
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
                                variant="light"
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

        const allIps = nodes?.flatMap((node) => node.ips) ?? []
        const totalIps = allIps.length
        const distinctIps = new Set(allIps).size

        return (
            <Stack gap="md">
                {renderSummaryCard(totalIps, distinctIps)}

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
                                        IconComponent={TbServer}
                                        iconVariant="gradient-blue"
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
                                                color="red"
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
                                                variant="gradient-orange"
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
                                node.ips.map((ip) => (
                                    <Group align="flex-end" gap="xs" key={ip} wrap="nowrap">
                                        <Tooltip
                                            label={t(
                                                'user-active-session-drawer.widget.drop-this-connection-on-this-node'
                                            )}
                                        >
                                            <ActionIcon
                                                color="red"
                                                onClick={() =>
                                                    dropConnections({
                                                        variables: {
                                                            dropBy: {
                                                                by: 'ipAddresses',
                                                                ipAddresses: [ip]
                                                            },
                                                            targetNodes: {
                                                                target: 'specificNodes',
                                                                nodeUuids: [node.nodeUuid]
                                                            }
                                                        }
                                                    })
                                                }
                                                size="lg"
                                                variant="gradient-orange"
                                            >
                                                <TbUnlink size={20} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Box style={{ flex: 1 }}>
                                            <CopyableFieldShared size="sm" value={ip} />
                                        </Box>

                                        <ActionIcon
                                            color="cyan"
                                            component="a"
                                            href={`https://ipinfo.io/${ip}`}
                                            rel="noopener noreferrer"
                                            size="input-sm"
                                            target="_blank"
                                            variant="gradient-teal"
                                        >
                                            <TbExternalLink size={18} />
                                        </ActionIcon>
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
                    IconComponent={TbRadar}
                    iconVariant="gradient-teal"
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
