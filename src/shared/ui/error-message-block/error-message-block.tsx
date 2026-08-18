import { ActionIcon, Box, CopyButton, Text, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy } from 'react-icons/pi'

import classes from './ErrorMessageBlock.module.css'

interface IProps {
    message: string
}

export const ErrorMessageBlock = (props: IProps) => {
    const { message } = props
    const { t } = useTranslation()

    return (
        <Box className={classes.message}>
            <Text className={classes.text}>{message}</Text>

            <CopyButton timeout={2000} value={message}>
                {({ copied, copy }) => (
                    <Tooltip label={t('common.copy')}>
                        <ActionIcon
                            className={classes.copyButton}
                            color={copied ? 'teal' : 'gray'}
                            data-copied={copied}
                            onClick={copy}
                            size="sm"
                            variant="subtle"
                        >
                            {copied ? <PiCheck size={14} /> : <PiCopy size={14} />}
                        </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        </Box>
    )
}
