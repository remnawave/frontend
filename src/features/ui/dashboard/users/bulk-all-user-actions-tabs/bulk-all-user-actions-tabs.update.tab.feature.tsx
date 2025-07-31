import {
    Button,
    Divider,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import {
    PiCalendar,
    PiClockDuotone,
    PiEnvelopeDuotone,
    PiPencil,
    PiTelegramLogoDuotone,
    PiX
} from 'react-icons/pi'
import { BulkAllUpdateUsersCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { CreateableTagInputShared } from '@shared/ui/createable-tag-input/createable-tag-input'
import { userStatusValues } from '@shared/constants/forms/user-status.constants'
import { useBulkAllUpdateUsers, useGetUserTags } from '@shared/api/hooks'
import { resetDataStrategy } from '@shared/constants'
import { handleFormErrors } from '@shared/utils/misc'
import { gbToBytesUtil } from '@shared/utils/bytes'

import { IProps } from './interfaces/props.interface'

export const BulkAllUserActionsUpdateTabFeature = (props: IProps) => {
    const { t } = useTranslation()
    const { cleanUpDrawer } = props

    const form = useForm<BulkAllUpdateUsersCommand.Request>({
        mode: 'uncontrolled',
        name: 'bulk-all-user-actions-form',
        initialValues: {
            status: undefined,
            trafficLimitBytes: undefined,
            trafficLimitStrategy: undefined,
            expireAt: undefined,
            description: undefined,
            telegramId: undefined,
            tag: undefined
        },
        validate: zodResolver(
            BulkAllUpdateUsersCommand.RequestSchema.omit({
                expireAt: true,
                telegramId: true,
                email: true
            })
        )
    })

    const { mutate: updateUsers, isPending: isUpdatePending } = useBulkAllUpdateUsers({
        mutationFns: {
            onSuccess: () => {
                form.reset()
                cleanUpDrawer()
            }
        }
    })

    const { data: tags } = useGetUserTags()

    const handleBulkUpdate = form.onSubmit(async (values) => {
        updateUsers(
            {
                variables: {
                    ...values,
                    trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                    // @ts-expect-error - TODO: fix ZOD schema
                    telegramId: values.telegramId === '' ? null : values.telegramId,
                    email: values.email === '' ? null : values.email,
                    // @ts-expect-error - TODO: fix ZOD schema
                    expireAt: values.expireAt ? dayjs(values.expireAt).toISOString() : undefined,
                    tag: values.tag === '' ? null : values.tag
                }
            },
            {
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        )
    })

    return (
        <form onSubmit={handleBulkUpdate}>
            <Stack gap="md">
                <Text c="dimmed" size="sm">
                    {t('bulk-all-user-actions-tabs.update.tab.feature.update-fields-for-all-users')}
                </Text>

                <Select
                    allowDeselect={true}
                    clearable
                    data={userStatusValues.filter(
                        (status) => status.value !== 'EXPIRED' && status.value !== 'LIMITED'
                    )}
                    description={t('bulk-all-user-actions-tabs.update.tab.feature.user-status')}
                    key={form.key('status')}
                    label={t('bulk-all-user-actions-tabs.update.tab.feature.status')}
                    leftSection={<PiClockDuotone size="16px" />}
                    placeholder={t('bulk-all-user-actions-tabs.update.tab.feature.select-status')}
                    {...form.getInputProps('status')}
                />

                <NumberInput
                    allowDecimal={false}
                    allowNegative={false}
                    decimalScale={0}
                    description={t('create-user-modal.widget.data-limit-description')}
                    key={form.key('trafficLimitBytes')}
                    label={t('create-user-modal.widget.data-limit')}
                    leftSection={
                        <>
                            <Text
                                display="flex"
                                size="0.75rem"
                                style={{ justifyContent: 'center' }}
                                ta="center"
                                w={26}
                            >
                                GB
                            </Text>
                            <Divider orientation="vertical" />
                        </>
                    }
                    min={0}
                    {...form.getInputProps('trafficLimitBytes')}
                />

                <Select
                    allowDeselect={true}
                    clearable
                    data={resetDataStrategy(t)}
                    description={t('create-user-modal.widget.traffic-reset-strategy-description')}
                    key={form.key('trafficLimitStrategy')}
                    label={t('create-user-modal.widget.traffic-reset-strategy')}
                    leftSection={<PiClockDuotone size="16px" />}
                    placeholder={t('create-user-modal.widget.pick-value')}
                    {...form.getInputProps('trafficLimitStrategy')}
                />

                <DateTimePicker
                    clearable
                    key={form.key('expireAt')}
                    label={t('bulk-all-user-actions-tabs.update.tab.feature.expire-date')}
                    leftSection={<PiCalendar size="16px" />}
                    placeholder={t(
                        'bulk-all-user-actions-tabs.update.tab.feature.select-expiration-date'
                    )}
                    valueFormat="MMMM D, YYYY - HH:mm"
                    {...form.getInputProps('expireAt')}
                    description={
                        <Group component="span" gap="xs" mb="xs" mt="xs">
                            <Button
                                component="span"
                                onClick={() => {
                                    const currentDate = new Date()
                                    const newDate = new Date(currentDate)
                                    newDate.setMonth(newDate.getMonth() + 1)
                                    form.setFieldValue('expireAt', newDate)
                                }}
                                size="compact-xs"
                                variant="light"
                            >
                                {t('create-user-modal.widget.1-month')}
                            </Button>
                            <Button
                                component="span"
                                onClick={() => {
                                    const currentDate = new Date()
                                    const newDate = new Date(currentDate)
                                    newDate.setMonth(newDate.getMonth() + 3)
                                    form.setFieldValue('expireAt', newDate)
                                }}
                                size="compact-xs"
                                variant="light"
                            >
                                {t('create-user-modal.widget.3-months')}
                            </Button>
                            <Button
                                component="span"
                                onClick={() => {
                                    const currentDate = new Date()
                                    const newDate = new Date(currentDate)
                                    newDate.setFullYear(newDate.getFullYear() + 1)
                                    form.setFieldValue('expireAt', newDate)
                                }}
                                size="compact-xs"
                                variant="light"
                            >
                                {t('create-user-modal.widget.1-year')}
                            </Button>
                            <Button
                                component="span"
                                onClick={() => {
                                    const newDate = new Date()
                                    newDate.setFullYear(2099)
                                    form.setFieldValue('expireAt', newDate)
                                }}
                                size="compact-xs"
                                variant="light"
                            >
                                {t('create-user-modal.widget.2099-year')}
                            </Button>
                        </Group>
                    }
                    highlightToday
                />

                <NumberInput
                    allowDecimal={false}
                    hideControls
                    key={form.key('telegramId')}
                    label="Telegram ID"
                    leftSection={<PiTelegramLogoDuotone size="16px" />}
                    min={1}
                    {...form.getInputProps('telegramId')}
                />

                <TextInput
                    key={form.key('email')}
                    label="Email"
                    leftSection={<PiEnvelopeDuotone size="16px" />}
                    {...form.getInputProps('email')}
                />

                <CreateableTagInputShared
                    key={form.key('tag')}
                    {...form.getInputProps('tag')}
                    tags={tags?.tags ?? []}
                    value={form.getValues().tag}
                />

                <Textarea
                    description={t('create-user-modal.widget.user-description')}
                    key={form.key('description')}
                    label={t('use-table-columns.description')}
                    resize="vertical"
                    {...form.getInputProps('description')}
                />

                <Stack gap={'xs'}>
                    <Button
                        fullWidth
                        leftSection={<PiX size="16px" />}
                        loading={isUpdatePending}
                        mt="md"
                        onClick={cleanUpDrawer}
                        type="reset"
                        variant="light"
                    >
                        {t('bulk-all-user-actions-tabs.update.tab.feature.close')}
                    </Button>

                    <Button
                        fullWidth
                        leftSection={<PiPencil size="16px" />}
                        loading={isUpdatePending}
                        mt="md"
                        type="submit"
                    >
                        {t('bulk-all-user-actions-tabs.update.tab.feature.update-users')}
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}
