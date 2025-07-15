import { ActionIcon, Badge, Box, Checkbox, Group, px, Stack, Text } from '@mantine/core'
import { PiLock, PiProhibit, PiPulse, PiTag } from 'react-icons/pi'
import { CSSProperties, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useMediaQuery } from '@mantine/hooks'
import { TbAlertCircle } from 'react-icons/tb'
import { RiDraggable } from 'react-icons/ri'
import { CSS } from '@dnd-kit/utilities'
import ColorHash from 'color-hash'
import cx from 'clsx'

import { useHostsStoreActions, useHostsStoreFilters } from '@entities/dashboard'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const {
        item,
        configProfiles,
        isSelected,
        onSelect,
        isDragOverlay = false,
        isHighlighted = false
    } = props

    const filters = useHostsStoreFilters()
    const actions = useHostsStoreActions()
    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useMediaQuery('(max-width: 48em)')

    const configProfile = configProfiles?.find(
        (configProfile) => configProfile.uuid === item.inbound.configProfileUuid
    )

    const isFiltered =
        (!!filters.configProfileUuid && configProfile?.uuid !== filters.configProfileUuid) ||
        (!!filters.inboundUuid && item.inbound.configProfileInboundUuid !== filters.inboundUuid)

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.uuid,
        disabled: isDragOverlay || isFiltered
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : 'auto',
        position: 'relative'
    }

    if (!configProfiles) {
        return null
    }

    const isHostActive = !item.isDisabled

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

    const handleEdit = () => {
        actions.setHost(item)
        actions.toggleEditModal(true)
    }

    if (isMobile) {
        return (
            <Box
                className={cx(classes.item, classes.mobileItem, {
                    [classes.highlightedItem]: isHighlighted,
                    [classes.itemDragging]: isDragging || isHovered,
                    [classes.filteredItem]: isFiltered,
                    [classes.selectedItem]: isSelected,
                    [classes.danglingItem]: !configProfile?.uuid
                })}
                data-dnd-overlay={isDragOverlay}
                ref={isDragOverlay ? undefined : setNodeRef}
                style={style}
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
                                    {...(isDragOverlay ? {} : attributes)}
                                    {...(isDragOverlay ? {} : listeners)}
                                    className={classes.mobileDragHandle}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {!isFiltered && <RiDraggable size={px('1.2rem')} />}
                                    {isFiltered && (
                                        <PiLock
                                            className={classes.lockedIcon}
                                            size={px('1.2rem')}
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
                                {isHostActive ? <PiPulse size={16} /> : <PiProhibit size={16} />}
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

                            <Stack gap="xs">
                                <Badge
                                    autoContrast
                                    color={configProfile?.uuid ? ch.hex(configProfile.uuid) : 'red'}
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

                                <Badge
                                    autoContrast
                                    color={ch.hex(
                                        item.inbound.configProfileInboundUuid || 'dangling'
                                    )}
                                    leftSection={<PiTag size={12} />}
                                    radius="lg"
                                    size="sm"
                                    variant="outline"
                                >
                                    {configProfile?.inbounds.find(
                                        (inbound) =>
                                            inbound.uuid === item.inbound.configProfileInboundUuid
                                    )?.tag || 'UNKNOWN'}
                                </Badge>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            className={cx(classes.item, {
                [classes.itemDragging]: isDragging || isHovered,
                [classes.filteredItem]: isFiltered,
                [classes.selectedItem]: isSelected,
                [classes.danglingItem]: !configProfile?.uuid,
                [classes.highlightedItem]: isHighlighted
            })}
            data-dnd-overlay={isDragOverlay}
            ref={isDragOverlay ? undefined : setNodeRef}
            style={style}
        >
            <Group gap="md" w="100%" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                    <Checkbox checked={isSelected} onChange={onSelect} size="md" />
                    <Box
                        {...(isDragOverlay ? {} : attributes)}
                        {...(isDragOverlay ? {} : listeners)}
                        className={classes.dragHandle}
                    >
                        {!isFiltered && <RiDraggable color="white" size="24px" />}
                        {isFiltered && (
                            <PiLock className={classes.lockedIcon} color="white" size="24px" />
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
                        <Group
                            flex={1}
                            gap="sm"
                            miw={0}
                            style={{ overflow: 'hidden' }}
                            wrap="nowrap"
                        >
                            <ActionIcon
                                color={isHostActive ? 'teal' : 'gray'}
                                radius="md"
                                size="md"
                                style={{ flexShrink: 0 }}
                                variant="light"
                            >
                                {isHostActive ? <PiPulse size={16} /> : <PiProhibit size={16} />}
                            </ActionIcon>

                            <Group gap="md" style={{ flexShrink: 1, minWidth: 0 }} wrap="nowrap">
                                <Text fw={600} style={{ flexShrink: 0 }} truncate>
                                    {item.remark}
                                </Text>
                                <Text
                                    c="dimmed"
                                    className={classes.hostAddress}
                                    style={{ flexShrink: 1, minWidth: 0 }}
                                    truncate
                                >
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
                                            inbound.uuid === item.inbound.configProfileInboundUuid
                                    )?.tag || 'UNKNOWN'}
                                </Badge>
                            )}

                            <Badge
                                autoContrast
                                color={configProfile?.uuid ? ch.hex(configProfile.uuid) : 'red'}
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
    )
}
