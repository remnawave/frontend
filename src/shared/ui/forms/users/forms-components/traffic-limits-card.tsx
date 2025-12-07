import {
    Badge,
    Box,
    Fieldset,
    Group,
    NumberInput,
    Progress,
    Select,
    Stack,
    Text,
    Title
} from '@mantine/core'
import {
    CreateUserCommand,
    GetUserByUuidCommand,
    UpdateUserCommand
} from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { UseFormReturnType } from '@mantine/form'
import { PiClockDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { TbChartLine } from 'react-icons/tb'

import { resetDataStrategy } from '@shared/constants/forms'
import { prettyBytesUtil } from '@shared/utils/bytes'

interface IProps<T extends CreateUserCommand.Request | UpdateUserCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    user: GetUserByUuidCommand.Response['response'] | undefined
}

export const TrafficLimitsCard = <T extends CreateUserCommand.Request | UpdateUserCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form, user } = props

    const MotionWrapper = motionWrapper

    const usedTrafficPercentage = user
        ? (user.userTraffic.usedTrafficBytes / user.trafficLimitBytes) * 100
        : 0
    const totalUsedTraffic = prettyBytesUtil(user?.userTraffic.usedTrafficBytes, true)
    const lifetimeUsedTraffic = prettyBytesUtil(user?.userTraffic.lifetimeUsedTrafficBytes, true)

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbChartLine
                            size={20}
                            style={{
                                color: 'var(--mantine-color-indigo-6)'
                            }}
                        />
                        <Title c="indigo.6" order={4}>
                            Traffic & Limits
                        </Title>
                        {user && (
                            <Badge color="indigo" size="sm" variant="light">
                                {lifetimeUsedTraffic}
                            </Badge>
                        )}
                    </Group>
                }
            >
                <Stack gap="md">
                    <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        decimalScale={0}
                        description={t('create-user-modal.widget.data-limit-description')}
                        key={form.key('trafficLimitBytes')}
                        label={t('create-user-modal.widget.data-limit')}
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

                    {user && (
                        <Box>
                            <Progress
                                color={usedTrafficPercentage > 100 ? 'yellow.9' : 'teal.9'}
                                size="xl"
                                striped
                                value={usedTrafficPercentage}
                            />
                            <Group gap="xs" justify="center" mt={2}>
                                <Text c="dimmed" fw={500} size="sm">
                                    {totalUsedTraffic === '0' ? '' : totalUsedTraffic}
                                </Text>
                            </Group>
                        </Box>
                    )}

                    <Select
                        allowDeselect={false}
                        comboboxProps={{ transitionProps: { transition: 'fade', duration: 200 } }}
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
            </Fieldset>
        </MotionWrapper>
    )
}
