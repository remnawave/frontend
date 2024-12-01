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
import {
    PiCalendarDuotone,
    PiClockDuotone,
    PiFloppyDiskDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { z } from 'zod'

import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@/entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import {
    useDashboardStoreActions,
    useDSInbounds
} from '@/entitites/dashboard/dashboard-store/dashboard-store'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@/shared/constants'
import { gbToBytesUtil } from '@/shared/utils/bytes'
import { handleFormErrors } from '@/shared/utils'

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

    const handleCloseModal = () => {
        actions.changeModalState(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined
        if (isModalOpen) {
            ;(async () => {
                setIsLoading(true)
                try {
                    await actionsDS.getInbounds()
                } catch (error) {
                    consola.error(error)
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
                consola.error('Zod validation error:', error.errors)
            }

            if (error instanceof Error) {
                consola.error('Error message:', error.message)
                consola.error('Error stack:', error.stack)
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

    return (
        <Modal centered onClose={handleCloseModal} opened={isModalOpen} title="Create user">
            {isLoading ? (
                <LoaderModalShared h="500" text="Loading user creation..." />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        <Stack gap="md" w={400}>
                            <TextInput
                                description="Username cannot be changed later"
                                key={form.key('username')}
                                label="Username"
                                {...form.getInputProps('username')}
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

                            <NumberInput
                                allowDecimal={false}
                                decimalScale={0}
                                defaultValue={0}
                                description="Enter data limit in GB, 0 for unlimited"
                                key={form.key('trafficLimitBytes')}
                                label="Data Limit"
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
                                description="How often the user's traffic should be reset"
                                key={form.key('trafficLimitStrategy')}
                                label="Traffic reset strategy"
                                leftSection={<PiClockDuotone size="1rem" />}
                                placeholder="Pick value"
                                {...form.getInputProps('trafficLimitStrategy')}
                            />

                            <DateTimePicker
                                key={form.key('expireAt')}
                                label="Expiry Date"
                                valueFormat="MMMM D, YYYY - HH:mm"
                                {...form.getInputProps('expireAt')}
                                leftSection={<PiCalendarDuotone size="1rem" />}
                            />

                            <Checkbox.Group
                                key={form.key('activeUserInbounds')}
                                {...form.getInputProps('activeUserInbounds')}
                                description="Select available inbounds for this user"
                                label="Inbounds"
                            >
                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        sm: 1,
                                        md: 2
                                    }}
                                    pt="md"
                                >
                                    {inbounds?.map((inbound) => (
                                        <>
                                            <InboundCheckboxCardWidget
                                                inbound={inbound}
                                                key={inbound.uuid}
                                            />
                                        </>
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
                            Create user
                        </Button>
                    </Group>
                </form>
            )}
        </Modal>
    )
}
