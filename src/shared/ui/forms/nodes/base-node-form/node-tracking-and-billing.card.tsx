import {
    Box,
    Button,
    Collapse,
    Group,
    NumberInput,
    Stack,
    Switch,
    TagsInput,
    Text,
    Textarea
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiTagDuotone } from 'react-icons/pi'
import { TbBell, TbChartBar, TbChartLine, TbClock, TbExternalLink } from 'react-icons/tb'

import { useGetNodesTags } from '@shared/api/hooks'
import { TrafficLimitInput } from '@shared/ui/forms/traffic-limit-input'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import classes from './node-tracking-and-billing.card.module.css'

const URL_REGEX = /https?:\/\/[^\s]+/i

function extractFirstUrl(text: string): null | string {
    const match = text.match(URL_REGEX)
    return match ? match[0] : null
}

interface IProps<T extends CreateNodeCommand.RequestBody | UpdateNodeCommand.RequestBody> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const NodeTrackingAndBillingCard = <
    T extends CreateNodeCommand.RequestBody | UpdateNodeCommand.RequestBody
>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { data: nodesTags } = useGetNodesTags()
    const { cardVariants, form, motionWrapper } = props

    const [advancedOpened, setAdvancedOpened] = useState<boolean>(false)
    const [firstNoteUrl, setFirstNoteUrl] = useState<null | string>(null)

    form.watch('isTrafficTrackingActive', ({ value }) => {
        setAdvancedOpened(value ?? false)
    })

    form.watch('note', ({ value }) => {
        setFirstNoteUrl(extractFirstUrl(typeof value === 'string' ? value : ''))
    })

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="yellow"
                        IconComponent={TbChartBar}
                        iconVariant="soft"
                        title={t('base-node-form.tracking-and-billing')}
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
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

                        <Box className={classes.trackingCard}>
                            <Group
                                className={classes.trackingHeader}
                                gap="xs"
                                justify="space-between"
                            >
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
                                        form.getInputProps('isTrafficTrackingActive').onChange(
                                            event
                                        )
                                        setAdvancedOpened(event.currentTarget.checked)
                                    }}
                                    size="md"
                                />
                            </Group>

                            <Collapse expanded={advancedOpened}>
                                <Stack className={classes.trackingBody} gap="sm">
                                    <Group gap="md" grow justify="space-between" w="100%">
                                        <TrafficLimitInput
                                            hideControls
                                            key={form.key('trafficLimitBytes')}
                                            label={t('base-node-form.limit')}
                                            leftSection={<TbChartLine size={16} />}
                                            {...form.getInputProps('trafficLimitBytes')}
                                            styles={{
                                                label: { fontWeight: 500 }
                                            }}
                                        />
                                    </Group>

                                    <Group gap="md" grow justify="space-between" w="100%">
                                        <NumberInput
                                            key={form.key('trafficResetDay')}
                                            label={t('base-node-form.reset-day')}
                                            {...form.getInputProps('trafficResetDay')}
                                            allowDecimal={false}
                                            allowNegative={false}
                                            clampBehavior="strict"
                                            decimalScale={0}
                                            hideControls
                                            leftSection={<TbClock size={16} />}
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
                                            leftSection={<TbBell size={16} />}
                                            max={100}
                                            placeholder={t('base-node-form.e-g-50')}
                                            styles={{
                                                label: {
                                                    fontWeight: 500,
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis'
                                                }
                                            }}
                                        />
                                    </Group>
                                </Stack>
                            </Collapse>
                        </Box>

                        <TagsInput
                            clearable
                            data={nodesTags?.tags || []}
                            key={form.key('tags')}
                            label={t('common.field.tags')}
                            leftSection={<PiTagDuotone size="16px" />}
                            maxTags={10}
                            placeholder="Enter tags (comma, space, semicolon)"
                            splitChars={[',', ' ', ';']}
                            {...form.getInputProps('tags')}
                            error={
                                Object.keys(form.errors)
                                    .filter((key) => key.startsWith('tags.'))
                                    .map((key) => form.errors[key])
                                    .join(', ') || form.getInputProps('tags').error
                            }
                            renderPill={({ value, onRemove }) => (
                                <TagInputPill onRemove={onRemove} value={value} />
                            )}
                        />

                        <Stack gap={6}>
                            <Textarea
                                key={form.key('note')}
                                label={t('node-tracking-and-billing.card.note')}
                                resize="vertical"
                                {...form.getInputProps('note')}
                                styles={{
                                    label: { fontWeight: 500 }
                                }}
                            />
                            {firstNoteUrl && (
                                <Button
                                    component="a"
                                    href={firstNoteUrl}
                                    leftSection={<TbExternalLink size={14} />}
                                    maw="100%"
                                    rel="noopener noreferrer"
                                    size="xs"
                                    target="_blank"
                                    variant="soft"
                                    w="fit-content"
                                >
                                    {t('common.action.open')}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
