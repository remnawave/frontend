import {
    PiCloudArrowUpDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiWarningCircle
} from 'react-icons/pi'
import { ThemeIcon } from '@mantine/core'
import { memo } from 'react'

import { IProps } from './interface'

export const NodeStatusSimplfiedBadgeWidget = memo(
    ({ isConnected, isConnecting, isDisabled, nodeUuid, ...rest }: IProps) => {
        let icon: React.ReactNode
        let color = 'red'

        if (isConnected) {
            icon = <PiPulseDuotone size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
            color = 'teal'
        } else if (isConnecting) {
            icon = (
                <PiCloudArrowUpDuotone
                    size={18}
                    style={{ color: 'var(--mantine-color-yellow-3)' }}
                />
            )
            color = 'var(--mantine-color-yellow-3)'
        } else if (isDisabled) {
            icon = <PiProhibitDuotone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
            color = 'gray'
        } else {
            icon = <PiWarningCircle size={18} style={{ color: 'var(--mantine-color-red-3)' }} />
            color = 'red'
        }

        return (
            <ThemeIcon color={color} size="md" variant="outline" {...rest}>
                {icon}
            </ThemeIcon>
        )
    }
)
