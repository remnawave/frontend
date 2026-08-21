import { Badge, Box, Flex, Text } from '@mantine/core'
import { GetAllInboundsCommand } from '@remnawave/backend-contract'
import {
    getInboundCardColors,
    IInboundNodeAggregate
} from '@widgets/dashboard/inbounds/inbound-status-tile/get-inbound-node-status.util'
import { InboundStatusTileWidget } from '@widgets/dashboard/inbounds/inbound-status-tile/inbound-status-tile.widget'
import ColorHash from 'color-hash'
import { memo, useMemo } from 'react'
import { PiUsersDuotone } from 'react-icons/pi'
import { TbCirclesRelation, TbTag } from 'react-icons/tb'

import { formatInt } from '@shared/utils/misc'

import classes from './InboundCard.module.css'

type Inbound = GetAllInboundsCommand.Response['response']['inbounds'][number]

interface IProps {
    inbound: Inbound
    isMobile: boolean
    profileName: string | undefined
    nodeAggregate: IInboundNodeAggregate
    onOpenRawInbound: (inbound: Inbound) => void
    onOpenUsage: (inbound: Inbound) => void
}

export const InboundCardWidget = memo((props: IProps) => {
    const { inbound, isMobile, profileName, nodeAggregate, onOpenRawInbound, onOpenUsage } = props

    const colorHash = useMemo(() => new ColorHash({ lightness: 0.7, saturation: 0.6 }), [])
    const isOnline = inbound.onlineUsersCount > 0
    const { backgroundColor, borderColor, boxShadow } = getInboundCardColors(nodeAggregate.status)

    const onlineBadge = (
        <Badge
            color={isOnline ? 'teal' : 'gray'}
            leftSection={<PiUsersDuotone size={14} />}
            miw="7ch"
            size="lg"
            variant="outline"
        >
            {formatInt(inbound.onlineUsersCount)}
        </Badge>
    )

    const tagButton = (
        <Box
            onClick={(event) => {
                event.stopPropagation()
                onOpenRawInbound(inbound)
            }}
            style={{
                alignItems: 'center',
                background: colorHash.hex(inbound.tag),
                borderRadius: 'var(--mantine-radius-md)',
                cursor: 'pointer',
                display: 'flex',
                flexShrink: 0,
                height: 28,
                justifyContent: 'center',
                width: 28
            }}
        >
            <TbTag color="var(--mantine-color-dark-8)" size={18} />
        </Box>
    )

    return (
        <Box
            className={classes.inboundRow}
            onClick={() => onOpenUsage(inbound)}
            style={{
                background: `linear-gradient(135deg, ${backgroundColor} 0%, var(--mantine-color-dark-7) 100%)`,
                borderColor,
                boxShadow
            }}
        >
            {!isMobile && (
                <div className={classes.desktopGrid}>
                    <div>
                        <Flex align="center" gap="sm">
                            <InboundStatusTileWidget aggregate={nodeAggregate} />
                            {onlineBadge}
                            {tagButton}
                            <Flex align="center" className={classes.nameContainer} gap="xs">
                                <Text className={classes.inboundName} fw={600} size="md">
                                    {inbound.tag}
                                </Text>
                            </Flex>
                            <Badge size="sm" variant="outline">
                                {inbound.type}
                            </Badge>
                        </Flex>
                    </div>

                    <div>
                        <Text c="dimmed" size="sm" truncate="end">
                            {profileName ?? inbound.profileUuid}
                        </Text>
                    </div>

                    <div>
                        <Flex align="center" gap={4}>
                            <TbCirclesRelation className={classes.icon} size={14} />
                            <Text c="dimmed" size="sm">
                                {inbound.activeSquads.length}
                            </Text>
                        </Flex>
                    </div>
                </div>
            )}

            {isMobile && (
                <Box>
                    <Flex align="center" gap="sm" mb="xs">
                        <InboundStatusTileWidget aggregate={nodeAggregate} />
                        {onlineBadge}
                        <Flex align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                            <Text className={classes.inboundName} fw={600} size="sm">
                                {inbound.tag}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex align="center" gap="xs" justify="space-between">
                        <Badge size="sm" variant="outline">
                            {inbound.type}
                        </Badge>
                        <Text c="dimmed" size="xs" truncate="end">
                            {profileName ?? inbound.profileUuid}
                        </Text>
                        <Flex align="center" gap={4}>
                            <TbCirclesRelation className={classes.icon} size={14} />
                            <Text c="dimmed" size="xs">
                                {inbound.activeSquads.length}
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            )}
        </Box>
    )
})
