import {
    PiCloudArrowUpDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiWarningCircle
} from 'react-icons/pi'
import { ActionIcon, Badge } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { IProps } from './interface'

export function NodeStatusBadgeWidget({ node, fetchedNode, withText = true, ...rest }: IProps) {
    const { t } = useTranslation()

    let icon: React.ReactNode
    let color = ''
    let status = ''

    const nodeData = fetchedNode || node

    if (nodeData.isConnected) {
        icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
        color = 'teal'
        status = t('node-status-badge.widget.connected')
    } else if (nodeData.isConnecting) {
        icon = (
            <PiCloudArrowUpDuotone size={18} style={{ color: 'var(--mantine-color-yellow-3)' }} />
        )
        color = 'var(--mantine-color-yellow-3)'
        status = t('node-status-badge.widget.connecting')
    } else if (nodeData.isDisabled) {
        icon = <PiProhibitDuotone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
        color = 'gray'
        status = t('node-status-badge.widget.disabled')
    } else if (!nodeData.isConnected) {
        icon = <PiWarningCircle size={18} style={{ color: 'var(--mantine-color-red-3)' }} />
        color = 'red'
        status = t('node-status-badge.widget.disconnected')
    }

    if (!withText) {
        return (
            <ActionIcon color={color} radius="md" size="md" {...rest}>
                {icon}
            </ActionIcon>
        )
    }

    return (
        <Badge color={color} leftSection={icon} maw={'20ch'} miw={'20ch'} size="lg" {...rest}>
            {status}
        </Badge>
    )
}
