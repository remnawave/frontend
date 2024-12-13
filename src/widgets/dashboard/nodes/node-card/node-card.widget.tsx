import { Badge, Container, Group, Progress, Text, UnstyledButton } from '@mantine/core'
import { PiArrowsCounterClockwise } from 'react-icons/pi'
import { useClipboard, useHover } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import ColorHash from 'color-hash'
import clsx from 'clsx'

import { useNodesStoreActions } from '@entities/dashboard/nodes'
import { getNodeResetDaysUtil } from '@shared/utils/time-utils'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

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
        <UnstyledButton onClick={handleViewNode} w={'100%'}>
            <Container
                className={clsx(classes.item, { [classes.itemHover]: hovered })}
                fluid
                ref={ref}
            >
                <Group gap="xs" grow preventGrowOverflow={false}>
                    <NodeStatusBadgeWidget node={node} style={{ cursor: 'pointer' }} />

                    <Badge
                        autoContrast
                        color={ch.hex(node.uuid)}
                        miw={'15ch'}
                        radius="md"
                        size="lg"
                        style={{ cursor: 'pointer' }}
                        variant="light"
                    >
                        {node.name}
                    </Badge>
                    <Text
                        className={classes.hostInfoLabel}
                        maw={'22ch'}
                        miw={'22ch'}
                        onClick={handleCopy}
                        style={{ cursor: 'copy' }}
                        truncate="end"
                    >
                        {node.address}
                        {node.port ? `:${node.port}` : ''}
                    </Text>

                    <Badge
                        autoContrast
                        color={'gray'}
                        ff={'monospace'}
                        miw={'15ch'}
                        radius="md"
                        size="lg"
                        style={{ cursor: 'pointer' }}
                        variant="outline"
                    >
                        {`${prettyUsedData} / ${maxData}`}
                    </Badge>

                    {percentage >= 0 && node.isTrafficTrackingActive && (
                        <Progress
                            color={percentage > 95 ? 'red.9' : 'teal.9'}
                            radius="md"
                            size="25"
                            striped
                            value={percentage}
                            w={'10ch'}
                        />
                    )}

                    {node.isTrafficTrackingActive && (
                        <Badge
                            color="gray"
                            leftSection={<PiArrowsCounterClockwise size={18} />}
                            maw={'20ch'}
                            radius="md"
                            size="lg"
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                        >
                            {getNodeResetDaysUtil(node.trafficResetDay ?? 1)}
                        </Badge>
                    )}
                </Group>
            </Container>
        </UnstyledButton>
    )
}
