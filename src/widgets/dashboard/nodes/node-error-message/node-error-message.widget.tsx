import { useTranslation } from 'react-i18next'
import { TbAlertTriangle } from 'react-icons/tb'

import { ErrorMessageBlock } from '@shared/ui/error-message-block'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { IProps } from './interfaces'

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
                    title={t('common.message.last-error-message')}
                    titleOrder={5}
                />
            </SectionCard.Section>

            <SectionCard.Section>
                <ErrorMessageBlock message={node.lastStatusMessage} />
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
