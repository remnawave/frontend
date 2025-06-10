import {
    PiArrowsCounterClockwise,
    PiDotsSixVertical,
    PiGlobeSimple,
    PiUsersDuotone
} from 'react-icons/pi'
import { Badge, Box, Flex, Grid, Progress, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'
import clsx from 'clsx'

import { getNodeResetDaysUtil, getXrayUptimeUtil } from '@shared/utils/time-utils'
import { useNodesStoreActions } from '@entities/dashboard/nodes'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { NodeStatusBadgeWidget } from '../node-status-badge'
import classes from './NodeCard.module.css'
import { IProps } from './interfaces'

export function NodeCardWidget(props: IProps) {
    const { t, i18n } = useTranslation()
    const { node, index } = props
    const [isHovered, setIsHovered] = useState(false)
    const actions = useNodesStoreActions()
    const clipboard = useClipboard({ timeout: 500 })

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

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        clipboard.copy(`${node.address}`)
        notifications.show({
            message: `${node.address}`,
            title: t('node-card.widget.copied'),
            color: 'teal'
        })
    }

    const handleViewNode = () => {
        actions.setNode(node)
        actions.toggleEditModal(true)
    }

    const isOnline = node.isConnected && node.xrayUptime !== '0'

    const getProgressColor = () => {
        if (percentage > 95) return 'red.6'
        if (percentage > 80) return 'yellow.6'
        return 'teal.6'
    }

    return (
        <Draggable draggableId={node.uuid} index={index} key={node.uuid}>
            {(provided, snapshot) => (
                <Box
                    className={clsx(classes.nodeRow, {
                        [classes.nodeRowDragging]: snapshot.isDragging,
                        [classes.nodeRowHovered]: isHovered
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    onClick={handleViewNode}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                        <PiDotsSixVertical color="white" size="1.5rem" />
                    </Box>

                    <Grid align="center" className={classes.desktopGrid} gutter="md">
                        <Grid.Col span={{ base: 12, sm: 5.5 }}>
                            <Flex align="center" gap="sm">
                                <NodeStatusBadgeWidget node={node} withText={false} />

                                <Badge
                                    color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                                    leftSection={<PiUsersDuotone size={14} />}
                                    miw={'7ch'}
                                    radius="md"
                                    size="lg"
                                    variant="outline"
                                >
                                    {node.usersOnline}
                                </Badge>

                                <Flex align="center" className={classes.nameContainer} gap="xs">
                                    {node.countryCode && node.countryCode !== 'XX' && (
                                        <ReactCountryFlag
                                            countryCode={node.countryCode}
                                            style={{
                                                fontSize: '1.1em',
                                                borderRadius: '2px'
                                            }}
                                        />
                                    )}
                                    <Text className={classes.nodeName} fw={600} size="md">
                                        {node.name}
                                    </Text>
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
                                        <Text c="dimmed" ff="monospace" fw={600} size="sm">
                                            {prettyUsedData}
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            {maxData}
                                        </Text>
                                    </Flex>
                                    <Progress
                                        color={
                                            node.isTrafficTrackingActive
                                                ? getProgressColor()
                                                : 'teal'
                                        }
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
                                        <PiArrowsCounterClockwise
                                            className={classes.icon}
                                            size={14}
                                        />
                                        <Text c="dimmed" size="sm">
                                            {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Box />
                                )}

                                <Flex align="center" gap={4}>
                                    <XtlsLogo height={14} width={14} />
                                    <Text
                                        c={isOnline ? 'teal' : 'red'}
                                        fw={isOnline ? 600 : 500}
                                        size="sm"
                                    >
                                        {isOnline
                                            ? getXrayUptimeUtil(node.xrayUptime, i18n)
                                            : 'offline'}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Grid.Col>
                    </Grid>

                    <Box className={classes.mobileLayout}>
                        <Flex align="center" gap="sm" mb="xs">
                            <NodeStatusBadgeWidget node={node} withText={false} />

                            <Badge
                                color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                                leftSection={<PiUsersDuotone size={14} />}
                                miw={'7ch'}
                                radius="md"
                                size="lg"
                                variant="outline"
                            >
                                {node.usersOnline}
                            </Badge>

                            <Flex align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                {node.countryCode && node.countryCode !== 'XX' && (
                                    <ReactCountryFlag
                                        countryCode={node.countryCode}
                                        style={{
                                            fontSize: '1em',
                                            borderRadius: '2px'
                                        }}
                                    />
                                )}
                                <Text className={classes.nodeName} fw={600} size="sm">
                                    {node.name}
                                </Text>
                            </Flex>
                        </Flex>

                        {/* <Flex align="center" gap="xs" mb="xs">
                            <PiGlobeSimple className={classes.icon} size={14} />
                            <Text
                                c="dimmed"
                                className={classes.addressText}
                                onClick={handleCopy}
                                size="sm"
                                style={{ flex: 1, minWidth: 0 }}
                            >
                                {node.address}
                                {node.port ? `:${node.port}` : ''}
                            </Text>
                        </Flex> */}

                        <Box mb="xs">
                            <Flex direction="column" gap={2}>
                                <Flex align="center" justify="space-between">
                                    <Text c="dimmed" ff="monospace" fw={600} size="sm">
                                        {prettyUsedData}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {node.isTrafficTrackingActive ? maxData : '∞'}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Box>

                        <Progress
                            color={
                                node.isTrafficTrackingActive && percentage >= 0
                                    ? getProgressColor()
                                    : 'teal'
                            }
                            radius="sm"
                            size="xs"
                            value={
                                node.isTrafficTrackingActive && percentage >= 0 ? percentage : 100
                            }
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
                                <XtlsLogo height={12} width={12} />
                                <Text
                                    c={isOnline ? 'teal' : 'dimmed'}
                                    fw={isOnline ? 600 : 500}
                                    size="xs"
                                >
                                    {isOnline
                                        ? getXrayUptimeUtil(node.xrayUptime, i18n)
                                        : 'offline'}
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            )}
        </Draggable>
    )
}
