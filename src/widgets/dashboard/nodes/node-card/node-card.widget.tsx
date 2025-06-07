import { PiArrowsCounterClockwise, PiDotsSixVertical, PiUsersDuotone } from 'react-icons/pi'
import { Badge, Box, Grid, Group, Progress, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { Draggable } from '@hello-pangea/dnd'
import ColorHash from 'color-hash'
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

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

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
    const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
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

    return (
        <Draggable draggableId={node.uuid} index={index} key={node.uuid}>
            {(provided, snapshot) => (
                <Box
                    className={clsx(classes.item, {
                        [classes.itemDragging]: snapshot.isDragging || isHovered
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        <PiDotsSixVertical color="white" size="2rem" />
                    </div>
                    <Box
                        onClick={handleViewNode}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ cursor: 'pointer' }}
                        w={'100%'}
                    >
                        <Grid align="center" gutter={{ base: 'xs', sm: 'md' }}>
                            <Grid.Col
                                order={{ base: 1, xs: 1 }}
                                span={{ base: 'content', xs: 'content' }}
                            >
                                <NodeStatusBadgeWidget node={node} style={{ cursor: 'pointer' }} />
                            </Grid.Col>

                            <Grid.Col
                                order={{ base: 2, xs: 2 }}
                                span={{ base: 'content', xs: 'content' }}
                            >
                                <Badge
                                    color={node.usersOnline! > 0 ? 'teal' : 'gray'}
                                    leftSection={<PiUsersDuotone size={18} />}
                                    miw={'8ch'}
                                    radius="md"
                                    size="lg"
                                    style={{ cursor: 'pointer' }}
                                    variant="outline"
                                >
                                    {node.usersOnline}
                                </Badge>
                            </Grid.Col>

                            <Grid.Col
                                order={{ base: 3, xs: 3 }}
                                span={{ base: 12, xs: 'auto', sm: 'auto' }}
                            >
                                <Stack align="stretch" gap={'xs'}>
                                    <Badge
                                        autoContrast
                                        color={ch.hex(node.uuid)}
                                        leftSection={
                                            node.countryCode &&
                                            node.countryCode !== 'XX' && (
                                                <ReactCountryFlag
                                                    className="emojiFlag"
                                                    countryCode={node.countryCode}
                                                    style={{
                                                        fontSize: '2em',
                                                        lineHeight: '1.5em'
                                                    }}
                                                />
                                            )
                                        }
                                        miw={{
                                            base: '20ch',
                                            xs: '10ch'
                                        }}
                                        radius="md"
                                        size="lg"
                                        style={{ cursor: 'pointer', textAlign: 'left' }}
                                        variant="light"
                                    >
                                        {node.name}
                                    </Badge>

                                    <Text
                                        className={classes.hostInfoLabel}
                                        display="inline-block"
                                        maw="max-content"
                                        onClick={handleCopy}
                                        style={{ cursor: 'copy' }}
                                        truncate="end"
                                    >
                                        {node.address}
                                        {node.port ? `:${node.port}` : ''}
                                    </Text>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col order={{ base: 4, xs: 4 }} span={{ base: 12, xs: 'content' }}>
                                <Stack gap="xs">
                                    <Group>
                                        <Badge
                                            autoContrast
                                            color={'gray'}
                                            ff={'monospace'}
                                            radius="md"
                                            size="lg"
                                            style={{ cursor: 'pointer' }}
                                            variant="outline"
                                        >
                                            {`${prettyUsedData} / ${maxData}`}
                                        </Badge>

                                        {node.isTrafficTrackingActive && (
                                            <Badge
                                                color="gray"
                                                leftSection={<PiArrowsCounterClockwise size={16} />}
                                                radius="md"
                                                size="lg"
                                                style={{ cursor: 'pointer' }}
                                                variant="outline"
                                            >
                                                {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                                            </Badge>
                                        )}

                                        {node.xrayUptime !== '0' && node.isConnected && (
                                            <Badge
                                                color="gray"
                                                leftSection={<XtlsLogo height={18} width={18} />}
                                                maw={'20ch'}
                                                radius="md"
                                                size="lg"
                                                style={{ cursor: 'pointer' }}
                                                variant="outline"
                                            >
                                                {getXrayUptimeUtil(node.xrayUptime, i18n)}
                                            </Badge>
                                        )}

                                        {(!node.isConnected || node.xrayUptime === '0') && (
                                            <Badge
                                                color="red"
                                                leftSection={<XtlsLogo height={18} width={18} />}
                                                maw={'20ch'}
                                                radius="md"
                                                size="lg"
                                                style={{ cursor: 'pointer' }}
                                                variant="outline"
                                            >
                                                offline
                                            </Badge>
                                        )}
                                    </Group>

                                    {node.isTrafficTrackingActive && percentage >= 0 && (
                                        <Progress
                                            color={percentage > 95 ? 'red.9' : 'teal.9'}
                                            radius="md"
                                            size="lg"
                                            striped
                                            value={percentage}
                                            w="100%"
                                        />
                                    )}
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </Draggable>
    )
}
