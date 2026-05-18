import {
    ActionIcon,
    Badge,
    Box,
    Checkbox,
    Group,
    OverflowList,
    px,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import {
    TbAlertCircle,
    TbCirclesRelation,
    TbCloudNetwork,
    TbEyeOff,
    TbFileDescription,
    TbMask,
    TbTagStarred
} from 'react-icons/tb'
import { PiLock, PiNetwork, PiProhibit, PiPulse, PiTag } from 'react-icons/pi'
import { CSSProperties, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { useMediaQuery } from '@mantine/hooks'
import { RiDraggable } from 'react-icons/ri'
import { CSS } from '@dnd-kit/utilities'
import ColorHash from 'color-hash'
import cx from 'clsx'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { useHostsStoreFilters } from '@entities/dashboard'
import { XrayLogo } from '@shared/ui/logos'

import classes from './HostCard.module.css'
import { IProps } from './interfaces'

export function HostCardWidget(props: IProps) {
    const {
        nodesByUuid,
        item,
        configProfiles,
        isSelected,
        onSelect,
        isDragOverlay = false,
        isHighlighted = false
    } = props

    const [searchParams, setSearchParams] = useSearchParams()

    const filters = useHostsStoreFilters()

    const openModalWithData = useModalsStoreOpenWithData()

    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useMediaQuery('(max-width: 48em)')

    const configProfile = configProfiles?.find(
        (configProfile) => configProfile.uuid === item.inbound.configProfileUuid
    )

    const inboundTag = configProfile?.inbounds.find(
        (inbound) => inbound.uuid === item.inbound.configProfileInboundUuid
    )?.tag

    const isFiltered =
        (!!filters.configProfileUuid && configProfile?.uuid !== filters.configProfileUuid) ||
        (!!filters.inboundUuid && item.inbound.configProfileInboundUuid !== filters.inboundUuid) ||
        (!!filters.hostTag && item.tag !== filters.hostTag)

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

    const handleEdit = () => {
        openModalWithData(MODALS.EDIT_HOST_MODAL, item)
    }

    useEffect(() => {
        if (searchParams.get(SEARCH_PARAMS.HOST) === item.uuid) {
            handleEdit()

            searchParams.delete(SEARCH_PARAMS.HOST)
            setSearchParams(searchParams)
        }
    }, [searchParams])

    if (!configProfiles) {
        return null
    }

    const isHostActive = !item.isDisabled

    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

    const isParamSet = (value: unknown): boolean => {
        if (value == null) return false
        if (typeof value === 'string') return value.trim().length > 0
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object') return Object.keys(value as object).length > 0
        return true
    }

    const hasFinalMask = isParamSet(item.finalMask)
    const hasMuxParams = isParamSet(item.muxParams)
    const hasSockoptParams = isParamSet(item.sockoptParams)
    const hasXrayJsonTemplate = !!item.xrayJsonTemplateUuid
    const serverDescription = item.serverDescription?.trim() || ''
    const hasExcludedSquads = item.excludedInternalSquads.length > 0

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
                                    <PiLock className={classes.lockedIcon} size={px('1.2rem')} />
                                )}
                            </Box>
                        </Group>

                        <Group gap="xs">
                            {item.tag && (
                                <Badge
                                    autoContrast
                                    color={ch.hex(item.tag)}
                                    leftSection={<TbTagStarred size={12} />}
                                    size="md"
                                    variant="outline"
                                >
                                    {item.tag}
                                </Badge>
                            )}
                        </Group>

                        {!isHostActive && (
                            <ActionIcon
                                color="gray"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <PiProhibit size={16} />
                            </ActionIcon>
                        )}

                        {isHostActive && item.isHidden && (
                            <ActionIcon
                                color="violet"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <TbEyeOff size={16} />
                            </ActionIcon>
                        )}

                        {isHostActive && !item.isHidden && (
                            <ActionIcon
                                color="teal"
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="soft"
                            >
                                <PiPulse size={16} />
                            </ActionIcon>
                        )}
                    </Group>

                    <Box
                        className={classes.contentArea}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit()
                        }}
                        onTouchEnd={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                    >
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
                                            <XrayLogo size={12} />
                                        ) : (
                                            <TbAlertCircle size={12} />
                                        )
                                    }
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
                                    size="sm"
                                    variant="outline"
                                >
                                    {inboundTag || 'UNKNOWN'}
                                </Badge>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
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

                <Stack
                    className={classes.contentArea}
                    flex={1}
                    gap={6}
                    miw={0}
                    onClick={handleEdit}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Group
                        gap="sm"
                        justify="space-between"
                        miw={0}
                        style={{ overflow: 'hidden' }}
                        wrap="nowrap"
                    >
                        <Group
                            gap="sm"
                            miw={0}
                            style={{ flexShrink: 1, overflow: 'hidden' }}
                            wrap="nowrap"
                        >
                            {!isHostActive && (
                                <ActionIcon
                                    color="gray"
                                    size="md"
                                    style={{ flexShrink: 0 }}
                                    variant="soft"
                                >
                                    <PiProhibit size={16} />
                                </ActionIcon>
                            )}

                            {isHostActive && item.isHidden && (
                                <ActionIcon
                                    color="violet"
                                    size="md"
                                    style={{ flexShrink: 0 }}
                                    variant="soft"
                                >
                                    <TbEyeOff size={16} />
                                </ActionIcon>
                            )}

                            {isHostActive && !item.isHidden && (
                                <ActionIcon
                                    color="teal"
                                    size="md"
                                    style={{ flexShrink: 0 }}
                                    variant="soft"
                                >
                                    <PiPulse size={16} />
                                </ActionIcon>
                            )}

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

                        <Group gap={6} style={{ flexShrink: 0 }} wrap="nowrap">
                            {hasExcludedSquads && (
                                <ThemeIcon color="yellow" size={28} variant="soft">
                                    <TbCirclesRelation size={16} />
                                </ThemeIcon>
                            )}

                            <ThemeIcon
                                color={hasXrayJsonTemplate ? 'teal' : 'gray'}
                                size={28}
                                variant="soft"
                            >
                                <XrayLogo size={16} />
                            </ThemeIcon>

                            <ThemeIcon
                                color={hasMuxParams ? 'teal' : 'gray'}
                                size={28}
                                variant="soft"
                            >
                                <TbCloudNetwork size={16} />
                            </ThemeIcon>

                            <ThemeIcon
                                color={hasSockoptParams ? 'teal' : 'gray'}
                                size={28}
                                variant="soft"
                            >
                                <PiNetwork size={16} />
                            </ThemeIcon>

                            <ThemeIcon
                                color={hasFinalMask ? 'teal' : 'gray'}
                                size={28}
                                variant="soft"
                            >
                                <TbMask size={16} />
                            </ThemeIcon>
                        </Group>
                    </Group>

                    <Group
                        gap="xs"
                        justify="space-between"
                        miw={0}
                        style={{ overflow: 'hidden' }}
                        wrap="nowrap"
                    >
                        <Group
                            gap={0}
                            miw={0}
                            style={{ flexShrink: 1, overflow: 'hidden' }}
                            wrap="nowrap"
                        >
                            <Badge
                                autoContrast
                                color={configProfile?.uuid ? ch.hex(configProfile.uuid) : 'red'}
                                leftSection={
                                    configProfile?.uuid ? (
                                        <XrayLogo size={12} />
                                    ) : (
                                        <TbAlertCircle size={12} />
                                    )
                                }
                                size="md"
                                variant="transparent"
                            >
                                {configProfile?.name || 'DANGLING'}
                                {item.inbound.configProfileInboundUuid && (
                                    <>
                                        <span style={{ margin: '0 6px', opacity: 0.5 }}>›</span>
                                        <span style={{ opacity: 0.75 }}>
                                            {inboundTag || 'UNKNOWN'}
                                        </span>
                                    </>
                                )}
                            </Badge>

                            {item.tag && (
                                <Badge
                                    autoContrast
                                    color={ch.hex(item.tag)}
                                    leftSection={<TbTagStarred size={12} />}
                                    size="md"
                                    variant="transparent"
                                >
                                    {item.tag}
                                </Badge>
                            )}

                            {serverDescription && (
                                <Badge
                                    color="dark.3"
                                    leftSection={<TbFileDescription size={12} />}
                                    size="md"
                                    style={{
                                        fontStyle: 'italic',
                                        fontWeight: 500,
                                        letterSpacing: '1px'
                                    }}
                                    variant="transparent"
                                >
                                    {serverDescription}
                                </Badge>
                            )}
                        </Group>

                        <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                            <OverflowList
                                data={item.nodes
                                    .map((nodeId) => nodesByUuid.get(nodeId))
                                    .filter((n): n is NonNullable<typeof n> => Boolean(n))}
                                gap={4}
                                maxRows={1}
                                maxVisibleItems={3}
                                renderItem={(node) => (
                                    <Badge
                                        autoContrast
                                        color="gray"
                                        key={`${node.uuid}|${item.uuid}`}
                                        leftSection={resolveCountryCode(node.countryCode, 18)}
                                        size="md"
                                        style={{ cursor: 'pointer' }}
                                        variant="default"
                                    >
                                        {node.name}
                                    </Badge>
                                )}
                                renderOverflow={(items) => (
                                    <Tooltip
                                        label={
                                            <Stack gap="xs">
                                                {items.map((node) => (
                                                    <Badge
                                                        color="gray"
                                                        fullWidth
                                                        key={`${node.uuid}|${item.uuid}`}
                                                        leftSection={resolveCountryCode(
                                                            node.countryCode,
                                                            18
                                                        )}
                                                        variant="default"
                                                    >
                                                        {node.name}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        }
                                        multiline
                                        position="top"
                                    >
                                        <Badge color="gray" size="md" variant="default">
                                            +{items.length}
                                        </Badge>
                                    </Tooltip>
                                )}
                            />
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </Box>
    )
}
