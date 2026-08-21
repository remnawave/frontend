import { Badge } from '@mantine/core'
import { memo } from 'react'
import {
    PiCloudArrowUpDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiWarningCircle
} from 'react-icons/pi'

import { IInboundNodeAggregate } from './get-inbound-node-status.util'

interface IProps {
    aggregate: IInboundNodeAggregate
}

export const InboundStatusTileWidget = memo(({ aggregate }: IProps) => {
    const { status, onlineNodesCount, totalNodesCount } = aggregate

    let icon: React.ReactNode
    let color = 'gray'

    if (status === 'connected') {
        icon = <PiPulseDuotone size={14} />
        color = 'teal'
    } else if (status === 'connecting') {
        icon = <PiCloudArrowUpDuotone size={14} />
        color = 'yellow'
    } else if (status === 'disconnected') {
        icon = <PiWarningCircle size={14} />
        color = 'red'
    } else {
        icon = <PiProhibitDuotone size={14} />
        color = 'gray'
    }

    return (
        <Badge color={color} leftSection={icon} miw="7ch" size="lg" variant="outline">
            {totalNodesCount > 0 ? `${onlineNodesCount}/${totalNodesCount}` : '—'}
        </Badge>
    )
})
