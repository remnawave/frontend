import { useEffect, useState } from 'react'

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
    TextInput
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import {
    PiCalendarDuotone,
    PiClockDuotone,
    PiFloppyDiskDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { z } from 'zod'
import {
    useDashboardStoreActions,
    useDSInbounds
} from '@/entitites/dashboard/dashboard-store/dashboard-store'
import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@/entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import { resetDataStrategy } from '@/shared/constants'
import { handleFormErrors } from '@/shared/utils'
import { gbToBytesUtil } from '@/shared/utils/bytes'
import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'

export const CreateUserModalWidget = () => {
    const isModalOpen = useUserCreationModalStoreIsModalOpen()
    const actions = useUserCreationModalStoreActions()
    const inbounds = useDSInbounds()
    const actionsDS = useDashboardStoreActions()

    const [isLoading, setIsLoading] = useState(true)
    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

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
            activeUserInbounds: []
        }
    })

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined
        if (isModalOpen) {
            ;(async () => {
                setIsLoading(true)
                try {
                    await actionsDS.getInbounds()
                } catch (error) {
                    console.error(error)
                } finally {
                    timeout = setTimeout(() => {
                        setIsLoading(false)
                    }, 300)
                }
            })()
            if (!isModalOpen) {
                if (timeout) {
                    clearTimeout(timeout)
                }
            }
        }
    }, [isModalOpen])

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true)
            const createData = {
                username: values.username,
                trafficLimitStrategy: values.trafficLimitStrategy,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                expireAt: values.expireAt,
                activeUserInbounds: values.activeUserInbounds,
                status: values.status
            }

            const res = await actions.createUser(createData)

            if (res) {
                notifications.show({
                    title: 'Success',
                    message: 'User created successfully',
                    color: 'green'
                })
                handleCloseModal()
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Zod validation error:', error.errors)
            }

            if (error instanceof Error) {
                console.error('Error message:', error.message)
                console.error('Error stack:', error.stack)
            }

            handleFormErrors(form, error)

            notifications.show({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to update user',
                color: 'red'
            })
        } finally {
            setIsDataSubmitting(false)
        }
    })

    const handleCloseModal = () => {
        actions.changeModalState(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    return (
        <Modal opened={isModalOpen} onClose={handleCloseModal} title="Create user" centered>
            {isLoading ? (
                <LoaderModalShared text="Loading user creation..." h="500" />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        <Stack gap="md" w={400}>
                            <TextInput
                                label="Username"
                                description="Username cannot be changed later"
                                key={form.key('username')}
                                {...form.getInputProps('username')}
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

                            <NumberInput
                                leftSection={
                                    <>
                                        <Text
                                            ta="center"
                                            size="0.75rem"
                                            w={26}
                                            display="flex"
                                            style={{ justifyContent: 'center' }}
                                        >
                                            GB
                                        </Text>
                                        <Divider orientation="vertical" />
                                    </>
                                }
                                label="Data Limit"
                                description="Enter data limit in GB, 0 for unlimited"
                                allowDecimal={false}
                                defaultValue={0}
                                decimalScale={0}
                                key={form.key('trafficLimitBytes')}
                                {...form.getInputProps('trafficLimitBytes')}
                            />

                            <Select
                                label="Traffic reset strategy"
                                description="How often the user's traffic should be reset"
                                placeholder="Pick value"
                                allowDeselect={false}
                                defaultValue={form.values.trafficLimitStrategy}
                                data={resetDataStrategy}
                                leftSection={<PiClockDuotone size="1rem" />}
                                key={form.key('trafficLimitStrategy')}
                                {...form.getInputProps('trafficLimitStrategy')}
                            />

                            <DateTimePicker
                                label="Expiry Date"
                                valueFormat="MMMM D, YYYY - HH:mm"
                                key={form.key('expireAt')}
                                {...form.getInputProps('expireAt')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                            />

                            <Checkbox.Group
                                key={form.key('activeUserInbounds')}
                                {...form.getInputProps('activeUserInbounds')}
                                label="Inbounds"
                                description="Select available inbounds for this user"
                            >
                                <SimpleGrid
                                    pt="md"
                                    cols={{
                                        base: 1,
                                        sm: 1,
                                        md: 2
                                    }}
                                >
                                    {inbounds?.map((inbound) => (
                                        <>
                                            <InboundCheckboxCardWidget
                                                key={inbound.uuid}
                                                inbound={inbound}
                                            />
                                        </>
                                    ))}
                                </SimpleGrid>
                            </Checkbox.Group>
                        </Stack>
                    </Group>

                    <Group justify="right" mt="xl">
                        <Button
                            type="submit"
                            color="teal"
                            leftSection={<PiFloppyDiskDuotone size="1rem" />}
                            variant="outline"
                            size="md"
                            loading={isDataSubmitting}
                        >
                            Create user
                        </Button>
                    </Group>
                </form>
            )}
        </Modal>
    )
}
