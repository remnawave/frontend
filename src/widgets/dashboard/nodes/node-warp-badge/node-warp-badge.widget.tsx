import { PiCloudCheckDuotone, PiCloudSlashDuotone, PiCloudWarningDuotone } from 'react-icons/pi'
import { Badge, BadgeProps, Tooltip } from '@mantine/core'
import { memo } from 'react'

import {
    getNodeWarpStatus,
    getNodeWarpUiState,
    TNodeWarpCarrier
} from '@shared/api/hooks/nodes/node-warp-contract'

interface IProps extends BadgeProps {
    node: TNodeWarpCarrier
    withText?: boolean
}

export const NodeWarpBadgeWidget = memo(({ node, withText = true, ...rest }: IProps) => {
    const warp = getNodeWarpStatus(node)
    const state = getNodeWarpUiState(warp)

    let Icon = PiCloudSlashDuotone
    if (state.isRunning) {
        Icon = PiCloudCheckDuotone
    } else if (warp?.lastError) {
        Icon = PiCloudWarningDuotone
    }

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
