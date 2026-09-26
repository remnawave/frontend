import { ActionIcon, Group } from '@mantine/core'
import { TbArrowsDiagonal, TbArrowsDiagonalMinimize2, TbMinus, TbPlus, TbX } from 'react-icons/tb'

import classes from '../NodeSshTerminal.module.css'

interface IProps {
    isMaximized: boolean
    isMinimized: boolean
    onClose: () => void
    onToggleMaximized: () => void
    onToggleMinimized: () => void
}

export const TrafficLights = (props: IProps) => {
    const { isMaximized, isMinimized, onClose, onToggleMaximized, onToggleMinimized } = props

    return (
        <Group className={classes.trafficLights} gap={8} wrap="nowrap">
            <ActionIcon
                className={classes.trafficLight}
                color="red"
                onClick={onClose}
                radius={256}
                variant="filled"
            >
                <TbX size={14} />
            </ActionIcon>

            <ActionIcon
                className={classes.trafficLight}
                color="yellow"
                onClick={onToggleMinimized}
                radius={256}
                variant="filled"
            >
                {isMinimized ? <TbPlus size={14} /> : <TbMinus size={14} />}
            </ActionIcon>

            <ActionIcon
                className={classes.trafficLight}
                color="green"
                onClick={onToggleMaximized}
                radius={256}
                variant="filled"
            >
                {isMaximized ? (
                    <TbArrowsDiagonalMinimize2 size={14} />
                ) : (
                    <TbArrowsDiagonal size={14} />
                )}
            </ActionIcon>
        </Group>
    )
}
