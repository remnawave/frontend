import { Fieldset, Group, NumberInput, Stack, TextInput, Title } from '@mantine/core'
import { CreateUserCommand, UpdateUserCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { PiEnvelopeDuotone, PiTelegramLogoDuotone } from 'react-icons/pi'
import { UseFormReturnType } from '@mantine/form'
import { TbMail } from 'react-icons/tb'

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
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbMail
                            size={20}
                            style={{
                                color: 'var(--mantine-color-teal-6)'
                            }}
                        />
                        <Title c="teal.6" order={5}>
                            Contact Information
                        </Title>
                    </Group>
                }
            >
                <Stack gap="md">
                    <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        hideControls
                        key={form.key('telegramId')}
                        label="Telegram ID"
                        leftSection={<PiTelegramLogoDuotone size="1rem" />}
                        placeholder="Enter user's Telegram ID (optional)"
                        {...form.getInputProps('telegramId')}
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                    />

                    <TextInput
                        key={form.key('email')}
                        label="Email"
                        leftSection={<PiEnvelopeDuotone size="1rem" />}
                        placeholder="Enter user's email (optional)"
                        {...form.getInputProps('email')}
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                    />
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
