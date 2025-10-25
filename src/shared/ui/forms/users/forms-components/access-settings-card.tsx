import {
    CreateUserCommand,
    GetExternalSquadsCommand,
    GetInternalSquadsCommand,
    UpdateUserCommand
} from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { Fieldset, Group, Select, Stack, Title } from '@mantine/core'
import { DateTimePicker, getTimeRange } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { TbShield, TbWebhook } from 'react-icons/tb'
import { PiCalendarDuotone } from 'react-icons/pi'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

import { InternalSquadsListWidget } from '@widgets/dashboard/users/internal-squads-list'

interface IProps<T extends CreateUserCommand.Request | UpdateUserCommand.Request> {
    cardVariants: Variants
    externalSquads: GetExternalSquadsCommand.Response['response'] | undefined
    form: UseFormReturnType<T>
    internalSquads: GetInternalSquadsCommand.Response['response'] | undefined
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const AccessSettingsCard = <T extends CreateUserCommand.Request | UpdateUserCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, form, internalSquads, externalSquads } = props

    const [searchQuery, setSearchQuery] = useState('')

    const MotionWrapper = motionWrapper

    const filteredInternalSquads = useMemo(() => {
        const allInternalSquads = internalSquads?.internalSquads || []
        if (!searchQuery.trim()) return allInternalSquads

        const query = searchQuery.toLowerCase().trim()
        return allInternalSquads.filter((internalSquad) =>
            internalSquad.name?.toLowerCase().includes(query)
        )
    }, [internalSquads, searchQuery])

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <TbShield
                            size={20}
                            style={{
                                color: 'var(--mantine-color-purple-6)'
                            }}
                        />
                        <Title c="purple.6" order={4}>
                            {t('access-settings-card.access-settings')}
                        </Title>
                    </Group>
                }
            >
                <Stack gap="md">
                    <DateTimePicker
                        dropdownType="modal"
                        headerControlsOrder={['previous', 'next', 'level']}
                        highlightToday
                        key={form.key('expireAt')}
                        label={t('create-user-modal.widget.expiry-date')}
                        minDate={new Date()}
                        modalProps={{
                            centered: true
                        }}
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
                        {...form.getInputProps('expireAt')}
                        description={t('create-user-modal.widget.expire-at-description')}
                        leftSection={<PiCalendarDuotone size="16px" />}
                        onChange={(date) => {
                            const formInputProps = form.getInputProps('expireAt')
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

                                const currentDate = form.values.expireAt || new Date()
                                const newDate = new Date(currentDate)
                                newDate.setMonth(newDate.getMonth() + 1)
                                // @ts-expect-error - TODO: fix ZOD schema
                                form.setFieldValue('expireAt', newDate)
                            }
                        }}
                        presets={[
                            {
                                value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                                label: t('create-user-modal.widget.1-month')
                            },
                            {
                                value: dayjs().add(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
                                label: t('create-user-modal.widget.3-months')
                            },
                            {
                                value: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
                                label: t('create-user-modal.widget.1-year')
                            },
                            {
                                value: dayjs().year(2099).format('YYYY-MM-DD HH:mm:ss'),
                                label: t('create-user-modal.widget.2099-year')
                            }
                        ]}
                    />

                    <InternalSquadsListWidget
                        description={t('create-user-modal.widget.internal-squads-description')}
                        filteredInternalSquads={filteredInternalSquads}
                        formKey={form.key('activeInternalSquads')}
                        label={t('create-user-modal.widget.internal-squads')}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        {...form.getInputProps('activeInternalSquads')}
                    />

                    <Select
                        allowDeselect={true}
                        clearable
                        data={externalSquads?.externalSquads.map((externalSquad) => ({
                            label: externalSquad.name,
                            value: externalSquad.uuid
                        }))}
                        defaultValue={form.values.externalSquadUuid}
                        description={t(
                            'access-settings-card.select-an-external-squad-to-apply-custom-settings-to-this-user'
                        )}
                        key={form.key('externalSquadUuid')}
                        label={t('access-settings-card.external-squad')}
                        leftSection={<TbWebhook size="16px" />}
                        placeholder={t('access-settings-card.select-an-external-squad')}
                        {...form.getInputProps('externalSquadUuid')}
                    />
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
