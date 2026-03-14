import { PiClockDuotone, PiCloudDuotone, PiGearSixDuotone, PiQueueDuotone } from 'react-icons/pi'
import { Badge, Card, Grid, Group, Progress, Stack, Text, ThemeIcon } from '@mantine/core'
import { GetRemnawaveHealthCommand } from '@remnawave/backend-contract'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import classes from './runtime-detail-card.module.css'

type RuntimeMetric = GetRemnawaveHealthCommand.Response['response']['runtimeMetrics'][number]

const PROCESS_CONFIG: Record<
    string,
    {
        accentColor: string
        accentGlow: string
        color: string
        Icon: typeof PiGearSixDuotone
        name: string
    }
> = {
    api: {
        accentColor: 'var(--mantine-color-blue-6)',
        accentGlow: 'rgba(59, 130, 246, 0.2)',
        color: 'blue',
        Icon: PiCloudDuotone,
        name: 'API'
    },
    scheduler: {
        accentColor: 'var(--mantine-color-violet-6)',
        accentGlow: 'rgba(139, 92, 246, 0.2)',
        color: 'violet',
        Icon: PiClockDuotone,
        name: 'Scheduler'
    },
    processor: {
        accentColor: 'var(--mantine-color-teal-6)',
        accentGlow: 'rgba(20, 184, 166, 0.2)',
        color: 'teal',
        Icon: PiQueueDuotone,
        name: 'Processor'
    }
}

const DEFAULT_PROCESS = {
    accentColor: 'var(--mantine-color-gray-6)',
    accentGlow: 'rgba(108, 117, 125, 0.2)',
    color: 'gray',
    Icon: PiGearSixDuotone,
    name: 'Unknown'
}

interface RuntimeDetailCardProps {
    metric: RuntimeMetric
}

export function RuntimeDetailCard({ metric }: RuntimeDetailCardProps) {
    const config = PROCESS_CONFIG[metric.instanceType] ?? DEFAULT_PROCESS
    const heapPercent = metric.heapTotal > 0 ? (metric.heapUsed / metric.heapTotal) * 100 : 0

    return (
        <Card
            className={classes.card}
            padding="md"
            radius="md"
            style={
                {
                    '--accent-color': config.accentColor,
                    '--accent-glow': config.accentGlow
                } as React.CSSProperties
            }
        >
            <div className={classes.topAccent} />

            <Stack gap="sm">
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                        <ThemeIcon color={config.color} radius="md" size="lg" variant="soft">
                            <config.Icon size={18} />
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text c="white" ff="monospace" fw={700} lh={1} size="sm">
                                {config.name}-{metric.instanceId}
                            </Text>
                            <Badge color={config.color} ff="monospace" size="xs" variant="soft">
                                PID: {metric.pid}
                            </Badge>
                        </Stack>
                    </Group>
                </Group>

                <Grid gutter="sm">
                    <Grid.Col span={{ base: 12, sm: 7 }}>
                        <div className={classes.memorySection}>
                            <Stack gap={6}>
                                <Text c="dimmed" fw={600} lh={1} lts={1} size="10px" tt="uppercase">
                                    Memory
                                </Text>

                                <div>
                                    <Group justify="space-between" mb={4}>
                                        <Text className={classes.statLabel}>Heap</Text>
                                        <Text className={classes.heapValues}>
                                            {prettyBytesToAnyUtil(metric.heapUsed, true)} /{' '}
                                            {prettyBytesToAnyUtil(metric.heapTotal, true)}{' '}
                                            <span className={classes.heapPercent}>
                                                ({heapPercent.toFixed(0)}%)
                                            </span>
                                        </Text>
                                    </Group>
                                    <Progress
                                        color={config.color}
                                        radius="xl"
                                        size="sm"
                                        value={heapPercent}
                                    />
                                </div>

                                <Group grow>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>RSS</Text>
                                        <Text className={classes.statValue}>
                                            {prettyBytesToAnyUtil(metric.rss, true)}
                                        </Text>
                                    </Stack>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>External</Text>
                                        <Text className={classes.statValue}>
                                            {prettyBytesToAnyUtil(metric.external, true)}
                                        </Text>
                                    </Stack>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>Array Buffers</Text>
                                        <Text className={classes.statValue}>
                                            {prettyBytesToAnyUtil(metric.arrayBuffers, true)}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Stack>
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 5 }}>
                        <div className={classes.perfSection}>
                            <Stack gap={6}>
                                <Text c="dimmed" fw={600} lh={1} lts={1} size="10px" tt="uppercase">
                                    Event Loop
                                </Text>

                                <Group grow hiddenFrom="sm">
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>Delay</Text>
                                        <Text className={classes.statValue}>
                                            {metric.eventLoopDelayMs.toFixed(2)} ms
                                        </Text>
                                    </Stack>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>P99</Text>
                                        <Text className={classes.statValue}>
                                            {metric.eventLoopP99Ms.toFixed(2)} ms
                                        </Text>
                                    </Stack>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>Handles</Text>
                                        <Text className={classes.statValue}>
                                            {metric.activeHandles}
                                        </Text>
                                    </Stack>
                                </Group>

                                <Stack gap={6} visibleFrom="sm">
                                    <Group grow>
                                        <Stack gap={0}>
                                            <Text className={classes.statLabel}>Delay</Text>
                                            <Text className={classes.statValue}>
                                                {metric.eventLoopDelayMs.toFixed(2)} ms
                                            </Text>
                                        </Stack>
                                        <Stack gap={0}>
                                            <Text className={classes.statLabel}>P99</Text>
                                            <Text className={classes.statValue}>
                                                {metric.eventLoopP99Ms.toFixed(2)} ms
                                            </Text>
                                        </Stack>
                                    </Group>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel}>Active Handles</Text>
                                        <Text className={classes.statValue}>
                                            {metric.activeHandles}
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </div>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Card>
    )
}
