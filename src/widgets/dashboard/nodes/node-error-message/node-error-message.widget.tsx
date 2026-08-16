import { ActionIcon, Box, CopyButton, Text, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { TbAlertTriangle } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { IProps } from './interfaces'
import classes from './NodeErrorMessage.module.css'

export const NodeErrorMessageWidget = (props: IProps) => {
    const { t } = useTranslation()

    const { node } = props

    if (!node || !node.lastStatusMessage) {
        return null
    }

    return (
        <SectionCard.Root>
            <SectionCard.Section>
                <BaseOverlayHeader
                    iconColor="red"
                    IconComponent={TbAlertTriangle}
                    iconVariant="soft"
                    title={t('error-accordeon.widget.last-error-message')}
                    titleOrder={5}
                />
            </SectionCard.Section>

            <SectionCard.Section>
                <Box className={classes.message}>
                    <Text className={classes.text}>{node.lastStatusMessage}</Text>

                    <CopyButton timeout={2000} value={node.lastStatusMessage}>
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
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
