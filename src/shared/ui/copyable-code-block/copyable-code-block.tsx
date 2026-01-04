import { ActionIcon, Box, CopyButton, Input, InputWrapperProps, MantineColor } from '@mantine/core'
import { PiCheck, PiCopy } from 'react-icons/pi'
import clsx from 'clsx'

import styles from './copyable-code-block.module.css'

interface IProps {
    color?: MantineColor
    inputWrapperProps?: InputWrapperProps
    size?: 'normal' | 'small'
    value: number | string
}

export function CopyableCodeBlock({ color, value, size = 'normal', inputWrapperProps }: IProps) {
    const isSmall = size === 'small'
    const iconSize = isSmall ? 14 : 18

    return (
        <Input.Wrapper {...inputWrapperProps}>
            <CopyButton timeout={2000} value={value.toString()}>
                {({ copied, copy }) => (
                    <Box
                        className={clsx(styles.container, {
                            [styles.small]: isSmall
                        })}
                        onClick={copy}
                    >
                        <Box className={styles.codeWrapper}>
                            <Box c={color} className={styles.code}>
                                {value}
                            </Box>
                        </Box>
                        <ActionIcon
                            className={styles.copyButton}
                            data-copied={copied}
                            size={isSmall ? 'xs' : 'sm'}
                            variant="transparent"
                        >
                            {copied ? <PiCheck size={iconSize} /> : <PiCopy size={iconSize} />}
                        </ActionIcon>
                    </Box>
                )}
            </CopyButton>
        </Input.Wrapper>
    )
}
