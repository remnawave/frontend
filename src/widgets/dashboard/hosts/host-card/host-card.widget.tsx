import { OptimisticSortingPlugin } from '@dnd-kit/dom/sortable'
import { useSortable } from '@dnd-kit/react/sortable'
import {
    ActionIcon,
    Badge,
    Box,
    Checkbox,
    Group,
    px,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    GetHostsCommand,
    GetNodesCommand,
    GetConfigProfilesCommand,
    INTERNAL_SQUADS_MODE,
    SUBSCRIPTION_TEMPLATE_TYPE
} from '@remnawave/backend-contract'
import cx from 'clsx'
import ColorHash from 'color-hash'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiNetwork, PiProhibit, PiPulse } from 'react-icons/pi'
import { RiDraggable } from 'react-icons/ri'
import {
    TbAlertCircle,
    TbCirclesRelation,
    TbCloudNetwork,
    TbEyeOff,
    TbFileDescription,
    TbMask,
    TbStar
} from 'react-icons/tb'
import { generatePath } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { ROUTES } from '@shared/constants'
import { useIsMobile } from '@shared/hooks'
import { XrayLogo } from '@shared/ui/logos'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SingleRowOverflowList } from '@shared/ui/single-row-overflow-list'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'

import classes from './HostCard.module.css'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    index?: number
    isDragOverlay?: boolean
    isSelected?: boolean
    item: GetHostsCommand.Response['response'][number]
    nodesByUuid: Map<string, GetNodesCommand.Response['response'][number]>
    onSelect?: () => void
    viewOnly?: boolean
    disableReordering?: boolean
}

