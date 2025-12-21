import { ActionIcon, Box, CopyButton } from '@mantine/core'
import { PiCheck, PiCopy } from 'react-icons/pi'

import styles from './copyable-code-block.module.css'

interface IProps {
    value: string
}

export function CopyableCodeBlock({ value }: IProps) {
    return (
        <CopyButton timeout={2000} value={value}>
            {({ copied, copy }) => (
                <Box className={styles.container} onClick={copy}>
                    <Box className={styles.codeWrapper}>
                        <Box className={styles.code}>{value}</Box>
                    </Box>
                    <ActionIcon
                        className={styles.copyButton}
                        data-copied={copied}
                        size="sm"
                        variant="transparent"
                    >
                        {copied ? <PiCheck size={18} /> : <PiCopy size={18} />}
                    </ActionIcon>
                </Box>
            )}
        </CopyButton>
    )
}
