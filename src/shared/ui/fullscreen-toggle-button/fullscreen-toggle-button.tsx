import { ActionIcon, ActionIconProps } from '@mantine/core'
import clsx from 'clsx'
import { TbArrowsMaximize, TbArrowsMinimize } from 'react-icons/tb'

import styles from './Fullscreen.module.css'

interface IProps extends ActionIconProps {
    className?: string
    floating?: boolean
    iconSize?: number
    isFullscreen: boolean
    onToggle: () => void
}

export function FullscreenToggleButton(props: IProps) {
    const {
        className,
        floating = true,
        iconSize = 18,
        isFullscreen,
        onToggle,
        ...actionIconProps
    } = props

    return (
        <ActionIcon
            className={clsx(floating && styles.button, className)}
            color="gray"
            onClick={onToggle}
            size="lg"
            variant="soft"
            {...actionIconProps}
        >
            {isFullscreen ? (
                <TbArrowsMinimize size={iconSize} />
            ) : (
                <TbArrowsMaximize size={iconSize} />
            )}
        </ActionIcon>
    )
}

export { styles as fullscreenClasses }
