import { useEffect, useState } from 'react'

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
import { DateTimePicker } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import {
    PiCalendarDuotone,
    PiClockDuotone,
    PiFloppyDiskDuotone,
    PiLinkDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { z } from 'zod'
import {
    useDashboardStoreActions,
    useDSInbounds
} from '@/entitites/dashboard/dashboard-store/dashboard-store'
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUser
} from '@/entitites/dashboard/user-modal-store/user-modal-store'
import { DeleteUserFeature } from '@/features/ui/dashboard/users/delete-user'
import { ResetUsageUserFeature } from '@/features/ui/dashboard/users/reset-usage-user'
import { RevokeSubscriptionUserFeature } from '@/features/ui/dashboard/users/revoke-subscription-user'
import { ToggleUserStatusButtonFeature } from '@/features/ui/dashboard/users/toggle-user-status-button'
import { resetDataStrategy } from '@/shared/constants'
import { handleFormErrors } from '@/shared/utils'
import { bytesToGbUtil, gbToBytesUtil, prettyBytesUtil } from '@/shared/utils/bytes'
import { UserStatusBadge } from '@/widgets/dashboard/users/user-status-badge'
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
            if (!isModalOpen) {
                if (timeout) {
                    clearTimeout(timeout)
                }
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

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => actions.changeModalState(false)}
            title="Edit user"
            size="900px"
            centered
        >
            {isLoading ? (
                <LoaderModalShared text="Loading user data..." h="400" />
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
                                label="Username"
                                description="Username cannot be changed"
                                key={form.key('username')}
                                {...form.getInputProps('username')}
                                disabled
                                radius="xs"
                                leftSection={<PiUserDuotone size="1rem" />}
                            />

                            <TextInput
                                label="Subscription short uuid"
                                key={form.key('shortUuid')}
                                {...form.getInputProps('shortUuid')}
                                disabled
                                radius="xs"
                                leftSection={<PiLinkDuotone size="1rem" />}
                            />
                        </Stack>

                        <Divider orientation="vertical" />

                        {/* Right Section - Connection Details */}
                        <Stack gap="md" w={400}>
                            <Text fw={500}>Connection Details</Text>

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
                                radius="xs"
                                label="Data Limit"
                                description="Enter data limit in GB, 0 for unlimited"
                                allowDecimal={false}
                                decimalScale={0}
                                key={form.key('trafficLimitBytes')}
                                {...form.getInputProps('trafficLimitBytes')}
                            />

                            <Box>
                                <Progress
                                    radius="xs"
                                    size="xl"
                                    value={usedTrafficPercentage}
                                    color={usedTrafficPercentage > 100 ? 'yellow' : 'cyan'}
                                    striped
                                />
                                <Group gap="xs" justify="center" mt={2}>
                                    <Text size="sm" c="white" fw={500}>
                                        {totalUsedTraffic === '0' ? '' : totalUsedTraffic}
                                    </Text>
                                </Group>
                            </Box>

                            <Select
                                label="Traffic reset strategy"
                                description="How often the user's traffic should be reset"
                                placeholder="Pick value"
                                radius="xs"
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
                                type="submit"
                                color="blue"
                                leftSection={<PiFloppyDiskDuotone size="1rem" />}
                                variant="outline"
                                size="md"
                                loading={isDataSubmitting}
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
