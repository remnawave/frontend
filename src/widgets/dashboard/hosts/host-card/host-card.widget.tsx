import { Badge, Button, Container, Flex, Group, Text } from '@mantine/core'
import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entitites/dashboard'
import { useDSInboundsHashMap } from '@entitites/dashboard/dashboard-store/dashboard-store'
import { Draggable } from '@hello-pangea/dnd'
import cx from 'clsx'
import ColorHash from 'color-hash'
import {
    PiDotsSixVertical,
    PiHandDuotone,
    PiLock,
    PiPencil,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiTrash
} from 'react-icons/pi'
import { IProps } from './interfaces'
import classes from './HostCard.module.css'

export function HostCardWidget(props: IProps) {
    const { item, index } = props
    const inbounds = useDSInboundsHashMap()
    const selectedInboundTag = useHostsStoreSelectedInboundTag()
    const actions = useHostsStoreActions()
    if (!inbounds) {
        return null
    }

    const inbound = inbounds.get(item.inboundUuid)

    if (!inbound) {
        return null
    }

    const isFiltered = selectedInboundTag !== 'ALL' && inbound.tag !== selectedInboundTag
    const isHostActive = !item.isDisabled

    const ch = new ColorHash()

    const handleEdit = () => {
        actions.setHost(item)
        actions.toggleEditModal(true)
    }

    return (
        <Draggable
            key={item.uuid}
            index={index}
            draggableId={item.uuid}
            isDragDisabled={isFiltered}
        >
            {(provided, snapshot) => (
                <>
                    <div
                        className={cx(classes.item, {
                            [classes.itemDragging]: snapshot.isDragging,
                            [classes.filteredItem]: isFiltered
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <div {...provided.dragHandleProps} className={classes.dragHandle}>
                            {!isFiltered && <PiDotsSixVertical size="2rem" color="white" />}
                            {isFiltered && (
                                <PiLock size="2rem" color="white" style={{ opacity: 0.5 }} />
                            )}
                        </div>

                        <div>
                            <Group gap="xs">
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
                                <Text fw={400} miw={'40ch'} className={classes.label}>
                                    {item.remark}
                                </Text>
                                <Text miw={'40ch'} className={classes.hostInfoLabel}>
                                    {item.address}
                                    {item.port ? `:${item.port}` : ''}
                                </Text>

                                <Group gap="xs" justify="flex-end">
                                    <Button
                                        onClick={handleEdit}
                                        variant="outline"
                                        size="xs"
                                        color="teal"
                                        radius="md"
                                        leftSection={<PiPencil size="1rem" />}
                                    >
                                        Edit
                                    </Button>

                                    <Badge
                                        color={isHostActive ? 'teal' : 'gray'}
                                        leftSection={
                                            isHostActive ? (
                                                <PiPulseDuotone
                                                    size={18}
                                                    style={{
                                                        color: 'var(--mantine-color-teal-6)'
                                                    }}
                                                />
                                            ) : (
                                                <PiProhibitDuotone
                                                    size={18}
                                                    style={{
                                                        color: 'var(--mantine-color-gray-6)'
                                                    }}
                                                />
                                            )
                                        }
                                        variant="outline"
                                        size="lg"
                                    >
                                        {isHostActive ? 'Visible' : 'Disabled'}
                                    </Badge>
                                </Group>
                            </Group>
                        </div>
                    </div>
                </>
            )}
        </Draggable>
    )
}
