import { PiDotsSixVertical, PiLock, PiProhibit, PiPulse, PiTag } from 'react-icons/pi'
import { ActionIcon, Badge, Box, Checkbox, Group, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { TbAlertCircle } from 'react-icons/tb'
import { Draggable } from '@hello-pangea/dnd'
import ColorHash from 'color-hash'
import { useState } from 'react'
import cx from 'clsx'

import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entities/dashboard'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const { item, index, configProfiles, isSelected, onSelect } = props

    const selectedInboundTag = useHostsStoreSelectedInboundTag()
    const actions = useHostsStoreActions()
    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useMediaQuery('(max-width: 768px)')

    if (!configProfiles) {
        return null
    }

    const configProfile = configProfiles.find(
        (configProfile) => configProfile.uuid === item.configProfileUuid
    )

    const isFiltered = selectedInboundTag !== 'ALL' && configProfile?.uuid !== selectedInboundTag
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
                        <Stack gap="sm">
                            <Group justify="space-between" wrap="nowrap">
                                <Group gap="xs" wrap="nowrap">
                                    <Checkbox checked={isSelected} onChange={onSelect} size="lg" />
                                    <Box
                                        {...provided.dragHandleProps}
                                        className={classes.dragHandle}
                                    >
                                        {!isFiltered && (
                                            <PiDotsSixVertical color="white" size="1.5rem" />
                                        )}
                                        {isFiltered && (
                                            <PiLock
                                                className={classes.lockedIcon}
                                                color="white"
                                                size="1.5rem"
                                            />
                                        )}
                                    </Box>
                                </Group>

                                <ActionIcon
                                    color={isHostActive ? 'teal' : 'gray'}
                                    radius="md"
                                    size="xl"
                                    variant="light"
                                >
                                    {isHostActive ? (
                                        <PiPulse size={20} />
                                    ) : (
                                        <PiProhibit size={20} />
                                    )}
                                </ActionIcon>
                            </Group>

                            <Box
                                className={classes.contentArea}
                                onClick={handleEdit}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Stack gap="xs">
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
                                                    <XtlsLogo size={16} />
                                                ) : (
                                                    <TbAlertCircle size={16} />
                                                )
                                            }
                                            radius="md"
                                            size="lg"
                                            variant="light"
                                        >
                                            {configProfile?.name || 'DANGLING'}
                                        </Badge>

                                        {item.configProfileInboundUuid && (
                                            <Badge
                                                autoContrast
                                                color={ch.hex(item.configProfileInboundUuid)}
                                                leftSection={<PiTag size={16} />}
                                                radius="md"
                                                size="lg"
                                                variant="outline"
                                            >
                                                {configProfile?.inbounds.find(
                                                    (inbound) =>
                                                        inbound.uuid ===
                                                        item.configProfileInboundUuid
                                                )?.tag || 'UNKNOWN'}
                                            </Badge>
                                        )}
                                    </Group>

                                    <Text fw={600} size="lg">
                                        {item.remark}
                                    </Text>

                                    <Text c="dimmed" className={classes.mobileAddress} size="sm">
                                        {item.address}
                                        {item.port ? `:${item.port}` : ''}
                                    </Text>
                                </Stack>
                            </Box>
                        </Stack>
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
                                {!isFiltered && <PiDotsSixVertical color="white" size="1.5rem" />}
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
                                        size="lg"
                                        variant="light"
                                    >
                                        {isHostActive ? (
                                            <PiPulse size={18} />
                                        ) : (
                                            <PiProhibit size={18} />
                                        )}
                                    </ActionIcon>

                                    <Group flex={1} gap="xs" miw={0} wrap="nowrap">
                                        <Badge
                                            autoContrast
                                            color={
                                                configProfile?.uuid
                                                    ? ch.hex(configProfile.uuid)
                                                    : 'red'
                                            }
                                            leftSection={
                                                configProfile?.uuid ? (
                                                    <XtlsLogo size={14} />
                                                ) : (
                                                    <TbAlertCircle size={14} />
                                                )
                                            }
                                            radius="md"
                                            size="lg"
                                            variant="light"
                                        >
                                            {configProfile?.name || 'DANGLING'}
                                        </Badge>

                                        {item.configProfileInboundUuid && (
                                            <Badge
                                                autoContrast
                                                color={ch.hex(item.configProfileInboundUuid)}
                                                leftSection={<PiTag size={14} />}
                                                radius="md"
                                                size="lg"
                                                variant="outline"
                                            >
                                                {configProfile?.inbounds.find(
                                                    (inbound) =>
                                                        inbound.uuid ===
                                                        item.configProfileInboundUuid
                                                )?.tag || 'UNKNOWN'}
                                            </Badge>
                                        )}
                                    </Group>
                                </Group>

                                <Group gap="md" style={{ flexShrink: 0 }} wrap="nowrap">
                                    <Text c="dimmed" className={classes.hostAddress}>
                                        {item.address}
                                        {item.port ? `:${item.port}` : ''}
                                    </Text>

                                    <Text fw={600}>{item.remark}</Text>
                                </Group>
                            </Group>
                        </Box>
                    </Group>
                </Box>
            )}
        </Draggable>
    )
}
