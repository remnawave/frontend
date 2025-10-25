import {
    Badge,
    Collapse,
    Divider,
    Fieldset,
    Group,
    NumberInput,
    rem,
    Stack,
    Switch,
    Text,
    Title
} from '@mantine/core'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { PiCheckDuotone, PiXDuotone } from 'react-icons/pi'
import { TbChartBar, TbChartLine } from 'react-icons/tb'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    advancedOpened: boolean
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    setAdvancedOpened: (value: boolean) => void
}

export const NodeTrackingAndBillingCard = <
    T extends CreateNodeCommand.Request | UpdateNodeCommand.Request
>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, form, motionWrapper, setAdvancedOpened, advancedOpened } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbChartBar
                            size={20}
                            style={{
                                color: 'var(--mantine-color-yellow-4)'
                            }}
                        />
                        <Title c="yellow.4" order={4}>
                            {t('base-node-form.tracking-and-billing')}
                        </Title>
                    </Group>
                }
            >
                <Stack gap="md">
                    <SelectInfraProviderShared
                        selectedInfraProviderUuid={form.getValues().providerUuid}
                        setSelectedInfraProviderUuid={(providerUuid) => {
                            form.setValues({
                                providerUuid
                            } as Partial<T>)
                            form.setTouched({
                                providerUuid: true
                            })
                            form.setDirty({
                                providerUuid: true
                            })
                        }}
                    />

                    <Stack gap={0}>
                        <Group gap="xs" justify="space-between">
                            <Group gap="xs">
                                <TbChartLine
                                    size={18}
                                    style={{ color: 'var(--mantine-color-indigo-6)' }}
                                />
                                <Text fw={500} size="sm">
                                    {t('base-node-form.traffic-tracking')}
                                </Text>
                            </Group>
                            <Switch
                                key={form.key('isTrafficTrackingActive')}
                                {...form.getInputProps('isTrafficTrackingActive', {
                                    type: 'checkbox'
                                })}
                                onChange={(event) => {
                                    form.getInputProps('isTrafficTrackingActive').onChange(event)
                                    setAdvancedOpened(event.currentTarget.checked)
                                }}
                                size="md"
                                thumbIcon={
                                    form.getValues().isTrafficTrackingActive ? (
                                        <PiCheckDuotone
                                            color="teal"
                                            style={{ width: rem(12), height: rem(12) }}
                                        />
                                    ) : (
                                        <PiXDuotone
                                            color="red.6"
                                            style={{ width: rem(12), height: rem(12) }}
                                        />
                                    )
                                }
                            />
                        </Group>

                        <Collapse in={advancedOpened}>
                            <Stack gap="sm" mt="sm">
                                <Divider size="xs" />
                                <Group gap="md" grow justify="space-between" w="100%">
                                    <NumberInput
                                        allowDecimal={false}
                                        decimalScale={0}
                                        defaultValue={0}
                                        hideControls
                                        key={form.key('trafficLimitBytes')}
                                        label={t('base-node-form.limit')}
                                        leftSection={
                                            <Badge color="blue" size="xs" variant="light">
                                                GB
                                            </Badge>
                                        }
                                        {...form.getInputProps('trafficLimitBytes')}
                                        styles={{
                                            label: { fontWeight: 500 }
                                        }}
                                    />

                                    <NumberInput
                                        key={form.key('trafficResetDay')}
                                        label={t('base-node-form.reset-day')}
                                        {...form.getInputProps('trafficResetDay')}
                                        allowDecimal={false}
                                        allowNegative={false}
                                        clampBehavior="strict"
                                        decimalScale={0}
                                        hideControls
                                        max={31}
                                        min={1}
                                        placeholder={t('base-node-form.e-g-1-31')}
                                        styles={{
                                            label: { fontWeight: 500 }
                                        }}
                                    />

                                    <NumberInput
                                        key={form.key('notifyPercent')}
                                        label={t('base-node-form.notify-percent')}
                                        {...form.getInputProps('notifyPercent')}
                                        allowDecimal={false}
                                        allowNegative={false}
                                        clampBehavior="strict"
                                        decimalScale={0}
                                        hideControls
                                        max={100}
                                        placeholder={t('base-node-form.e-g-50')}
                                        styles={{
                                            label: { fontWeight: 500 }
                                        }}
                                    />
                                </Group>
                            </Stack>
                        </Collapse>
                    </Stack>
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
