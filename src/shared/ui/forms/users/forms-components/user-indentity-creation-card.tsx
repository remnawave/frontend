import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { CreateUserCommand } from '@remnawave/backend-contract'
import { HiIdentification } from 'react-icons/hi'
import { UseFormReturnType } from '@mantine/form'
import { PiUserDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { TextInput } from '@mantine/core'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    cardVariants: Variants
    form: UseFormReturnType<CreateUserCommand.Request>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const UserIdentityCreationCard = (props: IProps) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        IconComponent={HiIdentification}
                        iconSize={20}
                        iconVariant="gradient-blue"
                        title={t('user-indentity-creation-card.user-identity')}
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <TextInput
                        description={t('create-user-modal.widget.username-cannot-be-changed-later')}
                        key={form.key('username')}
                        label={t('login-form-feature.username')}
                        required
                        {...form.getInputProps('username')}
                        leftSection={<PiUserDuotone size="16px" />}
                    />
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
