import {
    PiCalendar,
    PiClockDuotone,
    PiEnvelopeDuotone,
    PiPencil,
    PiTelegramLogoDuotone,
    PiX
} from 'react-icons/pi'
import {
    Button,
    Divider,
    NumberInput,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import { BulkUpdateUsersCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { z } from 'zod'

import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { userStatusValues } from '@shared/constants/forms/user-status.constants'
import { useBulkUpdateUsers } from '@shared/api/hooks'
import { resetDataStrategy } from '@shared/constants'
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
                telegramId: undefined
            }
        },
        validate: zodResolver(customSchema)
    })

    const { mutate: updateUsers, isPending: isUpdatePending } = useBulkUpdateUsers({
        mutationFns: {
            onSuccess: () => {
                form.reset()
                cleanUpDrawer()
            }
        }
    })

    const handleBulkUpdate = form.onSubmit(async (values) => {
        updateUsers({
            variables: {
                uuids: actions.getUuids(),
                fields: {
                    ...values.fields,
                    trafficLimitBytes: gbToBytesUtil(values.fields.trafficLimitBytes),
                    // @ts-expect-error - TODO: fix ZOD schema
                    telegramId: values.fields.telegramId === '' ? null : values.fields.telegramId,
                    email: values.fields.email === '' ? null : values.fields.email,
                    // @ts-expect-error - TODO: fix ZOD schema
                    expireAt: values.fields.expireAt
                        ? dayjs(values.fields.expireAt).toISOString()
                        : undefined
                }
            }
        })
    })

    return (
        <form onSubmit={handleBulkUpdate}>
            <Stack gap="md">
                <Text c="dimmed" size="sm">
                    {t('bulk-user-actions.update.tab.feature.update-fields-counter', {
                        usersCount: actions.getUuidLenght()
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
                    leftSection={<PiClockDuotone size="1rem" />}
                    placeholder={t('bulk-user-actions.update.tab.feature.select-status')}
                    {...form.getInputProps('fields.status')}
                />

                <NumberInput
                    allowDecimal={false}
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
                    leftSection={<PiClockDuotone size="1rem" />}
                    placeholder={t('create-user-modal.widget.pick-value')}
                    {...form.getInputProps('fields.trafficLimitStrategy')}
                />

                <DateTimePicker
                    clearable
                    label={t('bulk-user-actions.update.tab.feature.expire-date')}
                    leftSection={<PiCalendar size="1rem" />}
                    placeholder={t('bulk-user-actions.update.tab.feature.select-expiration-date')}
                    valueFormat="MMMM D, YYYY - HH:mm"
                    {...form.getInputProps('fields.expireAt')}
                />

                <NumberInput
                    allowDecimal={false}
                    key={form.key('fields.telegramId')}
                    label="Telegram ID"
                    leftSection={<PiTelegramLogoDuotone size="1rem" />}
                    min={1}
                    {...form.getInputProps('fields.telegramId')}
                />

                <TextInput
                    key={form.key('fields.email')}
                    label="Email"
                    leftSection={<PiEnvelopeDuotone size="1rem" />}
                    {...form.getInputProps('fields.email')}
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
                        leftSection={<PiX size="1rem" />}
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
                        leftSection={<PiPencil size="1rem" />}
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
