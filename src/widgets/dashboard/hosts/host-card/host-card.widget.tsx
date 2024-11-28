import { Badge, Group, Text } from '@mantine/core'
import { useDSInboundsHashMap } from '@entitites/dashboard/dashboard-store/dashboard-store'
import { Draggable } from '@hello-pangea/dnd'
import cx from 'clsx'
import ColorHash from 'color-hash'
import { PiDotsSixVertical } from 'react-icons/pi'
import { IProps } from './interfaces'
import classes from './HostCard.module.css'

export function HostCardWidget(props: IProps) {
    const { item, index } = props
    const inbounds = useDSInboundsHashMap()

    if (!inbounds) {
        return null
    }

    const inbound = inbounds.get(item.inboundUuid)

    if (!inbound) {
        return null
    }

    const ch = new ColorHash()

    return (
        <Draggable key={item.uuid} index={index} draggableId={item.uuid}>
            {(provided, snapshot) => (
                <div
                    className={cx(classes.item, {
                        [classes.itemDragging]: snapshot.isDragging
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        <PiDotsSixVertical size="2rem" color="white" />
                    </div>

                    <div>
                        <Group>
                            <Badge
                                miw={'15ch'}
                                size="lg"
                                autoContrast
                                variant="light"
                                radius="md"
                                color={ch.hex(item.inboundUuid)}
                            >
                                {inbound.tag}
                            </Badge>
                            <Text fw={400} miw={'30ch'} c={'white'}>
                                {item.remark}
                            </Text>
                            <Text c="dimmed" size="sm">
                                {item.address}
                                {item.port ? `:${item.port}` : ''}
                            </Text>
                        </Group>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
