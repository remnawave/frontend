import {
    ActionIcon,
    Badge,
    Box,
    Group,
    Loader,
    Paper,
    Progress,
    SimpleGrid,
    Text,
    ThemeIconProps,
    Tooltip
} from '@mantine/core'
import {
    PiArrowsCounterClockwise,
    PiCloudArrowUpDuotone,
    PiUsersDuotone,
    PiWarningCircle
} from 'react-icons/pi'
import { GetOneNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { TbPower, TbWifi, TbWifiOff } from 'react-icons/tb'
import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getNodeResetDaysUtil, getXrayUptimeUtil } from '@shared/utils/time-utils'
import { QueryKeys, useDisableNode, useEnableNode } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { SectionCard } from '@shared/ui/section-card'
import { XrayLogo } from '@shared/ui/logos'
import { queryClient } from '@shared/api'
import { Logo } from '@shared/ui'

interface IProps {
    node: GetOneNodeCommand.Response['response']
}

export const NodeDetailsCardWidget = memo((props: IProps) => {
    const { node } = props

    const { t } = useTranslation()

    const mutationParams = {
        route: {
            uuid: node.uuid
        },
        mutationFns: {
            onSuccess: async (node: UpdateNodeCommand.Response['response']) => {
                await queryClient.setQueryData(
                    QueryKeys.nodes.getNode({ uuid: node.uuid }).queryKey,
                    node
                )
            }
        }
    }

    const { mutate: disableNode, isPending: isDisableNodePending } = useDisableNode(mutationParams)
    const { mutate: enableNode, isPending: isEnableNodePending } = useEnableNode(mutationParams)

    const isConfigMissing = useMemo(() => {
        return (
            node.configProfile.activeConfigProfileUuid === null ||
            node.configProfile.activeInbounds.length === 0
        )
    }, [node.configProfile])

    const { IconComponent, themeIconVariant } = useMemo(() => {
        let IconComponent: React.ComponentType<{ size: number }>
        let themeIconVariant: ThemeIconProps['variant'] = 'gradient-red'

        if (isConfigMissing) {
            IconComponent = PiWarningCircle
            themeIconVariant = 'gradient-red'
            return { IconComponent, themeIconVariant }
        }

        if (node.isDisabled) {
            IconComponent = TbWifiOff
            themeIconVariant = 'gradient-gray'
            return { IconComponent, themeIconVariant }
        }

        if (node.isConnected) {
            IconComponent = TbWifi
            themeIconVariant = 'gradient-teal'
        } else if (node.isConnecting) {
            IconComponent = PiCloudArrowUpDuotone
            themeIconVariant = 'gradient-yellow'
        } else {
            IconComponent = PiWarningCircle
            themeIconVariant = 'gradient-red'
        }

        return { IconComponent, themeIconVariant }
    }, [node.isConnected, node.isConnecting, node.isDisabled, isConfigMissing])

    const trafficData = useMemo(() => {
        let maxData = '∞'
        let percentage = 0

        const prettyUsedData = prettyBytesToAnyUtil(node.trafficUsedBytes || 0) || '0 B'

        if (node.isTrafficTrackingActive) {
            maxData = prettyBytesToAnyUtil(node.trafficLimitBytes || 0) || '∞'
            if (node.trafficLimitBytes === 0) {
                percentage = 100
            } else {
                percentage = Math.floor(
                    ((node.trafficUsedBytes ?? 0) * 100) / (node.trafficLimitBytes ?? 0)
                )
            }
        }

        return {
            maxData,
            percentage,
            prettyUsedData,
            isUnlimited: !node.isTrafficTrackingActive || node.trafficLimitBytes === 0
        }
    }, [node.trafficUsedBytes, node.trafficLimitBytes, node.isTrafficTrackingActive])

    const getProgressColor = useCallback(() => {
        if (trafficData.isUnlimited) return 'teal'
        if (trafficData.percentage > 95) return 'red'
        if (trafficData.percentage > 80) return 'yellow.4'
        return 'teal'
    }, [trafficData.percentage, trafficData.isUnlimited])

    const handleToggleNodeStatus = () => {
        if (node.isDisabled) {
            enableNode({})
        } else {
            disableNode({})
        }
    }

    return (
        <SectionCard.Root>
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        IconComponent={IconComponent}
                        iconSize={20}
                        iconVariant={themeIconVariant}
                        title={t('node-details-card.widget.node-details')}
                        titleOrder={5}
                    />

                    <Group gap="xs">
                        {node.isConnected && (
                            <Tooltip
                                label={t('node-stats.card.represents-the-uptime-of-the-xray-core')}
                            >
                                <Badge
                                    color="teal"
                                    h={28}
                                    leftSection={<XrayLogo size={14} />}
                                    size="lg"
                                    variant="light"
                                    visibleFrom="sm"
                                >
                                    {getXrayUptimeUtil(node.xrayUptime)}
                                </Badge>
                            </Tooltip>
                        )}
                        {!isConfigMissing && (
                            <Tooltip
                                label={
                                    node.isDisabled
                                        ? t('node-details-card.widget.enable-node')
                                        : t('node-details-card.widget.disable-node')
                                }
                            >
                                <ActionIcon
                                    color={node.isDisabled ? 'teal' : 'red'}
                                    disabled={isDisableNodePending || isEnableNodePending}
                                    onClick={handleToggleNodeStatus}
                                    size="md"
                                    style={{
                                        backgroundColor: node.isDisabled
                                            ? 'rgba(45, 212, 191, 0.15)'
                                            : 'rgba(239, 68, 68, 0.15)',
                                        border: `1px solid ${
                                            node.isDisabled
                                                ? 'rgba(45, 212, 191, 0.3)'
                                                : 'rgba(239, 68, 68, 0.3)'
                                        }`,
                                        boxShadow: `0 0 10px ${
                                            node.isDisabled
                                                ? 'rgba(45, 212, 191, 0.2)'
                                                : 'rgba(239, 68, 68, 0.2)'
                                        }`
                                    }}
                                    variant="light"
                                >
                                    {isDisableNodePending || isEnableNodePending ? (
                                        <Loader
                                            color={node.isDisabled ? 'teal' : 'red'}
                                            size="xs"
                                        />
                                    ) : (
                                        <TbPower
                                            size={16}
                                            style={{
                                                color: node.isDisabled
                                                    ? 'var(--mantine-color-teal-4)'
                                                    : 'var(--mantine-color-red-4)'
                                            }}
                                        />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}

                        {isConfigMissing && (
                            <Tooltip
                                label={t(
                                    'node-details-card.widget.config-profile-or-inbounds-is-missing'
                                )}
                            >
                                <ActionIcon
                                    color="gray"
                                    disabled
                                    size="md"
                                    style={{
                                        backgroundColor: 'rgba(107, 114, 128, 0.15)',
                                        border: `1px solid rgba(107, 114, 128, 0.3)`,
                                        boxShadow: `0 0 10px rgba(107, 114, 128, 0.2)`,
                                        opacity: 0.7
                                    }}
                                    variant="light"
                                >
                                    <TbPower
                                        size={16}
                                        style={{
                                            color: 'var(--mantine-color-teal-4)'
                                        }}
                                    />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </Group>
            </SectionCard.Section>
            <SectionCard.Section>
                <Box>
                    <Group gap="xs" justify="space-between" mb={6}>
                        <Group gap={6}>
                            <Text c="gray.3" ff="monospace" fw={600} size="sm">
                                {trafficData.prettyUsedData}
                            </Text>
                        </Group>
                        <Text c="dimmed" size="xs">
                            {trafficData.maxData}
                        </Text>
                    </Group>

                    <Progress
                        color={getProgressColor()}
                        radius="sm"
                        size="sm"
                        value={trafficData.isUnlimited ? 100 : trafficData.percentage}
                    />

                    {node.isTrafficTrackingActive && node.trafficResetDay && (
                        <Group gap={4} justify="center" mt={6}>
                            <PiArrowsCounterClockwise
                                color="var(--mantine-color-dimmed)"
                                size={12}
                            />
                            <Text c="dimmed" size="xs">
                                {t('node-stats.card.traffic-refill-in-days')}{' '}
                                {getNodeResetDaysUtil(node.trafficResetDay)}
                            </Text>
                        </Group>
                    )}
                </Box>
            </SectionCard.Section>
            {node.isConnected && (
                <SectionCard.Section>
                    <SimpleGrid
                        cols={{
                            base: 1,
                            xs: 2,
                            sm: 3
                        }}
                        spacing="xs"
                    >
                        <Paper
                            p="xs"
                            radius="md"
                            style={{
                                background:
                                    node.usersOnline! > 0
                                        ? 'rgba(45, 212, 191, 0.08)'
                                        : 'rgba(107, 114, 128, 0.08)',
                                border: `1px solid ${
                                    node.usersOnline! > 0
                                        ? 'rgba(45, 212, 191, 0.2)'
                                        : 'rgba(107, 114, 128, 0.2)'
                                }`
                            }}
                        >
                            <Group gap="xs" justify="center">
                                <PiUsersDuotone
                                    color={
                                        node.usersOnline! > 0
                                            ? 'var(--mantine-color-teal-5)'
                                            : 'var(--mantine-color-gray-6)'
                                    }
                                    size={16}
                                />
                                <Text
                                    c={node.usersOnline! > 0 ? 'teal.5' : 'gray.6'}
                                    fw={600}
                                    size="sm"
                                >
                                    {node.usersOnline}
                                </Text>
                            </Group>
                        </Paper>

                        {node.xrayVersion && (
                            <Paper
                                p="xs"
                                radius="md"
                                style={{
                                    background: 'rgba(139, 92, 246, 0.08)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)'
                                }}
                            >
                                <Tooltip label={t('node-details-card.widget.xray-core-version')}>
                                    <Group gap="xs" justify="center">
                                        <XrayLogo color="var(--mantine-color-violet-5)" size={16} />
                                        <Text c="violet.5" fw={600} size="sm">
                                            {node.xrayVersion}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}

                        {node.xrayUptime !== '0' && (
                            <Paper
                                hiddenFrom="sm"
                                p="xs"
                                radius="md"
                                style={{
                                    background: 'rgba(20, 184, 166, 0.08)', // teal-500 at 8%
                                    border: '1px solid rgba(20, 184, 166, 0.2)' // teal-500 at 20%
                                }}
                            >
                                <Tooltip
                                    label={t(
                                        'node-stats.card.represents-the-uptime-of-the-xray-core'
                                    )}
                                >
                                    <Group gap="xs" justify="center">
                                        <XrayLogo color="var(--mantine-color-teal-5)" size={16} />
                                        <Text
                                            c="teal.5"
                                            fw={600}
                                            size="sm"
                                            style={{ textTransform: 'uppercase' }}
                                        >
                                            {getXrayUptimeUtil(node.xrayUptime)}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}

                        {node.nodeVersion && (
                            <Paper
                                p="xs"
                                radius="md"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.08)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                <Tooltip
                                    label={t('node-details-card.widget.remnawave-node-version')}
                                >
                                    <Group gap="xs" justify="center">
                                        <Logo color="var(--mantine-color-indigo-5)" size={16} />
                                        <Text c="indigo.5" fw={600} size="sm">
                                            {node.nodeVersion}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}
                    </SimpleGrid>
                </SectionCard.Section>
            )}
        </SectionCard.Root>
    )
})
