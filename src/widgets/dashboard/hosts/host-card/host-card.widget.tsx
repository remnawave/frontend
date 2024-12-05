import { PiDotsSixVertical, PiLock, PiProhibit, PiPulse } from 'react-icons/pi'
import { ActionIcon, Badge, Box, Group, Text } from '@mantine/core'
import { Draggable } from '@hello-pangea/dnd'
import ColorHash from 'color-hash'
import { useState } from 'react'
import cx from 'clsx'

import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entitites/dashboard'
import { useDSInboundsHashMap } from '@entitites/dashboard/dashboard-store/dashboard-store'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const { item, index } = props
    const inbounds = useDSInboundsHashMap()
    const selectedInboundTag = useHostsStoreSelectedInboundTag()
    const actions = useHostsStoreActions()
    const [isHovered, setIsHovered] = useState(false)
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
            draggableId={item.uuid}
            index={index}
            isDragDisabled={isFiltered}
            key={item.uuid}
        >
            {(provided, snapshot) => (
                <Box
                    className={cx(classes.item, {
                        [classes.itemDragging]: snapshot.isDragging || isHovered,
                        [classes.filteredItem]: isFiltered
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                        {!isFiltered && <PiDotsSixVertical color="white" size="2rem" />}
                        {isFiltered && (
                            <PiLock color="white" size="2rem" style={{ opacity: 0.5 }} />
                        )}
                    </div>

                    <Box
                        onClick={handleEdit}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Group gap="xs">
                            <ActionIcon
                                color={isHostActive ? 'teal' : 'gray'}
                                radius="md"
                                variant="light"
                            >
                                {isHostActive ? (
                                    <PiPulse
                                        size={18}
                                        style={{
                                            color: 'var(--mantine-color-teal-6)'
                                        }}
                                    />
                                ) : (
                                    <PiProhibit
                                        size={18}
                                        style={{
                                            color: 'var(--mantine-color-gray-6)'
                                        }}
                                    />
                                )}
                            </ActionIcon>

                            <Badge
                                autoContrast
                                color={ch.hex(item.inboundUuid)}
                                miw={'15ch'}
                                radius="md"
                                size="lg"
                                variant="light"
                            >
                                {inbound.tag}
                            </Badge>

                            <Text className={classes.label} fw={400} miw={'40ch'}>
                                {item.remark}
                            </Text>

                            <Text className={classes.hostInfoLabel} miw={'40ch'}>
                                {item.address}
                                {item.port ? `:${item.port}` : ''}
                            </Text>
                        </Group>
                    </Box>
                </Box>
            )}
        </Draggable>
    )
}
