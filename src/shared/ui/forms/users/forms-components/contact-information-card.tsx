import { CreateUserCommand, UpdateUserCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { PiEnvelopeDuotone, PiTelegramLogoDuotone } from 'react-icons/pi'
import { NumberInput, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { TbMail } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

interface IProps<T extends CreateUserCommand.Request | UpdateUserCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export function ContactInformationCard<
    T extends CreateUserCommand.Request | UpdateUserCommand.Request
>(props: IProps<T>) {
    // const { t } = useTranslation()

    const { cardVariants, motionWrapper, form } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        IconComponent={TbMail}
                        iconSize={20}
                        iconVariant="gradient-teal"
                        title="Contact Information"
                        titleOrder={5}
                    />
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="md">
                        <NumberInput
                            allowDecimal={false}
                            allowNegative={false}
                            hideControls
                            key={form.key('telegramId')}
                            label="Telegram ID"
                            leftSection={<PiTelegramLogoDuotone size="16px" />}
                            placeholder="Enter user's Telegram ID (optional)"
                            {...form.getInputProps('telegramId')}
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <TextInput
                            key={form.key('email')}
                            label="Email"
                            leftSection={<PiEnvelopeDuotone size="16px" />}
                            placeholder="Enter user's email (optional)"
                            {...form.getInputProps('email')}
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
