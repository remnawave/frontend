/* eslint-disable indent */

import {
    ActionIcon,
    Fieldset,
    Group,
    HoverCard,
    Paper,
    Slider,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { TbChartLine } from 'react-icons/tb'

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const NodeConsumptionCard = <
    T extends CreateNodeCommand.Request | UpdateNodeCommand.Request
>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, form, motionWrapper } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbChartLine
                            size={20}
                            style={{
                                color: 'var(--mantine-color-indigo-4)'
                            }}
                        />
                        <Title c="indigo.4" order={4}>
                            {t('base-node-form.consumption')}
                        </Title>
                    </Group>
                }
            >
                <Stack gap="md">
                    <Group gap="xs" justify="space-between" w="100%">
                        <Group gap="xs">
                            <Text fw={500} size="sm">
                                {t('base-node-form.consumption-multiplier')}
                            </Text>

                            <HoverCard shadow="md" width={280} withArrow>
                                <HoverCard.Target>
                                    <ActionIcon color="gray" size="xs" variant="subtle">
                                        <HiQuestionMarkCircle size={16} />
                                    </ActionIcon>
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Stack gap="sm">
                                        <Text fw={600} size="sm">
                                            {t('base-node-form.consumption-multiplier')}
                                        </Text>
                                        <Text c="dimmed" size="sm">
                                            {t('base-node-form.consumption-m-line-1')}
                                        </Text>
                                        <Text c="dimmed" size="sm">
                                            {t('base-node-form.consumption-m-line-2')}
                                        </Text>
                                    </Stack>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Group>
                    </Group>

                    <Paper p="sm" radius="md">
                        <Slider
                            key={form.key('consumptionMultiplier')}
                            {...form.getInputProps('consumptionMultiplier')}
                            defaultValue={form.getValues().consumptionMultiplier ?? 1.0}
                            marks={[
                                { value: 10.0, label: '10.0' },
                                { value: 1.0, label: '1.0' },
                                { value: 0.1, label: '0.1' }
                            ]}
                            max={10.0}
                            min={0.1}
                            step={0.1}
                            styles={{
                                thumb: { borderWidth: 2, padding: 3 },
                                track: { height: 6 },
                                bar: { height: 6 }
                            }}
                            thumbSize={24}
                        />
                    </Paper>
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
