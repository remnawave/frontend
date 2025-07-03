import {
    Anchor,
    Button,
    Checkbox,
    Code,
    Divider,
    em,
    Fieldset,
    Group,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title
} from '@mantine/core'
import {
    PiCalendarDuotone,
    PiClockDuotone,
    PiEnvelopeDuotone,
    PiFloppyDiskDuotone,
    PiTelegramLogoDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { TbChartLine, TbDevices2, TbMail, TbSettings, TbShield } from 'react-icons/tb'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useEffect, useMemo, useState } from 'react'
import { HiIdentification } from 'react-icons/hi'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { motion } from 'motion/react'
import dayjs from 'dayjs'

import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { CreateableTagInputShared } from '@shared/ui/createable-tag-input/createable-tag-input'
import { useCreateUser, useGetInternalSquads, useGetUserTags } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@shared/constants'
import { handleFormErrors } from '@shared/utils/misc'
import { gbToBytesUtil } from '@shared/utils/bytes'

import { InternalSquadsListWidget } from '../internal-squads-list'

const MotionWrapper = motion.div
const MotionStack = motion(Stack)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

export const CreateUserModalWidget = () => {
    const { t } = useTranslation()

    const [searchQuery, setSearchQuery] = useState('')

    const isModalOpen = useUserCreationModalStoreIsModalOpen()
    const actions = useUserCreationModalStoreActions()

    const { data: internalSquads, isLoading: isInternalSquadsLoading } = useGetInternalSquads()

    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)

    const {
        mutate: createUser,
        isPending: isDataSubmitting,
        isSuccess: isUserCreated
    } = useCreateUser()

    const form = useForm<CreateUserCommand.Request>({
        name: 'create-user-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        validate: zodResolver(
            CreateUserCommand.RequestSchema.omit({
                expireAt: true,
                hwidDeviceLimit: true
            })
        ),

        initialValues: {
            status: USERS_STATUS.ACTIVE,
            username: '',
            trafficLimitStrategy: 'NO_RESET',
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            trafficLimitBytes: 0,
            description: '',
            telegramId: undefined,
            email: undefined,
            hwidDeviceLimit: undefined,
            tag: undefined,
            activeInternalSquads: []
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
        createUser(
            {
                variables: {
                    username: values.username,
                    trafficLimitStrategy: values.trafficLimitStrategy,
                    trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                    // @ts-expect-error - TODO: fix ZOD schema
                    expireAt: dayjs(values.expireAt).toISOString(),
                    status: values.status,
                    description: values.description,
                    telegramId: values.telegramId,
                    email: values.email,
                    hwidDeviceLimit: values.hwidDeviceLimit,
                    tag: values.tag,
                    activeInternalSquads: values.activeInternalSquads
                }
            },
            {
                onError: (error) => handleFormErrors(form, error)
            }
        )
    })

    const filteredInternalSquads = useMemo(() => {
        const allInternalSquads = internalSquads?.internalSquads || []
        if (!searchQuery.trim()) return allInternalSquads

        const query = searchQuery.toLowerCase().trim()
        return allInternalSquads.filter((internalSquad) =>
            internalSquad.name?.toLowerCase().includes(query)
        )
    }, [internalSquads, searchQuery])

    return (
        <Modal
            centered
            onClose={handleCloseModal}
            opened={isModalOpen}
            size="1000px"
            title={t('create-user-modal.widget.create-user')}
        >
            {isInternalSquadsLoading || isTagsLoading ? (
                <LoaderModalShared
                    h="500"
                    text={t('create-user-modal.widget.loading-user-creation')}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                        <MotionStack
                            animate="visible"
                            gap="lg"
                            initial="hidden"
                            style={{ flex: '1 1 450px' }}
                            variants={containerVariants}
                        >
                            <MotionWrapper variants={cardVariants}>
                                <Fieldset
                                    legend={
                                        <Group gap="xs" mb="xs">
                                            <HiIdentification
                                                size={20}
                                                style={{
                                                    color: 'var(--mantine-color-blue-4)'
                                                }}
                                            />
                                            <Title c="blue.4" order={4}>
                                                User Identity
                                            </Title>
                                        </Group>
                                    }
                                >
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
                                </Fieldset>
                            </MotionWrapper>

                            <MotionWrapper variants={cardVariants}>
                                <Fieldset
                                    legend={
                                        <Group gap="xs" mb="xs">
                                            <TbMail
                                                size={20}
                                                style={{
                                                    color: 'var(--mantine-color-teal-6)'
                                                }}
                                            />
                                            <Title c="teal.6" order={5}>
                                                Contact Information
                                            </Title>
                                        </Group>
                                    }
                                >
                                    <Stack gap="md">
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
                                            description={t(
                                                'create-user-modal.widget.email-of-a-user'
                                            )}
                                            key={form.key('email')}
                                            label="Email"
                                            leftSection={<PiEnvelopeDuotone size="1rem" />}
                                            {...form.getInputProps('email')}
                                        />
                                    </Stack>
                                </Fieldset>
                            </MotionWrapper>

                            <MotionWrapper variants={cardVariants}>
                                <Fieldset
                                    legend={
                                        <Group gap="xs" mb="xs">
                                            <TbSettings
                                                size={20}
                                                style={{
                                                    color: 'var(--mantine-color-orange-4)'
                                                }}
                                            />
                                            <Title c="orange.4" order={5}>
                                                Device & Tag Settings
                                            </Title>
                                        </Group>
                                    }
                                >
                                    <Stack gap="xs">
                                        <NumberInput
                                            allowDecimal={false}
                                            allowNegative={false}
                                            description={
                                                <>
                                                    <Text
                                                        c="dimmed"
                                                        component="span"
                                                        size="0.75rem"
                                                    >
                                                        {t(
                                                            'create-user-modal.widget.hwid-user-limit-line-1'
                                                        )}{' '}
                                                        <Code>HWID_DEVICE_LIMIT_ENABLED</Code>{' '}
                                                        {t(
                                                            'create-user-modal.widget.hwid-user-limit-line-2'
                                                        )}{' '}
                                                        <Code>true</Code>.{' '}
                                                        <Anchor
                                                            href="https://remna.st/docs/features/hwid-device-limit"
                                                            target="_blank"
                                                        >
                                                            {t(
                                                                'create-user-modal.widget.hwid-user-limit-line-3'
                                                            )}
                                                        </Anchor>
                                                    </Text>
                                                    <Checkbox
                                                        checked={
                                                            form.getValues().hwidDeviceLimit === 0
                                                        }
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
                                            descriptionProps={{
                                                component: 'div'
                                            }}
                                            disabled={form.getValues().hwidDeviceLimit === 0}
                                            hideControls
                                            key={form.key('hwidDeviceLimit')}
                                            label={t('create-user-modal.widget.hwid-device-limit')}
                                            leftSection={<TbDevices2 size="1rem" />}
                                            placeholder="100"
                                            {...form.getInputProps('hwidDeviceLimit')}
                                        />

                                        <CreateableTagInputShared
                                            key={form.key('tag')}
                                            {...form.getInputProps('tag')}
                                            tags={tags?.tags ?? []}
                                        />

                                        <Textarea
                                            description={t(
                                                'create-user-modal.widget.user-description'
                                            )}
                                            key={form.key('description')}
                                            label={t('use-table-columns.description')}
                                            resize="vertical"
                                            {...form.getInputProps('description')}
                                        />
                                    </Stack>
                                </Fieldset>
                            </MotionWrapper>
                        </MotionStack>

                        <MotionStack
                            animate="visible"
                            gap="lg"
                            initial="hidden"
                            style={{ flex: '1 1 450px' }}
                            variants={containerVariants}
                        >
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
                                        </Group>
                                    }
                                >
                                    <Stack gap="md">
                                        <NumberInput
                                            allowDecimal={false}
                                            decimalScale={0}
                                            defaultValue={0}
                                            description={t(
                                                'create-user-modal.widget.data-limit-description'
                                            )}
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
                                            label={t(
                                                'create-user-modal.widget.traffic-reset-strategy'
                                            )}
                                            leftSection={<PiClockDuotone size="1rem" />}
                                            placeholder={t('create-user-modal.widget.pick-value')}
                                            {...form.getInputProps('trafficLimitStrategy')}
                                        />
                                    </Stack>
                                </Fieldset>
                            </MotionWrapper>

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
                                                Access Settings
                                            </Title>
                                        </Group>
                                    }
                                >
                                    <Stack gap="md">
                                        <DateTimePicker
                                            key={form.key('expireAt')}
                                            label={t('create-user-modal.widget.expiry-date')}
                                            minDate={new Date()}
                                            required
                                            valueFormat="MMMM D, YYYY - HH:mm"
                                            {...form.getInputProps('expireAt')}
                                            description={t(
                                                'create-user-modal.widget.expire-at-description'
                                            )}
                                            highlightToday
                                            leftSection={<PiCalendarDuotone size="1rem" />}
                                            onChange={(date) => {
                                                const formInputProps =
                                                    form.getInputProps('expireAt')
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
                                                    const currentDate =
                                                        form.values.expireAt || new Date()
                                                    const newDate = new Date(currentDate)
                                                    newDate.setMonth(newDate.getMonth() + 1)
                                                    form.setFieldValue('expireAt', newDate)
                                                }
                                            }}
                                            presets={[
                                                {
                                                    value: dayjs()
                                                        .add(1, 'month')
                                                        .format('YYYY-MM-DD HH:mm:ss'),
                                                    label: t('create-user-modal.widget.1-month')
                                                },
                                                {
                                                    value: dayjs()
                                                        .add(3, 'months')
                                                        .format('YYYY-MM-DD HH:mm:ss'),
                                                    label: t('create-user-modal.widget.3-months')
                                                },
                                                {
                                                    value: dayjs()
                                                        .add(1, 'year')
                                                        .format('YYYY-MM-DD HH:mm:ss'),
                                                    label: t('create-user-modal.widget.1-year')
                                                },
                                                {
                                                    value: dayjs()
                                                        .year(2099)
                                                        .format('YYYY-MM-DD HH:mm:ss'),
                                                    label: t('create-user-modal.widget.2099-year')
                                                }
                                            ]}
                                        />

                                        <InternalSquadsListWidget
                                            description={t(
                                                'create-user-modal.widget.internal-squads-description'
                                            )}
                                            filteredInternalSquads={filteredInternalSquads}
                                            formKey={form.key('activeInternalSquads')}
                                            label={t('create-user-modal.widget.internal-squads')}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            {...form.getInputProps('activeInternalSquads')}
                                        />
                                    </Stack>
                                </Fieldset>
                            </MotionWrapper>
                        </MotionStack>
                    </Group>

                    <Modal.Header
                        bottom={10}
                        component={'footer'}
                        h={'auto'}
                        pos={'sticky'}
                        style={{
                            bottom: 0,
                            borderTop: 'none',
                            borderBottom: 'none',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3)',
                            padding: '10px'
                        }}
                    >
                        <Group
                            gap="md"
                            grow={!!isMobile}
                            justify="flex-end"
                            preventGrowOverflow={false}
                            w="100%"
                            wrap="wrap"
                        >
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
                    </Modal.Header>
                </form>
            )}
        </Modal>
    )
}
