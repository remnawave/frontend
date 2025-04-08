import { Popover, Text } from '@mantine/core'
import { PiInfo } from 'react-icons/pi'

import { IProps } from './interfaces/props.interface'

export const PopoverWithInfoShared = (props: IProps) => {
    const { position = 'left', text } = props
    return (
        <Popover position={position} shadow="md" width={200} withArrow>
            <Popover.Target>
                <span
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <PiInfo size="1.25rem" />
                </span>
            </Popover.Target>
            <Popover.Dropdown>
                <Text size="sm">{text}</Text>
            </Popover.Dropdown>
        </Popover>
    )
}