export function HostCardWidget(props: IProps) {
    const {
        nodesByUuid,
        item,
        configProfiles,
        index = 0,
        isSelected,
        onSelect,
        isDragOverlay = false,
        viewOnly = false,

        disableReordering = false
    } = props

    const { t } = useTranslation()

    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useIsMobile()

    const configProfile = configProfiles?.find(
        (configProfile) => configProfile.uuid === item.inbound.configProfileUuid
    )

    const inboundTag = configProfile?.inbounds.find(
        (inbound) => inbound.uuid === item.inbound.configProfileInboundUuid
    )?.tag

    const sortable = useSortable({
        id: item.uuid,
        index,
        disabled: isDragOverlay || disableReordering || viewOnly,
        plugins: (defaults) => defaults.filter((plugin) => plugin !== OptimisticSortingPlugin)
    })

    const isDragging = !isDragOverlay && sortable.isDragging
    const { ref, handleRef } = sortable

    const style: CSSProperties = {
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : 'auto',
        position: 'relative'
    }

    const handleEdit = () => {
        showModal('hosts_editHostDrawer', {
            hostUuid: item.uuid
        })
    }

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
    const hasInternalSquadsRule = item.internalSquads.squads.length > 0
    const isInternalSquadsAllowOnly = item.internalSquads.mode === INTERNAL_SQUADS_MODE.ALLOW_ONLY

    if (isMobile) {
        return (
            <Box
                className={cx(classes.item, classes.mobileItem, {
                    [classes.itemDragging]: isDragging || isHovered,
                    [classes.selectedItem]: isSelected,
                    [classes.danglingItem]: !configProfile?.uuid
                })}
                data-drag-overlay={isDragOverlay}
                ref={isDragOverlay ? undefined : ref}
                style={style}
            >
                <Stack gap="sm">
                    <Group justify="space-between" wrap="nowrap">
                        {!viewOnly && (
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
                                {!disableReordering && (
                                    <Box
                                        className={classes.mobileDragHandle}
                                        onClick={(e) => e.stopPropagation()}
                                        ref={isDragOverlay ? undefined : handleRef}
                                    >
                                        <RiDraggable size={px('1.2rem')} />
                                    </Box>
                                )}
                            </Group>
                        )}

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
                                    size="md"
                                    style={{
                                        paddingLeft: 0
                                    }}
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

                                <SingleRowOverflowList
                                    data={item.tags.sort((a, b) => a.localeCompare(b))}
                                    gap={0}
                                    maxVisibleItems={2}
                                    renderItem={(tag) => (
                                        <Badge
                                            autoContrast
                                            color={ch.hex(tag)}
                                            key={tag}
                                            leftSection={<TbStar size={12} />}
                                            size="md"
                                            style={{
                                                paddingLeft: 0
                                            }}
                                            variant="transparent"
                                        >
                                            {tag}
                                        </Badge>
                                    )}
                                    renderOverflow={(items) => (
                                        <Tooltip
                                            label={
                                                <Stack gap="xs">
                                                    {items.map((tag) => (
                                                        <Badge
                                                            color={ch.hex(tag)}
                                                            fullWidth
                                                            key={tag}
                                                            leftSection={<TbStar size={12} />}
                                                            size="md"
                                                            variant="transparent"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </Stack>
                                            }
                                            multiline
                                            position="top"
                                        >
                                            <Badge color="gray" size="md" variant="transparent">
                                                +{items.length}
                                            </Badge>
                                        </Tooltip>
                                    )}
                                />
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
                [classes.selectedItem]: isSelected,
                [classes.danglingItem]: !configProfile?.uuid
            })}
            data-drag-overlay={isDragOverlay}
            ref={isDragOverlay ? undefined : ref}
            style={style}
        >
            <Group gap="md" w="100%" wrap="nowrap">
                {!viewOnly && (
                    <Group gap="xs" wrap="nowrap">
                        <Checkbox checked={isSelected} onChange={onSelect} size="md" />
                        {!disableReordering && (
                            <Box
                                className={classes.dragHandle}
                                ref={isDragOverlay ? undefined : handleRef}
                            >
                                <RiDraggable color="white" size="24px" />
                            </Box>
                        )}
                    </Group>
                )}

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
                            {hasInternalSquadsRule && (
                                <Tooltip
                                    label={
                                        isInternalSquadsAllowOnly
                                            ? t('base-host-form.allowed-internal-squads')
                                            : t('base-host-form.excluded-internal-squads')
                                    }
                                >
                                    <ThemeIcon
                                        color={isInternalSquadsAllowOnly ? 'teal' : 'yellow'}
                                        size={28}
                                        variant="soft"
                                    >
                                        <TbCirclesRelation size={16} />
                                    </ThemeIcon>
                                </Tooltip>
                            )}

                            <Tooltip label={t('base-host-form.xray-json-template')}>
                                <ActionIcon
                                    color={hasXrayJsonTemplate ? 'teal' : 'gray'}
                                    size={28}
                                    onClick={(e) => {
                                        if (!item.xrayJsonTemplateUuid) return
                                        e.stopPropagation()
                                        window.open(
                                            generatePath(
                                                ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR,
                                                {
                                                    type: SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON,
                                                    uuid: item.xrayJsonTemplateUuid
                                                }
                                            ),
                                            '_blank'
                                        )
                                    }}
                                    variant="soft"
                                >
                                    <XrayLogo size={16} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Mux">
                                <ActionIcon
                                    color={hasMuxParams ? 'teal' : 'gray'}
                                    size={28}
                                    variant="soft"
                                    onClick={(e) => {
                                        if (!item.muxParams) return
                                        e.stopPropagation()
                                        modals.open({
                                            children: (
                                                <JsonEditor
                                                    collapse={3}
                                                    data={JSON.parse(
                                                        JSON.stringify(item.muxParams)
                                                    )}
                                                    indent={2}
                                                    maxWidth="100%"
                                                    rootName=""
                                                    theme={githubDarkTheme}
                                                    viewOnly
                                                />
                                            ),
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="shaded-gray"
                                                    IconComponent={TbCloudNetwork}
                                                    iconVariant="soft"
                                                    title="Mux Params"
                                                />
                                            ),
                                            size: 'xl'
                                        })
                                    }}
                                >
                                    <TbCloudNetwork size={16} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Final Mask">
                                <ActionIcon
                                    color={hasFinalMask ? 'teal' : 'gray'}
                                    size={28}
                                    variant="soft"
                                    onClick={(e) => {
                                        if (!item.finalMask) return
                                        e.stopPropagation()
                                        modals.open({
                                            children: (
                                                <JsonEditor
                                                    collapse={3}
                                                    data={JSON.parse(
                                                        JSON.stringify(item.finalMask)
                                                    )}
                                                    indent={2}
                                                    maxWidth="100%"
                                                    rootName=""
                                                    theme={githubDarkTheme}
                                                    viewOnly
                                                />
                                            ),
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="shaded-gray"
                                                    IconComponent={TbMask}
                                                    iconVariant="soft"
                                                    title="Final Mask"
                                                />
                                            ),
                                            size: 'xl'
                                        })
                                    }}
                                >
                                    <TbMask size={16} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="SockOpt">
                                <ActionIcon
                                    color={hasSockoptParams ? 'teal' : 'gray'}
                                    size={28}
                                    variant="soft"
                                    onClick={(e) => {
                                        if (!item.sockoptParams) return
                                        e.stopPropagation()
                                        modals.open({
                                            children: (
                                                <JsonEditor
                                                    collapse={3}
                                                    data={JSON.parse(
                                                        JSON.stringify(item.sockoptParams)
                                                    )}
                                                    indent={2}
                                                    maxWidth="100%"
                                                    rootName=""
                                                    theme={githubDarkTheme}
                                                    viewOnly
                                                />
                                            ),
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="shaded-gray"
                                                    IconComponent={PiNetwork}
                                                    iconVariant="soft"
                                                    title="SockOpt Params"
                                                />
                                            ),
                                            size: 'xl'
                                        })
                                    }}
                                >
                                    <PiNetwork size={16} />
                                </ActionIcon>
                            </Tooltip>
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
                                style={{
                                    paddingLeft: 0
                                }}
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

                            <SingleRowOverflowList
                                data={item.tags.sort((a, b) => a.localeCompare(b))}
                                gap={0}
                                maxVisibleItems={2}
                                renderItem={(tag) => (
                                    <Badge
                                        autoContrast
                                        color={ch.hex(tag)}
                                        key={tag}
                                        leftSection={<TbStar size={12} />}
                                        size="md"
                                        variant="transparent"
                                    >
                                        {tag}
                                    </Badge>
                                )}
                                renderOverflow={(items) => (
                                    <Tooltip
                                        label={
                                            <Stack gap="xs">
                                                {items.map((tag) => (
                                                    <Badge
                                                        color={ch.hex(tag)}
                                                        fullWidth
                                                        key={tag}
                                                        leftSection={<TbStar size={12} />}
                                                        size="md"
                                                        variant="transparent"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        }
                                        multiline
                                        position="top"
                                    >
                                        <Badge color="gray" size="md" variant="transparent">
                                            +{items.length}
                                        </Badge>
                                    </Tooltip>
                                )}
                            />

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
                            <SingleRowOverflowList
                                data={item.nodes
                                    .map((nodeId) => nodesByUuid.get(nodeId))
                                    .filter((n): n is NonNullable<typeof n> => Boolean(n))}
                                gap={4}
                                maxVisibleItems={3}
                                renderItem={(node) => (
                                    <Badge
                                        autoContrast
                                        color="gray"
                                        key={`${node.uuid}|${item.uuid}`}
                                        leftSection={resolveCountryCode(node.countryCode, 18)}
                                        size="md"
                                        style={{ cursor: 'pointer' }}
                                        variant="soft"
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
                                                        variant="soft"
                                                    >
                                                        {node.name}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        }
                                        multiline
                                        position="top"
                                    >
                                        <Badge color="gray" size="md" variant="soft">
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
