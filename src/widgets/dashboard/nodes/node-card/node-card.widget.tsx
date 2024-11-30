import { UnstyledButton, Container, Progress, Badge, Group, Text } from '@mantine/core'
import { useNodesStoreActions } from '@entitites/dashboard/nodes'
import { getNodeResetDaysUtil } from '@/shared/utils/time-utils'
import { prettyBytesToAnyUtil } from '@/shared/utils/bytes'
import { PiArrowsCounterClockwise } from 'react-icons/pi'
import { useClipboard, useHover } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import ColorHash from 'color-hash'
import clsx from 'clsx'

import { NodeStatusBadgeWidget } from '../node-status-badge'
import classes from './NodeCard.module.css'
import { IProps } from './interfaces'

export function NodeCardWidget(props: IProps) {
    const { node } = props
    const { hovered, ref } = useHover()

    const actions = useNodesStoreActions()

    const clipboard = useClipboard({ timeout: 500 })

    const ch = new ColorHash()

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
            title: 'Copied',
            color: 'teal'
        })
    }

    const handleViewNode = () => {
        actions.setNode(node)
        actions.toggleEditModal(true)
    }

    return (
        <>
            <UnstyledButton onClick={handleViewNode} w={'100%'}>
                <Container
                    className={clsx(classes.item, { [classes.itemHover]: hovered })}
                    ref={ref}
                    fluid
                >
                    <Group gap="xs">
                        <NodeStatusBadgeWidget style={{ cursor: 'pointer' }} node={node} />

                        <Badge
                            style={{ cursor: 'pointer' }}
                            color={ch.hex(node.uuid)}
                            variant="light"
                            miw={'15ch'}
                            autoContrast
                            radius="md"
                            size="lg"
                        >
                            {node.name}
                        </Badge>
                        <Text
                            className={classes.hostInfoLabel}
                            style={{ cursor: 'copy' }}
                            onClick={handleCopy}
                            truncate="end"
                            miw={'22ch'}
                            maw={'22ch'}
                        >
                            {node.address}
                            {node.port ? `:${node.port}` : ''}
                        </Text>

                        <Badge
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                            color={'gray'}
                            autoContrast
                            miw={'7ch'}
                            radius="md"
                            size="lg"
                        >
                            {node.xrayVersion ?? '-'}
                        </Badge>

                        <Badge
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                            ff={'monospace'}
                            color={'gray'}
                            miw={'15ch'}
                            autoContrast
                            radius="md"
                            size="lg"
                        >
                            {`${prettyUsedData} / ${maxData}`}
                        </Badge>

                        {percentage >= 0 && node.isTrafficTrackingActive && (
                            <Progress
                                color={percentage > 95 ? 'red.9' : 'green.9'}
                                value={percentage}
                                radius="md"
                                w={'10ch'}
                                size="25"
                                striped
                            />
                        )}

                        {node.isTrafficTrackingActive && (
                            <Badge
                                leftSection={<PiArrowsCounterClockwise size={18} />}
                                style={{ cursor: 'pointer' }}
                                variant="outline"
                                color="gray"
                                radius="md"
                                size="lg"
                            >
                                {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                            </Badge>
                        )}
                    </Group>
                </Container>
            </UnstyledButton>
        </>
    )
}
