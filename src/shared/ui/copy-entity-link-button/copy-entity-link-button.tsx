import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { TbCheck, TbLink } from 'react-icons/tb'

import { buildOpenEntityUrl, TOpenEntity } from '@shared/constants'

interface IProps extends ActionIconProps {
    entity: TOpenEntity
    iconSize?: number
    id: number | string
}

export function CopyEntityLinkButton(props: IProps) {
    const { entity, iconSize = 16, id, ...actionIconProps } = props

    const { t } = useTranslation()
    const { copied, copy } = useClipboard({ timeout: 1500 })

    return (
        <Tooltip label={t('common.copy-link')}>
            <ActionIcon
                color={copied ? 'teal' : 'gray'}
                onClick={() => copy(buildOpenEntityUrl(entity, id))}
                size="md"
                variant="subtle"
                {...actionIconProps}
            >
                {copied ? <TbCheck size={iconSize} /> : <TbLink size={iconSize} />}
            </ActionIcon>
        </Tooltip>
    )
}
