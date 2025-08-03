import {
    PiCloudArrowUpDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiWarningCircle
} from 'react-icons/pi'
import { ActionIcon, Badge } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { memo, useMemo } from 'react'

import { IProps } from './interface'

export const NodeStatusBadgeWidget = memo(
    ({ node, fetchedNode, withText = true, ...rest }: IProps) => {
        const { t } = useTranslation()

        const nodeData = fetchedNode || node

        const { icon, color, status } = useMemo(() => {
            let icon: React.ReactNode
            let color = 'red'
            let status = ''

            if (nodeData.isConnected) {
                icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
                color = 'teal'
                status = t('node-status-badge.widget.connected')
            } else if (nodeData.isConnecting) {
                icon = (
                    <PiCloudArrowUpDuotone
                        size={18}
                        style={{ color: 'var(--mantine-color-yellow-3)' }}
                    />
                )
                color = 'var(--mantine-color-yellow-3)'
                status = t('node-status-badge.widget.connecting')
            } else if (nodeData.isDisabled) {
                icon = (
                    <PiProhibitDuotone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                )
                color = 'gray'
                status = t('node-status-badge.widget.disabled')
            } else {
                icon = <PiWarningCircle size={18} style={{ color: 'var(--mantine-color-red-3)' }} />
                color = 'red'
                status = t('node-status-badge.widget.disconnected')
            }

            return { icon, color, status }
        }, [nodeData.isConnected, nodeData.isConnecting, nodeData.isDisabled, t])

        if (!withText) {
            return (
                <ActionIcon color={color} radius="md" size={26} {...rest}>
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
)
