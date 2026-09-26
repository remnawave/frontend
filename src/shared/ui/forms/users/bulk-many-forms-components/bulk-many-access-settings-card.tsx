import { Select, Stack } from '@mantine/core'
import { DateTimePicker, getTimeRange } from '@mantine/dates'
import { UseFormReturnType } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { BulkUpdateUsersCommand, GetExternalSquadsCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiCalendarDuotone } from 'react-icons/pi'
import { TbShield, TbStatusChange, TbWebhook } from 'react-icons/tb'

import { userStatusValues } from '@shared/constants/forms'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    cardVariants: Variants
    externalSquads: GetExternalSquadsCommand.Response['response'] | undefined
    form: UseFormReturnType<BulkUpdateUsersCommand.RequestBody>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const BulkAccessSettingsCard = (props: IProps) => {
    const { t, i18n } = useTranslation()

    const { cardVariants, externalSquads, motionWrapper, form } = props

    const [localExpireAt, setLocalExpireAt] = useState<Date | undefined>(undefined)

    const MotionWrapper = motionWrapper

    form.watch('fields.expireAt', (value) => {
        setLocalExpireAt(value.value)
    })

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="indigo"
                        IconComponent={TbShield}
                        iconSize={20}
                        iconVariant="soft"
                        title={t('access-settings-card.access-settings')}
                        titleOrder={5}
                    />
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="md">
                        <Select
                            allowDeselect={true}
                            clearable
                            data={userStatusValues.filter(
                                (status) => status.value !== 'EXPIRED' && status.value !== 'LIMITED'
                            )}
                            description={t(
                                'common.field.user-status'
                            )}
                            key={form.key('fields.status')}
                            label={t('common.field.status')}
                            leftSection={<TbStatusChange size="16px" />}
                            placeholder={t(
                                'bulk-all-user-actions-tabs.update.tab.feature.select-status'
                            )}
                            {...form.getInputProps('fields.status')}
                        />

                        <DateTimePicker
                            dropdownType="popover"
                            headerControlsOrder={['previous', 'next', 'level']}
                            highlightToday
                            key={form.key('fields.expireAt')}
                            label={t('create-user-modal.widget.expiry-date')}
                            locale={i18n.language}
                            minDate={new Date()}
                            styles={{
                                calendarHeaderLevel: {
                                    justifyContent: 'flex-start',
                                    paddingInlineStart: 8
                                },
                                label: { fontWeight: 500 }
                            }}
                            submitButtonProps={{
                                style: {
                                    borderRadius: 'var(--mantine-radius-md)',
                                    width: '20%'
                                }
                            }}
                            timePickerProps={{
                                withDropdown: true,
                                scrollAreaProps: {
                                    styles: {
                                        content: {
                                            minWidth: 'fit-content' // TODO: MantineUI bug
                                        }
                                    }
                                },
                                presets: getTimeRange({
                                    startTime: '06:00:00',
                                    endTime: '18:00:00',
                                    interval: '01:30:00'
                                })
                            }}
                            valueFormat="MMMM D, YYYY - HH:mm"
                            {...form.getInputProps('fields.expireAt')}
                            description={t('create-user-modal.widget.expire-at-description')}
                            leftSection={<PiCalendarDuotone size="16px" />}
                            onChange={(date) => {
                                const formInputProps = form.getInputProps('fields.expireAt')
                                if (formInputProps.onChange) {
                                    formInputProps.onChange(date)
                                }

                                if (date === 'Invalid Date') {
                                    notifications.show({
                                        title: 'Invalid date',
                                        message:
                                            'Please select a valid date. Defaulting to 1 month from now.',
                                        color: 'red'
                                    })

                                    const currentDate = form.values.fields.expireAt || new Date()
                                    const newDate = new Date(currentDate)
                                    newDate.setMonth(newDate.getMonth() + 1)
                                    form.setFieldValue('fields.expireAt', newDate)
                                }
                            }}
                            presets={[
                                {
                                    value: dayjs(localExpireAt)
                                        .add(1, 'month')
                                        .format('YYYY-MM-DD HH:mm:ss'),
                                    label: t('create-user-modal.widget.1-month')
                                },
                                {
                                    value: dayjs(localExpireAt)
                                        .add(3, 'months')
                                        .format('YYYY-MM-DD HH:mm:ss'),
                                    label: t('create-user-modal.widget.3-months')
                                },
                                {
                                    value: dayjs(localExpireAt)
                                        .add(1, 'year')
                                        .format('YYYY-MM-DD HH:mm:ss'),
                                    label: t('create-user-modal.widget.1-year')
                                },
                                {
                                    value: dayjs().year(2099).format('YYYY-MM-DD HH:mm:ss'),
                                    label: t('create-user-modal.widget.2099-year')
                                }
                            ]}
                        />

                        <Select
                            allowDeselect={true}
                            clearable
                            data={externalSquads?.externalSquads.map((externalSquad) => ({
                                label: externalSquad.name,
                                value: externalSquad.uuid
                            }))}
                            limit={100}
                            defaultValue={form.values.fields.externalSquadUuid}
                            description={t(
                                'access-settings-card.select-an-external-squad-to-apply-custom-settings-to-this-user'
                            )}
                            key={form.key('fields.externalSquadUuid')}
                            label={t('access-settings-card.external-squad')}
                            leftSection={<TbWebhook size="16px" />}
                            placeholder={t('access-settings-card.select-an-external-squad')}
                            {...form.getInputProps('fields.externalSquadUuid')}
                        />
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
