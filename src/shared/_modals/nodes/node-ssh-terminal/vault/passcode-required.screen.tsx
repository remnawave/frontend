import { useTranslation } from 'react-i18next'
import { TbLock } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { PasscodeForm } from './passcode-form'

interface IProps {
    onSubmit: (passcode: string) => Promise<void>
}

export const PasscodeRequiredScreen = (props: IProps) => {
    const { onSubmit } = props
    const { t } = useTranslation()

    return (
        <SectionCard.Root maw={450} mx="auto" w="100%">
            <SectionCard.Section>
                <BaseOverlayHeader
                    iconColor="blue"
                    IconComponent={TbLock}
                    iconVariant="soft"
                    subtitle={t('node-ssh.passcode-required-description')}
                    title={t('node-ssh.passcode-title')}
                    titleOrder={5}
                />
            </SectionCard.Section>
            <SectionCard.Section>
                <PasscodeForm onSubmit={onSubmit} submitLabel={t('node-ssh.passcode-save')} />
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
