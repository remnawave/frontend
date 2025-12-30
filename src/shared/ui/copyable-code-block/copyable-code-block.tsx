import { ActionIcon, Box, CopyButton } from '@mantine/core'
import { PiCheck, PiCopy } from 'react-icons/pi'
import clsx from 'clsx'

import styles from './copyable-code-block.module.css'

interface IProps {
    size?: 'normal' | 'small'
    value: string
}

export function CopyableCodeBlock({ value, size = 'normal' }: IProps) {
    const isSmall = size === 'small'
    const iconSize = isSmall ? 14 : 18

    return (
        <CopyButton timeout={2000} value={value}>
            {({ copied, copy }) => (
                <Box
                    className={clsx(styles.container, {
                        [styles.small]: isSmall
                    })}
                    onClick={copy}
                >
                    <Box className={styles.codeWrapper}>
                        <Box className={styles.code}>{value}</Box>
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
    )
}
