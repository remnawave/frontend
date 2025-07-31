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
import { BulkUpdateUsersCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { z } from 'zod'

import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { CreateableTagInputShared } from '@shared/ui/createable-tag-input/createable-tag-input'
import { userStatusValues } from '@shared/constants/forms/user-status.constants'
import { useBulkUpdateUsers, useGetUserTags } from '@shared/api/hooks'
import { resetDataStrategy } from '@shared/constants'
import { handleFormErrors } from '@shared/utils/misc'
import { gbToBytesUtil } from '@shared/utils/bytes'

import { IProps } from './interfaces/props.interface'

const originalFieldsSchema = BulkUpdateUsersCommand.RequestSchema.shape.fields

const fieldsWithoutExpireAt = originalFieldsSchema.omit({
    expireAt: true,
    email: true,
    telegramId: true
})

const customSchema = z.object({
    fields: fieldsWithoutExpireAt
})

export const BulkUserActionsUpdateTabFeature = (props: IProps) => {
    const { cleanUpDrawer } = props
    const { t } = useTranslation()

    const actions = useBulkUsersActionsStoreActions()

    const form = useForm<BulkUpdateUsersCommand.Request>({
        mode: 'uncontrolled',
        name: 'bulk-user-actions-form',
        initialValues: {
            uuids: [],
            fields: {
                status: undefined,
                trafficLimitBytes: undefined,
                trafficLimitStrategy: undefined,
                expireAt: undefined,
                description: undefined,
                telegramId: undefined,
                tag: undefined
            }
        },
        validate: zodResolver(customSchema)
    })

    const { data: tags } = useGetUserTags()

    const { mutate: updateUsers, isPending: isUpdatePending } = useBulkUpdateUsers({
        mutationFns: {
            onSuccess: () => {
                form.reset()
                cleanUpDrawer()
            }
        }
    })

    const handleBulkUpdate = form.onSubmit(async (values) => {
        updateUsers(
            {
                variables: {
                    uuids: actions.getUuids(),
                    fields: {
                        ...values.fields,
                        trafficLimitBytes: gbToBytesUtil(values.fields.trafficLimitBytes),
                        telegramId:
                            // @ts-expect-error - TODO: fix ZOD schema
                            values.fields.telegramId === '' ? null : values.fields.telegramId,
                        email: values.fields.email === '' ? null : values.fields.email,
                        // @ts-expect-error - TODO: fix ZOD schema
                        expireAt: values.fields.expireAt
                            ? dayjs(values.fields.expireAt).toISOString()
                            : undefined,
                        tag: values.fields.tag === '' ? null : values.fields.tag
                    }
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
                    {t('bulk-user-actions.update.tab.feature.update-fields-counter', {
                        usersCount: actions.getUuidLength()
                    })}
                </Text>

                <Select
                    allowDeselect={true}
                    clearable
                    data={userStatusValues.filter(
                        (status) => status.value !== 'EXPIRED' && status.value !== 'LIMITED'
                    )}
                    description={t('bulk-user-actions.update.tab.feature.user-status')}
                    key={form.key('fields.status')}
                    label={t('bulk-user-actions.update.tab.feature.status')}
                    leftSection={<PiClockDuotone size="16px" />}
                    placeholder={t('bulk-user-actions.update.tab.feature.select-status')}
                    {...form.getInputProps('fields.status')}
                />

                <NumberInput
                    allowDecimal={false}
                    allowNegative={false}
                    decimalScale={0}
                    description={t('create-user-modal.widget.data-limit-description')}
                    key={form.key('fields.trafficLimitBytes')}
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
                    {...form.getInputProps('fields.trafficLimitBytes')}
                />

                <Select
                    allowDeselect={true}
                    clearable
                    data={resetDataStrategy(t)}
                    description={t('create-user-modal.widget.traffic-reset-strategy-description')}
                    key={form.key('fields.trafficLimitStrategy')}
                    label={t('create-user-modal.widget.traffic-reset-strategy')}
                    leftSection={<PiClockDuotone size="16px" />}
                    placeholder={t('create-user-modal.widget.pick-value')}
                    {...form.getInputProps('fields.trafficLimitStrategy')}
                />

                <DateTimePicker
                    clearable
                    description={
                        <Group component="span" gap="xs" mb="xs" mt="xs">
                            <Button
                                component="span"
                                onClick={() => {
                                    const currentDate = new Date()
                                    const newDate = new Date(currentDate)
                                    newDate.setMonth(newDate.getMonth() + 1)
                                    form.setFieldValue('fields.expireAt', newDate)
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
                                    form.setFieldValue('fields.expireAt', newDate)
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
                                    form.setFieldValue('fields.expireAt', newDate)
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
                                    form.setFieldValue('fields.expireAt', newDate)
                                }}
                                size="compact-xs"
                                variant="light"
                            >
                                {t('create-user-modal.widget.2099-year')}
                            </Button>
                        </Group>
                    }
                    highlightToday
                    key={form.key('fields.expireAt')}
                    label={t('bulk-user-actions.update.tab.feature.expire-date')}
                    leftSection={<PiCalendar size="16px" />}
                    placeholder={t('bulk-user-actions.update.tab.feature.select-expiration-date')}
                    valueFormat="MMMM D, YYYY - HH:mm"
                    {...form.getInputProps('fields.expireAt')}
                />

                <NumberInput
                    allowDecimal={false}
                    allowNegative={false}
                    hideControls
                    key={form.key('fields.telegramId')}
                    label="Telegram ID"
                    leftSection={<PiTelegramLogoDuotone size="16px" />}
                    min={1}
                    {...form.getInputProps('fields.telegramId')}
                />

                <TextInput
                    key={form.key('fields.email')}
                    label="Email"
                    leftSection={<PiEnvelopeDuotone size="16px" />}
                    {...form.getInputProps('fields.email')}
                />

                <CreateableTagInputShared
                    key={form.key('fields.tag')}
                    {...form.getInputProps('fields.tag')}
                    tags={tags?.tags ?? []}
                    value={form.getValues().fields.tag}
                />

                <Textarea
                    description={t('create-user-modal.widget.user-description')}
                    key={form.key('fields.description')}
                    label={t('use-table-columns.description')}
                    resize="vertical"
                    {...form.getInputProps('fields.description')}
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
                        {t('bulk-user-actions.update.tab.feature.close')}
                    </Button>

                    <Button
                        fullWidth
                        leftSection={<PiPencil size="16px" />}
                        loading={isUpdatePending}
                        mt="md"
                        type="submit"
                    >
                        {t('bulk-user-actions.update.tab.feature.update-users')}
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}
