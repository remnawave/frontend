import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { Fieldset, Group, TextInput, Title } from '@mantine/core'
import { CreateUserCommand } from '@remnawave/backend-contract'
import { HiIdentification } from 'react-icons/hi'
import { UseFormReturnType } from '@mantine/form'
import { PiUserDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

interface IProps {
    cardVariants: Variants
    form: UseFormReturnType<CreateUserCommand.Request>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const UserIndentityCreationCard = (props: IProps) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <HiIdentification
                            size={20}
                            style={{
                                color: 'var(--mantine-color-blue-4)'
                            }}
                        />
                        <Title c="blue.4" order={4}>
                            User Identity
                        </Title>
                    </Group>
                }
            >
                <TextInput
                    description={t('create-user-modal.widget.username-cannot-be-changed-later')}
                    key={form.key('username')}
                    label={t('login-form-feature.username')}
                    required
                    {...form.getInputProps('username')}
                    leftSection={<PiUserDuotone size="1rem" />}
                />
            </Fieldset>
        </MotionWrapper>
    )
}
