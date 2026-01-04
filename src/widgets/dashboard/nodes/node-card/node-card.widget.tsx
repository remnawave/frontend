import {
    PiArrowsCounterClockwise,
    PiDotsSixVertical,
    PiGlobeSimple,
    PiUsersDuotone
} from 'react-icons/pi'
import { Avatar, Badge, Box, Flex, Grid, Progress, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import ReactCountryFlag from 'react-country-flag'
import { useSortable } from '@dnd-kit/sortable'
import { TbAlertCircle } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { CSSProperties, memo } from 'react'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'

import { getNodeResetDaysUtil, getXrayUptimeUtil } from '@shared/utils/time-utils'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { faviconResolver } from '@shared/utils/misc'
import { XrayLogo } from '@shared/ui/logos'

import { NodeStatusBadgeWidget } from '../node-status-badge'
import classes from './NodeCard.module.css'
import { IProps } from './interfaces'

const getNodeColors = (node: IProps['node']) => {
    if (node.isDisabled) {
        return {
            backgroundColor: 'rgba(107, 114, 128, 0.15)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            boxShadow: 'rgba(107, 114, 128, 0.2)'
        }
    }
    if (node.isConnected) {
        return {
            backgroundColor: 'rgba(45, 212, 191, 0.15)',
            borderColor: 'rgba(45, 212, 191, 0.3)',
            boxShadow: 'rgba(45, 212, 191, 0.2)'
        }
    }
    if (node.isConnecting) {
        return {
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            boxShadow: 'rgba(245, 158, 11, 0.2)'
        }
    }
    return {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        boxShadow: 'rgba(239, 68, 68, 0.2)'
    }
}

const getProgressColor = (percentage: number, fallback: boolean) => {
    if (fallback) return 'teal.6'
    if (percentage > 95) return 'red.6'
    if (percentage > 80) return 'yellow.6'
    return 'teal.6'
}

export const NodeCardWidget = memo((props: IProps) => {
    const { t } = useTranslation()
    const { handleViewNode, node, isDragOverlay = false, isMobile } = props

    const clipboard = useClipboard({ timeout: 500 })

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: node.uuid
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : 'auto'
    }

    const prettyUsedData = prettyBytesToAnyUtil(node.trafficUsedBytes || 0) || '0 B'
    const maxData = node.isTrafficTrackingActive
        ? prettyBytesToAnyUtil(node.trafficLimitBytes || 0) || '∞'
        : '∞'

    const calcPercentage = () => {
        if (!node.isTrafficTrackingActive) return 0
        if (node.trafficLimitBytes === 0) return 100
        return Math.floor(((node.trafficUsedBytes ?? 0) * 100) / (node.trafficLimitBytes ?? 0))
    }
    const percentage = calcPercentage()
    const fallbackProgress = node.isTrafficTrackingActive && node.trafficLimitBytes === 0

    const isOnline = node.isConnected && node.xrayUptime !== '0' && !node.isDisabled
    const isConfigMissing =
        node.configProfile.activeConfigProfileUuid === null ||
        node.configProfile.activeInbounds.length === 0
    const { backgroundColor, borderColor, boxShadow } = getNodeColors(node)
    const progressColor = getProgressColor(percentage, fallbackProgress)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        clipboard.copy(node.address)
        notifications.show({
            message: node.address,
            title: t('node-card.widget.copied'),
            color: 'teal'
        })
    }

    return (
        <Box
            className={clsx(classes.nodeRow, {
                [classes.nodeRowDragging]: isDragging
            })}
            data-dnd-overlay={isDragOverlay}
            onClick={() => handleViewNode(node.uuid)}
            ref={isDragOverlay ? undefined : setNodeRef}
            style={{
                ...style,
                background: `linear-gradient(
                    135deg,
                    ${backgroundColor} 0%,
                    var(--mantine-color-dark-7) 100%
                )`,
                borderColor,
                boxShadow
            }}
        >
            <Box
                {...(isDragOverlay ? {} : attributes)}
                {...(isDragOverlay ? {} : listeners)}
                className={clsx(classes.dragHandle, {
                    [classes.dragHandleActive]: isDragging
                })}
            >
                <PiDotsSixVertical color="white" size="24px" />
            </Box>

            {!isMobile && (
                <Grid align="center" className={classes.desktopGrid} gutter="md">
                    <Grid.Col span={{ base: 12, sm: 5.5 }}>
                        <Flex align="center" gap="sm">
                            {isConfigMissing ? (
                                <Badge
                                    color="red"
                                    leftSection={<TbAlertCircle size={14} />}
                                    size="lg"
                                    variant="light"
                                >
                                    DANGLING
                                </Badge>
                            ) : (
                                <>
                                    <NodeStatusBadgeWidget node={node} withText={false} />
                                    <Badge
                                        color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                                        leftSection={<PiUsersDuotone size={14} />}
                                        miw="7ch"
                                        size="lg"
                                        variant="outline"
                                    >
                                        {node.usersOnline}
                                    </Badge>
                                </>
                            )}

                            <Flex align="center" className={classes.nameContainer} gap="xs">
                                {node.countryCode && node.countryCode !== 'XX' && (
                                    <ReactCountryFlag
                                        countryCode={node.countryCode}
                                        style={{
                                            fontSize: '1.6em',
                                            borderRadius: '2px'
                                        }}
                                    />
                                )}
                                <Text className={classes.nodeName} fw={600} size="md">
                                    {node.name}
                                </Text>
                            </Flex>

                            <Flex align="center" gap="xs">
                                {node.provider && (
                                    <Badge
                                        color="gray"
                                        leftSection={
                                            <Avatar
                                                alt={node.provider.name}
                                                color="initials"
                                                name={node.provider.name}
                                                onLoad={(event) => {
                                                    const img = event.target as HTMLImageElement
                                                    if (
                                                        img.naturalWidth <= 16 &&
                                                        img.naturalHeight <= 16
                                                    ) {
                                                        img.src = ''
                                                    }
                                                }}
                                                radius="sm"
                                                size={16}
                                                src={faviconResolver(node.provider.faviconLink)}
                                            />
                                        }
                                        size="lg"
                                        style={{
                                            maxWidth: '20ch',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer'
                                        }}
                                        variant="light"
                                    >
                                        {node.provider.name}
                                    </Badge>
                                )}
                            </Flex>
                        </Flex>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 2.5 }}>
                        <Flex align="center" gap="xs">
                            <PiGlobeSimple className={classes.icon} size={14} />
                            <Text
                                c="dimmed"
                                className={classes.addressText}
                                onClick={handleCopy}
                                size="sm"
                            >
                                {node.address}
                            </Text>
                        </Flex>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 2 }}>
                        <Box>
                            <Flex direction="column" gap={4}>
                                <Flex align="center" justify="space-between">
                                    <Text c="dimmed" ff="monospace" fw={600} size="sm" truncate>
                                        {prettyUsedData}
                                    </Text>
                                    <Text c="dimmed" size="xs" truncate>
                                        {maxData}
                                    </Text>
                                </Flex>
                                <Progress
                                    color={node.isTrafficTrackingActive ? progressColor : 'teal'}
                                    radius="sm"
                                    size="sm"
                                    value={node.isTrafficTrackingActive ? percentage : 100}
                                />
                            </Flex>
                        </Box>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 2 }}>
                        <Flex align="center" gap="xs" justify="space-between">
                            {node.isTrafficTrackingActive ? (
                                <Flex align="center" gap={4}>
                                    <PiArrowsCounterClockwise className={classes.icon} size={14} />
                                    <Text c="dimmed" size="sm">
                                        {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                                    </Text>
                                </Flex>
                            ) : (
                                <Box />
                            )}

                            {isOnline && (
                                <Flex align="center" gap={4}>
                                    <XrayLogo size={14} />
                                    <Text
                                        c={isOnline ? 'teal' : 'red'}
                                        fw={isOnline ? 600 : 500}
                                        size="sm"
                                        truncate
                                    >
                                        {getXrayUptimeUtil(node.xrayUptime)}
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    </Grid.Col>
                </Grid>
            )}

            {isMobile && (
                <Box>
                    <Flex align="center" gap="sm" mb="xs">
                        {isConfigMissing && (
                            <Badge
                                color="red"
                                leftSection={<TbAlertCircle size={14} />}
                                size="lg"
                                variant="light"
                            >
                                DANGLING
                            </Badge>
                        )}

                        {!isConfigMissing && <NodeStatusBadgeWidget node={node} withText={false} />}

                        {!isConfigMissing && (
                            <Badge
                                color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                                leftSection={<PiUsersDuotone size={14} />}
                                miw="7ch"
                                size="lg"
                                variant="outline"
                            >
                                {node.usersOnline}
                            </Badge>
                        )}

                        <Flex align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                            {node.countryCode && node.countryCode !== 'XX' && (
                                <ReactCountryFlag
                                    countryCode={node.countryCode}
                                    style={{
                                        fontSize: '1.5em',
                                        borderRadius: '2px'
                                    }}
                                />
                            )}
                            <Text className={classes.nodeName} fw={600} size="sm">
                                {node.name}
                            </Text>
                        </Flex>
                    </Flex>

                    <Box mb="xs">
                        <Flex align="center" gap="xs">
                            {node.provider && (
                                <Badge
                                    color="gray"
                                    leftSection={
                                        <Avatar
                                            alt={node.provider.name}
                                            color="initials"
                                            name={node.provider.name}
                                            onLoad={(event) => {
                                                const img = event.target as HTMLImageElement
                                                if (
                                                    img.naturalWidth <= 16 &&
                                                    img.naturalHeight <= 16
                                                ) {
                                                    img.src = ''
                                                }
                                            }}
                                            radius="sm"
                                            size={16}
                                            src={faviconResolver(node.provider.faviconLink)}
                                        />
                                    }
                                    size="lg"
                                    variant="light"
                                >
                                    {node.provider.name}
                                </Badge>
                            )}

                            {!node.provider && (
                                <Badge
                                    color="gray"
                                    leftSection={
                                        <Avatar
                                            alt="Unknown"
                                            color="initials"
                                            name="Unknown"
                                            radius="sm"
                                            size={16}
                                        />
                                    }
                                    size="lg"
                                    style={{
                                        visibility: 'hidden'
                                    }}
                                    variant="light"
                                >
                                    Unknown
                                </Badge>
                            )}
                        </Flex>
                    </Box>

                    <Box mb="xs">
                        <Flex direction="column" gap={2}>
                            <Flex align="center" justify="space-between">
                                <Text c="dimmed" ff="monospace" fw={600} size="sm" truncate>
                                    {prettyUsedData}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {maxData}
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>

                    <Progress
                        color={
                            node.isTrafficTrackingActive && percentage >= 0 ? progressColor : 'teal'
                        }
                        radius="sm"
                        size="xs"
                        value={node.isTrafficTrackingActive && percentage >= 0 ? percentage : 100}
                    />

                    <Flex align="center" justify="space-between" mt="xs">
                        {node.isTrafficTrackingActive ? (
                            <Flex align="center" gap={4}>
                                <PiArrowsCounterClockwise className={classes.icon} size={12} />
                                <Text c="dimmed" size="xs">
                                    {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                                </Text>
                            </Flex>
                        ) : (
                            <Box />
                        )}

                        <Flex align="center" gap={4}>
                            <XrayLogo size={12} />
                            <Text
                                c={isOnline ? 'teal' : 'dimmed'}
                                fw={isOnline ? 600 : 500}
                                size="xs"
                            >
                                {isOnline ? getXrayUptimeUtil(node.xrayUptime) : 'offline'}
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            )}
        </Box>
    )
})
