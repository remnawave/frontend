import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Modal,
    NumberInput,
    Progress,
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
    PiLinkDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { z } from 'zod'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUser
} from '@/entitites/dashboard/user-modal-store/user-modal-store'
import {
    useDashboardStoreActions,
    useDSInbounds
} from '@/entitites/dashboard/dashboard-store/dashboard-store'
import { ToggleUserStatusButtonFeature } from '@/features/ui/dashboard/users/toggle-user-status-button'
import { RevokeSubscriptionUserFeature } from '@/features/ui/dashboard/users/revoke-subscription-user'
import { ResetUsageUserFeature } from '@/features/ui/dashboard/users/reset-usage-user'
import { bytesToGbUtil, gbToBytesUtil, prettyBytesUtil } from '@/shared/utils/bytes'
import { DeleteUserFeature } from '@/features/ui/dashboard/users/delete-user'
import { UserStatusBadge } from '@/widgets/dashboard/users/user-status-badge'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@/shared/constants'
import { handleFormErrors } from '@/shared/utils'

import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'
import { IFormValues } from './interfaces'

export const ViewUserModal = () => {
    const isModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const user = useUserModalStoreUser()
    const inbounds = useDSInbounds()
    const actionsDS = useDashboardStoreActions()

    const [isLoading, setIsLoading] = useState(true)
    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

    const form = useForm<IFormValues>({
        name: 'edit-user-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateUserCommand.RequestSchema)
    })

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined
        if (isModalOpen) {
            ;(async () => {
                setIsLoading(true)
                try {
                    await actions.getUser()
                    await actionsDS.getInbounds()
                } finally {
                    timeout = setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                }
            })()
        }

        if (!isModalOpen) {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [isModalOpen])

    useEffect(() => {
        if (user && inbounds) {
            const activeInboundUuids = user.activeUserInbounds.map((inbound) => inbound.uuid)

            form.setValues({
                uuid: user.uuid,
                username: user.username,
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
                activeUserInbounds: activeInboundUuids,
                shortUuid: user.shortUuid,
                trojanPassword: user.trojanPassword
            })
        }
    }, [user, inbounds])

    if (!user) {
        return null
    }

    const usedTrafficPercentage = (user.usedTrafficBytes / user.trafficLimitBytes) * 100
    const totalUsedTraffic = prettyBytesUtil(user.usedTrafficBytes, true)

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true)
            const updateData = {
                uuid: values.uuid,
                trafficLimitStrategy: values.trafficLimitStrategy,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                expireAt: values.expireAt,
                activeUserInbounds: values.activeUserInbounds
            }

            await actions.updateUser(updateData)

            notifications.show({
                title: 'Success',
                message: 'User updated successfully',
                color: 'green'
            })
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

    const handleClose = () => {
        actions.changeModalState(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    return (
        <Modal centered onClose={handleClose} opened={isModalOpen} size="900px" title="Edit user">
            {isLoading ? (
                <LoaderModalShared h="400" text="Loading user data..." />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        {/* Left Section - User Settings */}
                        <Stack gap="md" w={400}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <Text fw={500}>User details</Text>
                                <UserStatusBadge status={user.status} />
                            </Group>

                            <TextInput
                                description="Username cannot be changed"
                                key={form.key('username')}
                                label="Username"
                                {...form.getInputProps('username')}
                                disabled
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

                            <TextInput
                                key={form.key('shortUuid')}
                                label="Subscription short uuid"
                                {...form.getInputProps('shortUuid')}
                                disabled
                                leftSection={<PiLinkDuotone size="1rem" />}
                            />
                        </Stack>

                        <Divider orientation="vertical" />

                        {/* Right Section - Connection Details */}
                        <Stack gap="md" w={400}>
                            <Text fw={500}>Connection Details</Text>

                            <NumberInput
                                allowDecimal={false}
                                decimalScale={0}
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

                            <Box>
                                <Progress
                                    color={usedTrafficPercentage > 100 ? 'yellow.9' : 'teal.9'}
                                    size="xl"
                                    striped
                                    value={usedTrafficPercentage}
                                />
                                <Group gap="xs" justify="center" mt={2}>
                                    <Text c="white" fw={500} size="sm">
                                        {totalUsedTraffic === '0' ? '' : totalUsedTraffic}
                                    </Text>
                                </Group>
                            </Box>

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

                    <Group justify="space-between" mt="xl">
                        <Group>
                            <ActionIcon.Group>
                                <DeleteUserFeature />
                                <ResetUsageUserFeature />
                                <RevokeSubscriptionUserFeature />
                            </ActionIcon.Group>
                        </Group>
                        <Group>
                            <ToggleUserStatusButtonFeature />
                            <Button
                                color="blue"
                                leftSection={<PiFloppyDiskDuotone size="1rem" />}
                                loading={isDataSubmitting}
                                size="md"
                                type="submit"
                                variant="outline"
                            >
                                Edit user
                            </Button>
                        </Group>
                    </Group>
                </form>
            )}
        </Modal>
    )
}
