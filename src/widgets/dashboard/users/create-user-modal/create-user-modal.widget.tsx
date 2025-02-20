import {
    Button,
    Checkbox,
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
    PiFloppyDiskDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

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
        validate: zodResolver(CreateUserCommand.RequestSchema),
        initialValues: {
            status: USERS_STATUS.ACTIVE,
            username: '',
            trafficLimitStrategy: 'NO_RESET',
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            trafficLimitBytes: 0,
            activeUserInbounds: [],
            description: ''
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
                expireAt: values.expireAt,
                activeUserInbounds: values.activeUserInbounds,
                status: values.status,
                description: values.description
            }
        })
    })

    return (
        <Modal
            centered
            onClose={handleCloseModal}
            opened={isModalOpen}
            title={t('create-user-modal.widget.create-user')}
        >
            {isLoading ? (
                <LoaderModalShared
                    h="500"
                    text={t('create-user-modal.widget.loading-user-creation')}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        <Stack gap="md" w={400}>
                            <TextInput
                                description={t(
                                    'create-user-modal.widget.username-cannot-be-changed-later'
                                )}
                                key={form.key('username')}
                                label={t('login-form-feature.username')}
                                {...form.getInputProps('username')}
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

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
                                data={resetDataStrategy}
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
                                valueFormat="MMMM D, YYYY - HH:mm"
                                {...form.getInputProps('expireAt')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                            />

                            <Textarea
                                description={t('create-user-modal.widget.user-description')}
                                key={form.key('description')}
                                label={t('use-table-columns.description')}
                                resize="vertical"
                                {...form.getInputProps('description')}
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
