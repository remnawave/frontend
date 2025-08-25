import {
    Box,
    Card,
    Center,
    Group,
    HoverCard,
    Indicator,
    Loader,
    Paper,
    px,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title
} from '@mantine/core'
import {
    PiGlobeSimple,
    PiInfo,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiSpeedometer,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetNodesMetricsCommand } from '@remnawave/backend-contract'
import { VirtuosoMasonry } from '@virtuoso.dev/masonry'
import { TbServer, TbServer2 } from 'react-icons/tb'
import { memo, useCallback, useMemo } from 'react'
import { useMediaQuery } from '@mantine/hooks'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { MetricCard } from '@shared/ui/metrics/metric-card'
import { useGetNodesMetrics } from '@shared/api/hooks'
import { formatInt } from '@shared/utils/misc'

import { NodeDetailsCard } from './node-details-card'
import styles from './NodeDetails.module.css'

const StatCard = memo(
    ({
        icon: Icon,
        title,
        value,
        color,
        isLoading
    }: {
        color: string
        icon: React.ElementType
        isLoading?: boolean
        title: string
        value: number | string
    }) => (
        <MetricCard.Root>
            <Group wrap="nowrap">
                <MetricCard.Icon c={color} p="sm">
                    <Icon size="32px" />
                </MetricCard.Icon>
                <Stack align="self-start" gap="xs" miw={0} w="100%">
                    <MetricCard.TextMuted truncate>{title}</MetricCard.TextMuted>
                    <Box miw={0} w="100%">
                        <MetricCard.TextEmphasis ff="monospace" truncate>
                            {isLoading ? <Loader color={color} size="xs" /> : value}
                        </MetricCard.TextEmphasis>
                    </Box>
                </Stack>
            </Group>
        </MetricCard.Root>
    )
)

export const NodeMetricsWidget = () => {
    const { data: nodeMetrics, isLoading } = useGetNodesMetrics()
    const { open, setInternalData } = useModalsStore()
    const isMobile = useMediaQuery('(max-width: 768px)')

    const handleNodeClick = useCallback(
        (nodeUuid: string) => {
            setInternalData({
                internalState: { nodeUuid },
                modalKey: MODALS.EDIT_NODE_BY_UUID_MODAL
            })
            open(MODALS.EDIT_NODE_BY_UUID_MODAL)
        },
        [open, setInternalData]
    )

    const overallStats = useMemo(() => {
        if (!nodeMetrics?.nodes) return null

        const totalNodes = nodeMetrics.nodes.length
        const totalUsersOnline = nodeMetrics.nodes.reduce((acc, node) => acc + node.usersOnline, 0)
        const activeNodes = nodeMetrics.nodes.filter((node) => node.usersOnline > 0).length
        const totalInbounds = nodeMetrics.nodes.reduce(
            (acc, node) => acc + node.inboundsStats.length,
            0
        )

        return {
            totalNodes,
            totalUsersOnline,
            activeNodes,
            totalInbounds
        }
    }, [nodeMetrics])

    if (isLoading) {
        return (
            <Center h={200}>
                <Loader size="lg" />
            </Center>
        )
    }

    if (!nodeMetrics?.nodes?.length) {
        return (
            <Card p="xl" radius="lg">
                <Center>
                    <Stack align="center" gap="md">
                        <ThemeIcon color="gray" size="xl" variant="light">
                            <PiProhibitDuotone size="32px" />
                        </ThemeIcon>
                        <Text c="gray.5" size="lg">
                            No nodes metrics available
                        </Text>
                    </Stack>
                </Center>
            </Card>
        )
    }

    const Item: React.FC<{
        context: unknown
        data: GetNodesMetricsCommand.Response['response']['nodes'][number]
        index: number
    }> = ({ data }) => {
        return (
            <div
                className={styles.itemFadeIn}
                key={data.nodeUuid}
                style={{
                    padding: 5,
                    margin: '0'
                }}
            >
                <NodeDetailsCard handleNodeClick={handleNodeClick} node={data} />
            </div>
        )
    }

    return (
        <Stack gap="md">
            <Paper
                p="md"
                radius="md"
                style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
            >
                <Group align="center" gap="sm" wrap="wrap">
                    <Group align="center" gap="sm">
                        <HoverCard position="bottom" shadow="lg" width={320} withArrow>
                            <HoverCard.Target>
                                <ThemeIcon color="teal" size="md" variant="light">
                                    <PiInfo size={px('1.2rem')} />
                                </ThemeIcon>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Stack gap="sm">
                                    <Group gap="xs">
                                        <ThemeIcon color="blue" size="xs" variant="light">
                                            <PiInfo size="0.6rem" />
                                        </ThemeIcon>
                                        <Text fw={600} size="sm">
                                            Additional Information
                                        </Text>
                                    </Group>
                                    <Stack gap="xs">
                                        <Text c="dimmed" size="xs">
                                            • Updates every 30 seconds from /metrics endpoint
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Not all data is visualized on this dashboard
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Inbound/Outbound traffic is the sum of all traffic
                                            from Panel or Node startup
                                        </Text>
                                    </Stack>
                                </Stack>
                            </HoverCard.Dropdown>
                        </HoverCard>

                        <Text c="blue.4" fw={500} size="sm">
                            Metrics from Prometheus
                        </Text>
                    </Group>
                    <Group align="center" gap="xs">
                        <Indicator
                            color="teal.5"
                            processing
                            size={8}
                            style={{
                                zIndex: 5
                            }}
                            visibleFrom="xs"
                        />
                        <Text c="gray.4" size="xs">
                            Live updates from /metrics endpoint
                        </Text>
                    </Group>
                </Group>
            </Paper>

            <Box>
                <Group align="center" gap="md" mb="lg" wrap="nowrap">
                    <ThemeIcon color="indigo" size="lg" variant="light">
                        <PiSpeedometer size="24px" />
                    </ThemeIcon>
                    <Title
                        c="white"
                        order={2}
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        Metrics Overview
                    </Title>
                </Group>

                <SimpleGrid cols={{ sm: 1, md: 2, lg: 4 }} spacing="md">
                    <StatCard
                        color="indigo"
                        icon={TbServer}
                        isLoading={isLoading}
                        title="Total Nodes"
                        value={formatInt(overallStats?.totalNodes || 0)}
                    />
                    <StatCard
                        color="teal"
                        icon={PiPulseDuotone}
                        isLoading={isLoading}
                        title="Active Nodes"
                        value={formatInt(overallStats?.activeNodes || 0)}
                    />
                    <StatCard
                        color="blue"
                        icon={PiUsersDuotone}
                        isLoading={isLoading}
                        title="Users Online"
                        value={formatInt(overallStats?.totalUsersOnline || 0)}
                    />
                    <StatCard
                        color="violet"
                        icon={PiGlobeSimple}
                        isLoading={isLoading}
                        title="Total Inbounds"
                        value={formatInt(overallStats?.totalInbounds || 0)}
                    />
                </SimpleGrid>
            </Box>

            <Box>
                <Group align="center" gap="md" mb="lg">
                    <ThemeIcon color="teal" size="lg" variant="light">
                        <TbServer2 size="24px" />
                    </ThemeIcon>
                    <Title c="white" order={2}>
                        Node Details
                    </Title>
                </Group>

                <VirtuosoMasonry
                    columnCount={isMobile ? 1 : 2}
                    data={nodeMetrics?.nodes}
                    ItemContent={Item}
                    style={{
                        height: '100%'
                    }}
                    useWindowScroll={true}
                />
            </Box>
        </Stack>
    )
}
