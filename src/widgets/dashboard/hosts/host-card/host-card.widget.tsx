import { ActionIcon, Badge, Box, Checkbox, Grid, Group, Text } from '@mantine/core'
import { PiDotsSixVertical, PiLock, PiProhibit, PiPulse } from 'react-icons/pi'
import { Draggable } from '@hello-pangea/dnd'
import ColorHash from 'color-hash'
import { useState } from 'react'
import cx from 'clsx'

import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entities/dashboard'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const { item, index, inbounds, isSelected, onSelect } = props

    const selectedInboundTag = useHostsStoreSelectedInboundTag()
    const actions = useHostsStoreActions()
    const [isHovered, setIsHovered] = useState(false)
    if (!inbounds) {
        return null
    }

    const inbound = inbounds.find((inbound) => inbound.uuid === item.inboundUuid)

    if (!inbound) {
        return null
    }

    const isFiltered = selectedInboundTag !== 'ALL' && inbound.tag !== selectedInboundTag
    const isHostActive = !item.isDisabled

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

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
                        [classes.filteredItem]: isFiltered,
                        [classes.selectedItem]: isSelected
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <Grid align="center" gutter="md">
                        <Grid.Col span={{ base: 2, xs: 2, sm: 1 }}>
                            <Group gap="xs" wrap="nowrap">
                                <Checkbox checked={isSelected} onChange={onSelect} size="md" />

                                <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                                    {!isFiltered && <PiDotsSixVertical color="white" size="2rem" />}
                                    {isFiltered && (
                                        <PiLock
                                            color="white"
                                            size="2rem"
                                            style={{ opacity: 0.5 }}
                                        />
                                    )}
                                </Box>
                            </Group>
                        </Grid.Col>
                    </Grid>
                    <Box
                        onClick={handleEdit}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ cursor: 'pointer', width: '100%' }}
                    >
                        <Grid align="center" gutter="md">
                            <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 4 }}>
                                <Group>
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
                                        radius="md"
                                        size="lg"
                                        style={{
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                        variant="light"
                                    >
                                        {inbound.tag}
                                    </Badge>
                                </Group>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, xs: 12, sm: 6, md: 4 }}>
                                <Text
                                    className={classes.label}
                                    fw={400}
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.remark}
                                </Text>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 3 }}>
                                <Text
                                    className={classes.hostInfoLabel}
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.address}
                                    {item.port ? `:${item.port}` : ''}
                                </Text>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Box>
            )}
        </Draggable>
    )
}
