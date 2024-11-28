import { ActionIcon, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { PiClockCounterClockwiseDuotone } from 'react-icons/pi'
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
        <Tooltip
            label="Reset usage"
            arrowSize={2}
            transitionProps={{ transition: 'scale-x', duration: 300 }}
        >
            <ActionIcon
                variant="outline"
                size="xl"
                radius="xs"
                color="blue"
                onClick={handleResetUsage}
            >
                <PiClockCounterClockwiseDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
