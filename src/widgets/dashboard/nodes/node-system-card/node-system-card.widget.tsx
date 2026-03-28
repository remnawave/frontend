import {
    PiArrowDownDuotone,
    PiArrowUpDuotone,
    PiCpuDuotone,
    PiDesktopTowerDuotone,
    PiLinuxLogoDuotone,
    PiNetworkDuotone,
    PiTimerDuotone
} from 'react-icons/pi'
import { ActionIcon, Badge, Group, Progress, Stack, Text, Tooltip } from '@mantine/core'
import { GetOneNodeCommand } from '@remnawave/backend-contract'
import { memo, useMemo, useRef, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { TbCamera } from 'react-icons/tb'

import {
    prettyBytesToAnyUtil,
    prettySiBytesUtil,
    prettySiRealtimeBytesUtil
} from '@shared/utils/bytes'
import { copyScreenshotToClipboard } from '@shared/utils/copy-screenshot.util'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { formatDurationUtil } from '@shared/utils/time-utils'
import { SectionCard } from '@shared/ui/section-card'

import classes from './node-system-card.module.css'

interface IProps {
    node: GetOneNodeCommand.Response['response']
}

export const NodeSystemCardWidget = memo((props: IProps) => {
    const { node } = props
    const { t } = useTranslation()
    const cardRef = useRef<HTMLDivElement | null>(null)

    const [copying, setCopying] = useState(false)

    const copy = async () => {
        setCopying(true)
        try {
            if (!cardRef.current) throw new Error('cardRef')
            await copyScreenshotToClipboard(cardRef.current)
        } catch (error) {
            notifications.show({
                color: 'red',
                message: `${error instanceof Error ? error.message : 'Unknown error'}`,
                title: 'Error'
            })
        } finally {
            setCopying(false)
        }
    }

    const memoryData = useMemo(() => {
        if (!node.system) return null

        const total = node.system.info.memoryTotal
        const free = node.system.stats.memoryFree
        const used = total - free
        const percentage = total > 0 ? Math.round((used / total) * 100) : 0

        let color = 'teal'
        if (percentage > 90) color = 'red'
        else if (percentage > 70) color = 'yellow'

        return {
            total: prettyBytesToAnyUtil(total) || '0 B',
            free: prettyBytesToAnyUtil(free) || '0 B',
            used: prettyBytesToAnyUtil(used) || '0 B',
            percentage,
            color
        }
    }, [node.system])

    const systemUptime = useMemo(() => {
        if (!node.system) return null
        return formatDurationUtil(Math.floor(node.system.stats.uptime))
    }, [node.system])

    const interfaceData = useMemo(() => {
        if (!node.system?.stats.interface) return null

        const { interface: iface } = node.system.stats

        return {
            name: iface.interface,
            rxSpeed: prettySiRealtimeBytesUtil(iface.rxBytesPerSec, true, true),
            txSpeed: prettySiRealtimeBytesUtil(iface.txBytesPerSec, true, true),
            rxTotal: prettySiBytesUtil(iface.rxTotal) || '0 B',
            txTotal: prettySiBytesUtil(iface.txTotal) || '0 B'
        }
    }, [node.system])

    if (!node.system) return null

    const { info } = node.system

    return (
        <div className={classes.wrapper}>
            <ActionIcon
                className={classes.screenshotButton}
                color="gray"
                loading={copying}
                onClick={copy}
                radius="md"
                size="sm"
                variant="subtle"
            >
                <TbCamera size={24} />
            </ActionIcon>

            <SectionCard.Root gap="sm" ref={cardRef} style={{ overflow: 'hidden' }}>
                <SectionCard.Section>
                    <Group justify="space-between" wrap="nowrap">
                        <BaseOverlayHeader
                            iconColor="violet"
                            IconComponent={PiDesktopTowerDuotone}
                            iconSize={20}
                            iconVariant="soft"
                            title={t('node-system-card.widget.system-info')}
                            titleOrder={5}
                        />

                        <Group gap="xs">
                            <Badge
                                color="violet"
                                ff="monospace"
                                size="sm"
                                variant="soft"
                                visibleFrom="sm"
                            >
                                {info.platform} / {info.arch}
                            </Badge>
                            <Badge
                                color="teal"
                                ff="monospace"
                                leftSection={<PiTimerDuotone size={12} />}
                                size="lg"
                                variant="light"
                            >
                                {systemUptime}
                            </Badge>
                        </Group>
                    </Group>
                </SectionCard.Section>

                <SectionCard.Section>
                    <div className={classes.memorySection}>
                        <Stack gap={6}>
                            <Text c="dimmed" fw={600} lh={1} lts={1} size="10px" tt="uppercase">
                                {t('node-system-card.widget.memory')}
                            </Text>

                            <div>
                                <Group justify="space-between" mb={4}>
                                    <Text className={classes.memoryValues}>
                                        {memoryData?.used} / {memoryData?.total}{' '}
                                        <span className={classes.memoryPercent}>
                                            ({memoryData?.percentage}%)
                                        </span>
                                    </Text>
                                </Group>
                                <Progress
                                    color={memoryData?.color ?? 'teal'}
                                    radius="xl"
                                    size="sm"
                                    value={memoryData?.percentage ?? 0}
                                />
                            </div>
                        </Stack>
                    </div>
                </SectionCard.Section>

                {interfaceData && (
                    <SectionCard.Section>
                        <div className={classes.interfaceSection}>
                            <Stack gap={6}>
                                <Group gap={6} justify="space-between">
                                    <Text
                                        c="dimmed"
                                        fw={600}
                                        lh={1}
                                        lts={1}
                                        size="10px"
                                        tt="uppercase"
                                    >
                                        {t('node-system-card.widget.interface')}
                                    </Text>
                                    <Badge color="cyan" ff="monospace" size="xs" variant="soft">
                                        {interfaceData.name}
                                    </Badge>
                                </Group>

                                <Group grow>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel} component="div">
                                            <Group gap={4}>
                                                <PiArrowDownDuotone
                                                    color="var(--mantine-color-teal-5)"
                                                    size={12}
                                                />
                                                RX
                                            </Group>
                                        </Text>
                                        <Text className={classes.statValue}>
                                            {interfaceData.rxSpeed}
                                        </Text>
                                        <Text c="dimmed" ff="monospace" size="10px">
                                            {t('node-system-card.widget.total')}:{' '}
                                            {interfaceData.rxTotal}
                                        </Text>
                                    </Stack>
                                    <Stack gap={0}>
                                        <Text className={classes.statLabel} component="div">
                                            <Group gap={4}>
                                                <PiArrowUpDuotone
                                                    color="var(--mantine-color-cyan-5)"
                                                    size={12}
                                                />
                                                TX
                                            </Group>
                                        </Text>
                                        <Text className={classes.statValue}>
                                            {interfaceData.txSpeed}
                                        </Text>
                                        <Text c="dimmed" ff="monospace" size="10px">
                                            {t('node-system-card.widget.total')}:{' '}
                                            {interfaceData.txTotal}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Stack>
                        </div>
                    </SectionCard.Section>
                )}

                <SectionCard.Section>
                    <div className={classes.infoSection}>
                        <Stack gap={6}>
                            <Text c="dimmed" fw={600} lh={1} lts={1} size="10px" tt="uppercase">
                                {t('node-system-card.widget.system')}
                            </Text>

                            <Stack gap={0} style={{ minWidth: 0, overflow: 'hidden' }}>
                                <Text className={classes.statLabel} component="div">
                                    <Group gap={4}>
                                        <PiCpuDuotone size={12} />
                                        CPU
                                    </Group>
                                </Text>
                                <Tooltip label={`${info.cpus} x ${info.cpuModel}`}>
                                    <Text className={classes.statValue}>
                                        {info.cpus} x {info.cpuModel}
                                    </Text>
                                </Tooltip>
                            </Stack>

                            <Group grow style={{ overflow: 'hidden' }}>
                                <Stack gap={0} style={{ minWidth: 0 }}>
                                    <Text className={classes.statLabel} component="div">
                                        <Group gap={4}>
                                            <PiLinuxLogoDuotone size={12} />
                                            {t('node-system-card.widget.kernel')}
                                        </Group>
                                    </Text>
                                    <Text className={classes.statValue}>{info.release}</Text>
                                </Stack>
                                {info.networkInterfaces.length > 0 && (
                                    <Stack gap={0} style={{ minWidth: 0 }}>
                                        <Text className={classes.statLabel} component="div">
                                            <Group gap={4}>
                                                <PiNetworkDuotone size={12} />
                                                {t('node-system-card.widget.network')}
                                            </Group>
                                        </Text>
                                        <Tooltip
                                            disabled={
                                                info.networkInterfaces.filter((i) => i !== 'lo')
                                                    .length <= 3
                                            }
                                            label={info.networkInterfaces
                                                .filter((i) => i !== 'lo')
                                                .join(', ')}
                                        >
                                            <Text className={classes.statValue}>
                                                {(() => {
                                                    const ifaces = info.networkInterfaces.filter(
                                                        (i) => i !== 'lo'
                                                    )
                                                    const visible = ifaces.slice(0, 3)
                                                    const rest = ifaces.length - 3

                                                    return rest > 0
                                                        ? `${visible.join(', ')} +${rest}`
                                                        : visible.join(', ')
                                                })()}
                                            </Text>
                                        </Tooltip>
                                    </Stack>
                                )}
                            </Group>
                        </Stack>
                    </div>
                </SectionCard.Section>
            </SectionCard.Root>
        </div>
    )
})
