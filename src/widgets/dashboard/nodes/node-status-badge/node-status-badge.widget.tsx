import { Badge } from '@mantine/core'
import {
    PiProhibitDuotone,
    PiPulse,
    PiPulseDuotone,
    PiWarningCircle,
    PiWarningCircleDuotone
} from 'react-icons/pi'
import { IProps } from './interface'

export function NodeStatusBadgeWidget(props: IProps) {
    const { node } = props

    let icon: React.ReactNode
    let color = ''
    let status = ''

    if (node.isConnected) {
        icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
        color = 'teal'
        status = 'connected'
    } else if (node.isConnecting) {
        icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
        color = 'teal'
        status = 'connecting'
    } else if (node.isDisabled) {
        icon = <PiProhibitDuotone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
        color = 'gray'
        status = 'disabled'
    } else if (!node.isConnected) {
        icon = <PiWarningCircle size={18} style={{ color: 'var(--mantine-color-red-3)' }} />
        color = 'red'
        status = 'disconnected'
    }

    return (
        <Badge color={color} leftSection={icon} size="lg" miw={'18ch'} {...props}>
            {status}
        </Badge>
    )
}
