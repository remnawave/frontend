import { ActionIcon, Badge, Box, Checkbox, Group, Stack, Text } from '@mantine/core'
import { PiLock, PiProhibit, PiPulse, PiTag } from 'react-icons/pi'
import { useMediaQuery } from '@mantine/hooks'
import { TbAlertCircle } from 'react-icons/tb'
import { Draggable } from '@hello-pangea/dnd'
import { RiDraggable } from 'react-icons/ri'
import ColorHash from 'color-hash'
import { useState } from 'react'
import cx from 'clsx'

import { useHostsStoreActions, useHostsStoreFilters } from '@entities/dashboard'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const { item, index, configProfiles, isSelected, onSelect } = props

    const filters = useHostsStoreFilters()
    const actions = useHostsStoreActions()
    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useMediaQuery('(max-width: 768px)')

    if (!configProfiles) {
        return null
    }

    const configProfile = configProfiles.find(
        (configProfile) => configProfile.uuid === item.inbound.configProfileUuid
    )

    const isFiltered =
        (!!filters.configProfileUuid && configProfile?.uuid !== filters.configProfileUuid) ||
        (!!filters.inboundUuid && item.inbound.configProfileInboundUuid !== filters.inboundUuid)
    const isHostActive = !item.isDisabled

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

    const handleEdit = () => {
        actions.setHost(item)
        actions.toggleEditModal(true)
    }

    if (isMobile) {
        return (
            <Draggable
                draggableId={item.uuid}
                index={index}
                isDragDisabled={isFiltered}
                key={item.uuid}
            >
                {(provided, snapshot) => (
                    <Box
                        className={cx(classes.item, classes.mobileItem, {
                            [classes.itemDragging]: snapshot.isDragging || isHovered,
                            [classes.filteredItem]: isFiltered,
                            [classes.selectedItem]: isSelected,
                            [classes.danglingItem]: !configProfile?.uuid
                        })}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                    >
                        <Box
                            className={classes.contentArea}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleEdit()
                            }}
                            onTouchEnd={() => setIsHovered(false)}
                            onTouchStart={() => setIsHovered(true)}
                        >
                            <Stack gap="sm">
                                <Group justify="space-between" wrap="nowrap">
                                    <Group gap="sm" wrap="nowrap">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(e) => {
                                                e.stopPropagation()
                                                onSelect?.()
                                            }}
                                            size="md"
                                            styles={{
                                                input: { cursor: 'pointer' }
                                            }}
                                        />
                                        <Box
                                            {...provided.dragHandleProps}
                                            className={classes.mobileDragHandle}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {!isFiltered && <RiDraggable size="1.2rem" />}
                                            {isFiltered && (
                                                <PiLock
                                                    className={classes.lockedIcon}
                                                    size="1.2rem"
                                                />
                                            )}
                                        </Box>
                                    </Group>

                                    <ActionIcon
                                        color={isHostActive ? 'teal' : 'gray'}
                                        radius="md"
                                        size="lg"
                                        variant="light"
                                    >
                                        {isHostActive ? (
                                            <PiPulse size={16} />
                                        ) : (
                                            <PiProhibit size={16} />
                                        )}
                                    </ActionIcon>
                                </Group>

                                <Stack gap="xs">
                                    <Text className={classes.hostName} fw={600} size="lg">
                                        {item.remark}
                                    </Text>

                                    <Text c="dimmed" className={classes.mobileAddress} size="sm">
                                        {item.address}
                                        {item.port ? `:${item.port}` : ''}
                                    </Text>

                                    <Group gap="xs" wrap="wrap">
                                        <Badge
                                            autoContrast
                                            color={
                                                configProfile?.uuid
                                                    ? ch.hex(configProfile.uuid)
                                                    : 'red'
                                            }
                                            leftSection={
                                                configProfile?.uuid ? (
                                                    <XtlsLogo size={12} />
                                                ) : (
                                                    <TbAlertCircle size={12} />
                                                )
                                            }
                                            radius="lg"
                                            size="sm"
                                            variant="light"
                                        >
                                            {configProfile?.name || 'DANGLING'}
                                        </Badge>

                                        {item.inbound.configProfileInboundUuid && (
                                            <Badge
                                                autoContrast
                                                color={ch.hex(
                                                    item.inbound.configProfileInboundUuid
                                                )}
                                                leftSection={<PiTag size={12} />}
                                                radius="lg"
                                                size="sm"
                                                variant="outline"
                                            >
                                                {configProfile?.inbounds.find(
                                                    (inbound) =>
                                                        inbound.uuid ===
                                                        item.inbound.configProfileInboundUuid
                                                )?.tag || 'UNKNOWN'}
                                            </Badge>
                                        )}
                                    </Group>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                )}
            </Draggable>
        )
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
                        [classes.selectedItem]: isSelected,
                        [classes.danglingItem]: !configProfile?.uuid
                    })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <Group gap="md" w="100%" wrap="nowrap">
                        <Group gap="xs" wrap="nowrap">
                            <Checkbox checked={isSelected} onChange={onSelect} size="md" />
                            <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                                {!isFiltered && <RiDraggable color="white" size="1.5rem" />}
                                {isFiltered && (
                                    <PiLock
                                        className={classes.lockedIcon}
                                        color="white"
                                        size="1.5rem"
                                    />
                                )}
                            </Box>
                        </Group>

                        <Box
                            className={classes.contentArea}
                            flex={1}
                            onClick={handleEdit}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Group gap="md" justify="space-between" wrap="nowrap">
                                <Group flex={1} gap="sm" miw={0} wrap="nowrap">
                                    <ActionIcon
                                        color={isHostActive ? 'teal' : 'gray'}
                                        radius="md"
                                        size="md"
                                        variant="light"
                                    >
                                        {isHostActive ? (
                                            <PiPulse size={16} />
                                        ) : (
                                            <PiProhibit size={16} />
                                        )}
                                    </ActionIcon>

                                    <Group gap="md" style={{ flexShrink: 0 }} wrap="nowrap">
                                        <Text fw={600}>{item.remark}</Text>
                                        <Text c="dimmed" className={classes.hostAddress}>
                                            {item.address}
                                            {item.port ? `:${item.port}` : ''}
                                        </Text>
                                    </Group>
                                </Group>
                                <Group gap="md" style={{ flexShrink: 0 }} wrap="nowrap">
                                    {item.inbound.configProfileInboundUuid && (
                                        <Badge
                                            autoContrast
                                            color={ch.hex(item.inbound.configProfileInboundUuid)}
                                            leftSection={<PiTag size={12} />}
                                            radius="md"
                                            size="md"
                                            variant="outline"
                                        >
                                            {configProfile?.inbounds.find(
                                                (inbound) =>
                                                    inbound.uuid ===
                                                    item.inbound.configProfileInboundUuid
                                            )?.tag || 'UNKNOWN'}
                                        </Badge>
                                    )}

                                    <Badge
                                        autoContrast
                                        color={
                                            configProfile?.uuid ? ch.hex(configProfile.uuid) : 'red'
                                        }
                                        leftSection={
                                            configProfile?.uuid ? (
                                                <XtlsLogo size={12} />
                                            ) : (
                                                <TbAlertCircle size={12} />
                                            )
                                        }
                                        radius="md"
                                        size="md"
                                        variant="light"
                                    >
                                        {configProfile?.name || 'DANGLING'}
                                    </Badge>
                                </Group>
                            </Group>
                        </Box>
                    </Group>
                </Box>
            )}
        </Draggable>
    )
}
