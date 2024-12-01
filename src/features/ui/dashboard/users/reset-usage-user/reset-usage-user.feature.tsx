import { PiClockCounterClockwiseDuotone } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { ActionIcon, Tooltip } from '@mantine/core'

import { IProps } from './interfaces'

export function ResetUsageUserFeature(props: IProps) {
    const handleResetUsage = async () => {
        notifications.show({
            title: 'Reset usage',
            message: 'Reset usage not yet implemented',
            color: 'yellow'
        })
    }

    // TODO: Implement reset usage

    return (
        <Tooltip label="Reset usage">
            <ActionIcon color="blue" onClick={handleResetUsage} size="xl">
                <PiClockCounterClockwiseDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
