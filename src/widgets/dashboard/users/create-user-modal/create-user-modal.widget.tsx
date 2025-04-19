import {
    Anchor,
    Button,
    Checkbox,
    Code,
    Divider,
    Group,
    Modal,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import {
    PiCalendarDuotone,
    PiClockDuotone,
    PiEnvelopeDuotone,
    PiFloppyDiskDuotone,
    PiTelegramLogoDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { TbDevices2 } from 'react-icons/tb'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { useCreateUser, useGetInbounds } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@shared/constants'
import { gbToBytesUtil } from '@shared/utils/bytes'

import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'

export const CreateUserModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useUserCreationModalStoreIsModalOpen()
    const actions = useUserCreationModalStoreActions()

    const { data: inbounds, isLoading } = useGetInbounds()

    const {
        mutate: createUser,
        isPending: isDataSubmitting,
        isSuccess: isUserCreated
    } = useCreateUser()

    const form = useForm<CreateUserCommand.Request>({
        name: 'create-user-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            CreateUserCommand.RequestSchema.omit({ expireAt: true, hwidDeviceLimit: true })
        ),

        initialValues: {
            status: USERS_STATUS.ACTIVE,
            username: '',
            trafficLimitStrategy: 'NO_RESET',
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            trafficLimitBytes: 0,
            activeUserInbounds: [],
            description: '',
            telegramId: undefined,
            email: undefined,
            hwidDeviceLimit: undefined
        }
    })

    const handleCloseModal = () => {
        actions.changeModalState(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    useEffect(() => {
        if (isUserCreated) {
            handleCloseModal()
        }
    }, [isUserCreated])

    const handleSubmit = form.onSubmit(async (values) => {
        createUser({
            variables: {
                username: values.username,
                trafficLimitStrategy: values.trafficLimitStrategy,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                // @ts-expect-error - TODO: fix ZOD schema
                expireAt: dayjs(values.expireAt).toISOString(),
                activeUserInbounds: values.activeUserInbounds,
                status: values.status,
                description: values.description,
                telegramId: values.telegramId,
                email: values.email,
                hwidDeviceLimit: values.hwidDeviceLimit
            }
        })
    })

    return (
        <Modal
            centered
            onClose={handleCloseModal}
            opened={isModalOpen}
            size="900px"
            title={t('create-user-modal.widget.create-user')}
        >
            {isLoading ? (
                <LoaderModalShared
                    h="500"
                    text={t('create-user-modal.widget.loading-user-creation')}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
                            <TextInput
                                description={t(
                                    'create-user-modal.widget.username-cannot-be-changed-later'
                                )}
                                key={form.key('username')}
                                label={t('login-form-feature.username')}
                                required
                                {...form.getInputProps('username')}
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

                            <NumberInput
                                allowDecimal={false}
                                allowNegative={false}
                                description={t(
                                    'create-user-modal.widget.telegram-id-of-a-user-in-telegram'
                                )}
                                hideControls
                                key={form.key('telegramId')}
                                label="Telegram ID"
                                leftSection={<PiTelegramLogoDuotone size="1rem" />}
                                {...form.getInputProps('telegramId')}
                            />

                            <TextInput
                                description={t('create-user-modal.widget.email-of-a-user')}
                                key={form.key('email')}
                                label="Email"
                                leftSection={<PiEnvelopeDuotone size="1rem" />}
                                {...form.getInputProps('email')}
                            />

                            <Stack gap="xs">
                                <NumberInput
                                    allowDecimal={false}
                                    allowNegative={false}
                                    description={
                                        <>
                                            <Text c="dimmed" size="0.75rem">
                                                {t(
                                                    'create-user-modal.widget.hwid-user-limit-line-1'
                                                )}{' '}
                                                <Code>HWID_DEVICE_LIMIT_ENABLED</Code>{' '}
                                                {t(
                                                    'create-user-modal.widget.hwid-user-limit-line-2'
                                                )}{' '}
                                                <Code>true</Code>.{' '}
                                                <Anchor
                                                    href="https://remna.st/features/hwid-device-limit"
                                                    target="_blank"
                                                >
                                                    {t(
                                                        'create-user-modal.widget.hwid-user-limit-line-3'
                                                    )}
                                                </Anchor>
                                            </Text>
                                            <Checkbox
                                                checked={form.getValues().hwidDeviceLimit === 0}
                                                label={t(
                                                    'create-user-modal.widget.disable-hwid-limit'
                                                )}
                                                mb={'xs'}
                                                mt={'xs'}
                                                onChange={(event) => {
                                                    const { checked } = event.currentTarget
                                                    form.setFieldValue(
                                                        'hwidDeviceLimit',
                                                        checked ? 0 : undefined
                                                    )
                                                }}
                                            />
                                        </>
                                    }
                                    disabled={form.getValues().hwidDeviceLimit === 0}
                                    hideControls
                                    key={form.key('hwidDeviceLimit')}
                                    label={t('create-user-modal.widget.hwid-device-limit')}
                                    leftSection={<TbDevices2 size="1rem" />}
                                    placeholder="100"
                                    {...form.getInputProps('hwidDeviceLimit')}
                                />
                            </Stack>

                            <Textarea
                                description={t('create-user-modal.widget.user-description')}
                                key={form.key('description')}
                                label={t('use-table-columns.description')}
                                resize="vertical"
                                {...form.getInputProps('description')}
                            />
                        </Stack>

                        <Divider
                            className="responsive-divider"
                            orientation="vertical"
                            visibleFrom="md"
                        />

                        <Stack gap="md" style={{ flex: '1 1 350px' }}>
                            <NumberInput
                                allowDecimal={false}
                                decimalScale={0}
                                defaultValue={0}
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
                                {...form.getInputProps('trafficLimitBytes')}
                            />

                            <Select
                                allowDeselect={false}
                                data={resetDataStrategy(t)}
                                defaultValue={form.values.trafficLimitStrategy}
                                description={t(
                                    'create-user-modal.widget.traffic-reset-strategy-description'
                                )}
                                key={form.key('trafficLimitStrategy')}
                                label={t('create-user-modal.widget.traffic-reset-strategy')}
                                leftSection={<PiClockDuotone size="1rem" />}
                                placeholder={t('create-user-modal.widget.pick-value')}
                                {...form.getInputProps('trafficLimitStrategy')}
                            />

                            <DateTimePicker
                                key={form.key('expireAt')}
                                label={t('create-user-modal.widget.expiry-date')}
                                minDate={new Date()}
                                required
                                valueFormat="MMMM D, YYYY - HH:mm"
                                {...form.getInputProps('expireAt')}
                                description={
                                    <Group component="span" gap="xs" mb="xs" mt="xs">
                                        <Button
                                            component="span"
                                            onClick={() => {
                                                const currentDate =
                                                    form.values.expireAt || new Date()
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
                                                const currentDate =
                                                    form.values.expireAt || new Date()
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
                                                const currentDate =
                                                    form.values.expireAt || new Date()
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
                                leftSection={<PiCalendarDuotone size="1rem" />}
                            />

                            <Checkbox.Group
                                key={form.key('activeUserInbounds')}
                                {...form.getInputProps('activeUserInbounds')}
                                description={t('create-user-modal.widget.inbounds-description')}
                                label={t('create-user-modal.widget.inbounds')}
                            >
                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        sm: 1,
                                        md: 2
                                    }}
                                    key="create-user-inbounds-grid"
                                    pt="md"
                                >
                                    {inbounds?.map((inbound) => (
                                        <InboundCheckboxCardWidget
                                            inbound={inbound}
                                            key={inbound.uuid}
                                        />
                                    ))}
                                </SimpleGrid>
                            </Checkbox.Group>
                        </Stack>
                    </Group>

                    <Group justify="right" mt="xl">
                        <Button
                            color="teal"
                            leftSection={<PiFloppyDiskDuotone size="1rem" />}
                            loading={isDataSubmitting}
                            size="md"
                            type="submit"
                            variant="outline"
                        >
                            {t('create-user-modal.widget.create-user')}
                        </Button>
                    </Group>
                </form>
            )}
        </Modal>
    )
}
