import { PiCloudCheckDuotone, PiCloudSlashDuotone, PiCloudWarningDuotone } from 'react-icons/pi'
import { Badge, BadgeProps, Tooltip } from '@mantine/core'
import { memo } from 'react'

import {
    TNodeWarpCarrier,
    getNodeWarpStatus,
    getNodeWarpUiState
} from '@shared/api/hooks/nodes/node-warp-contract'

interface IProps extends BadgeProps {
    node: TNodeWarpCarrier
    withText?: boolean
}

export const NodeWarpBadgeWidget = memo(({ node, withText = true, ...rest }: IProps) => {
    const warp = getNodeWarpStatus(node)
    const state = getNodeWarpUiState(warp)

    const Icon = state.isRunning
        ? PiCloudCheckDuotone
        : warp?.lastError
          ? PiCloudWarningDuotone
          : PiCloudSlashDuotone

    return (
        <Tooltip label={state.tooltip} withArrow>
            <Badge
                color={state.color}
                leftSection={<Icon size={14} />}
                miw={withText ? '9ch' : undefined}
                size="lg"
                variant={state.isRunning ? 'light' : 'outline'}
                {...rest}
            >
                {withText ? state.label : state.shortLabel}
            </Badge>
        </Tooltip>
    )
})
