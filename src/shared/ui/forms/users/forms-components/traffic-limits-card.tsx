import { CreateUserCommand, UpdateUserCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { NumberInput, Select, Stack, Text } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { PiClockDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { TbChartLine } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { resetDataStrategy } from '@shared/constants/forms'
import { SectionCard } from '@shared/ui/section-card'

interface IProps<T extends CreateUserCommand.Request | UpdateUserCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const TrafficLimitsCard = <T extends CreateUserCommand.Request | UpdateUserCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        IconComponent={TbChartLine}
                        iconSize={20}
                        iconVariant="gradient-violet"
                        title="Traffic & Limits"
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <Stack gap="md">
                        <NumberInput
                            allowDecimal={false}
                            allowNegative={false}
                            decimalScale={0}
                            description={t('create-user-modal.widget.data-limit-description')}
                            key={form.key('trafficLimitBytes')}
                            label={t('create-user-modal.widget.data-limit')}
                            leftSection={
                                <Text
                                    display="flex"
                                    size="0.75rem"
                                    style={{ justifyContent: 'center' }}
                                    ta="center"
                                    w={26}
                                >
                                    GB
                                </Text>
                            }
                            thousandSeparator=","
                            {...form.getInputProps('trafficLimitBytes')}
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <Select
                            allowDeselect={false}
                            comboboxProps={{
                                transitionProps: { transition: 'fade', duration: 200 }
                            }}
                            data={resetDataStrategy(t)}
                            defaultValue={form.values.trafficLimitStrategy}
                            description={t(
                                'create-user-modal.widget.traffic-reset-strategy-description'
                            )}
                            key={form.key('trafficLimitStrategy')}
                            label={t('create-user-modal.widget.traffic-reset-strategy')}
                            leftSection={<PiClockDuotone size="16px" />}
                            placeholder={t('create-user-modal.widget.pick-value')}
                            {...form.getInputProps('trafficLimitStrategy')}
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
