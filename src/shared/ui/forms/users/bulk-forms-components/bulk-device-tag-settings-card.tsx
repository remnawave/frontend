import { Anchor, Checkbox, Code, Input, NumberInput, Stack, Text, Textarea } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { BulkAllUpdateUsersCommand, GetUsersTagsCommand } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'
import { TbDevices2, TbSettings } from 'react-icons/tb'

import { CreateableTagInputShared } from '@shared/ui/createable-tag-input/createable-tag-input'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    cardVariants: Variants
    form: UseFormReturnType<BulkAllUpdateUsersCommand.RequestBody>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    tags: GetUsersTagsCommand.Response['response'] | undefined
}

export function BulkDeviceTagSettingsCard(props: IProps) {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form, tags } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="orange"
                        IconComponent={TbSettings}
                        iconSize={20}
                        iconVariant="soft"
                        title={t('device-tag-settings-card.device-and-tag-settings')}
                        titleOrder={5}
                    />
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="md">
                        <Stack gap={0}>
                            <Input.Label>
                                {t('create-user-modal.widget.hwid-device-limit')}
                            </Input.Label>
                            <Input.Description component="div">
                                <>
                                    <Text c="dimmed" size="0.75rem">
                                        <Trans
                                            components={{
                                                highlight: <Code />,
                                                anchor: (
                                                    <Anchor
                                                        href="https://docs.rw/docs/features/hwid-device-limit"
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                    />
                                                )
                                            }}
                                            i18nKey="create-user-modal.widget.hwid-user-limit-description"
                                        />
                                    </Text>
                                    <Checkbox
                                        checked={form.getValues().hwidDeviceLimit === 0}
                                        label={t('create-user-modal.widget.disable-hwid-limit')}
                                        mb="xs"
                                        mt="xs"
                                        onChange={(event) => {
                                            const { checked } = event.currentTarget
                                            form.setFieldValue(
                                                'hwidDeviceLimit',
                                                checked ? 0 : null
                                            )
                                        }}
                                    />
                                </>
                            </Input.Description>

                            <NumberInput
                                allowDecimal={false}
                                allowNegative={false}
                                disabled={form.getValues().hwidDeviceLimit === 0}
                                hideControls
                                key={form.key('hwidDeviceLimit')}
                                leftSection={<TbDevices2 size="16px" />}
                                placeholder="Fallback Device Limit in use"
                                {...form.getInputProps('hwidDeviceLimit')}
                            />
                        </Stack>

                        <CreateableTagInputShared
                            key={form.key('tag')}
                            {...form.getInputProps('tag')}
                            tags={tags?.tags ?? []}
                            value={form.getValues().tag}
                        />

                        <Textarea
                            description={t('create-user-modal.widget.user-description')}
                            key={form.key('description')}
                            label={t('common.field.description')}
                            resize="vertical"
                            {...form.getInputProps('description')}
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
