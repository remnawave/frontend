import { Badge, Container, Group, Progress, Text, UnstyledButton } from '@mantine/core'
import { useClipboard, useHover } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useNodesStoreActions } from '@entitites/dashboard/nodes'
import clsx from 'clsx'
import ColorHash from 'color-hash'
import { PiArrowsCounterClockwise } from 'react-icons/pi'
import { prettyBytesToAnyUtil } from '@/shared/utils/bytes'
import { getNodeResetDaysUtil } from '@/shared/utils/time-utils'
import { NodeStatusBadgeWidget } from '../node-status-badge'
import { IProps } from './interfaces'
import classes from './NodeCard.module.css'

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
            title: 'Copied',
            message: `${node.address}`,
            color: 'teal'
        })
    }

    const handleViewNode = () => {
        actions.setNode(node)
        actions.toggleEditModal(true)
    }

    return (
        <>
            <UnstyledButton w={'100%'} onClick={handleViewNode}>
                <Container
                    ref={ref}
                    fluid
                    className={clsx(classes.item, { [classes.itemHover]: hovered })}
                >
                    <Group gap="xs">
                        <NodeStatusBadgeWidget style={{ cursor: 'pointer' }} node={node} />

                        <Badge
                            miw={'15ch'}
                            size="lg"
                            autoContrast
                            variant="light"
                            radius="md"
                            style={{ cursor: 'pointer' }}
                            color={ch.hex(node.uuid)}
                        >
                            {node.name}
                        </Badge>
                        <Text
                            miw={'22ch'}
                            className={classes.hostInfoLabel}
                            maw={'22ch'}
                            truncate="end"
                            style={{ cursor: 'copy' }}
                            onClick={handleCopy}
                        >
                            {node.address}
                            {node.port ? `:${node.port}` : ''}
                        </Text>

                        <Badge
                            miw={'7ch'}
                            size="lg"
                            autoContrast
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                            radius="md"
                            color={'gray'}
                        >
                            {node.xrayVersion ?? '-'}
                        </Badge>

                        <Badge
                            miw={'15ch'}
                            color={'gray'}
                            size="lg"
                            autoContrast
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                            radius="md"
                            ff={'monospace'}
                        >
                            {`${prettyUsedData} / ${maxData}`}
                        </Badge>

                        {percentage >= 0 && node.isTrafficTrackingActive && (
                            <Progress
                                color={percentage > 95 ? 'red.9' : 'green.9'}
                                striped
                                radius="md"
                                size="25"
                                value={percentage}
                                w={'10ch'}
                            />
                        )}

                        {node.isTrafficTrackingActive && (
                            <Badge
                                color="gray"
                                radius="md"
                                size="lg"
                                style={{ cursor: 'pointer' }}
                                variant="outline"
                                leftSection={<PiArrowsCounterClockwise size={18} />}
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
