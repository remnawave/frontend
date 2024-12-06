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
import { useForm, zodResolver } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useEffect } from 'react'

import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { ToggleUserStatusButtonFeature } from '@features/ui/dashboard/users/toggle-user-status-button'
import { RevokeSubscriptionUserFeature } from '@features/ui/dashboard/users/revoke-subscription-user'
import { ResetUsageUserFeature } from '@features/ui/dashboard/users/reset-usage-user'
import { useGetInbounds, useGetUserByUuid, useUpdateUser } from '@shared/api/hooks'
import { bytesToGbUtil, gbToBytesUtil, prettyBytesUtil } from '@shared/utils/bytes'
import { DeleteUserFeature } from '@features/ui/dashboard/users/delete-user'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { resetDataStrategy } from '@shared/constants'

import { InboundCheckboxCardWidget } from '../inbound-checkbox-card'
import { IFormValues } from './interfaces'

export const ViewUserModal = () => {
    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const selectedUser = useUserModalStoreUserUuid()

    const { data: inbounds } = useGetInbounds()

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser
    } = useGetUserByUuid({
        route: {
            uuid: selectedUser ?? ''
        },
        rQueryParams: {
            enabled: !!selectedUser
        }
    })

    const form = useForm<IFormValues>({
        name: 'edit-user-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateUserCommand.RequestSchema)
    })

    const {
        mutate: updateUser,
        isPending: isUpdateUserPending,
        isSuccess: isUserUpdated
    } = useUpdateUser({})

    useEffect(() => {
        if (isUserUpdated) {
            refetchUser()
        }
    }, [isUserUpdated])

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

    const usedTrafficPercentage = user ? (user.usedTrafficBytes / user.trafficLimitBytes) * 100 : 0
    const totalUsedTraffic = prettyBytesUtil(user?.usedTrafficBytes, true)

    const handleSubmit = form.onSubmit(async (values) => {
        const updateData = {
            uuid: values.uuid,
            trafficLimitStrategy: values.trafficLimitStrategy,
            trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
            expireAt: values.expireAt,
            activeUserInbounds: values.activeUserInbounds
        }

        updateUser({
            variables: updateData
        })
    })

    const handleClose = () => {
        actions.changeModalState(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
        }, 300)
    }

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isViewUserModalOpen}
            size="900px"
            title="Edit user"
        >
            {isUserLoading ? (
                <LoaderModalShared h="400" text="Loading user data..." />
            ) : (
                <form key="view-user-form" onSubmit={handleSubmit}>
                    <Group align="flex-start" grow={false}>
                        {/* Left Section - User Settings */}
                        <Stack gap="md" key="view-user-details-stack" w={400}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <Text fw={500} key="view-user-details-text">
                                    User details
                                </Text>
                                {user && (
                                    <UserStatusBadge
                                        key="view-user-status-badge"
                                        status={user.status}
                                    />
                                )}
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
                                    key={'view-user-inbounds-grid'}
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

                    <Group justify="space-between" mt="xl">
                        <Group>
                            <ActionIcon.Group>
                                <DeleteUserFeature userUuid={user?.uuid ?? ''} />
                                <ResetUsageUserFeature />
                                <RevokeSubscriptionUserFeature userUuid={user?.uuid ?? ''} />
                            </ActionIcon.Group>
                        </Group>
                        <Group>
                            {user && <ToggleUserStatusButtonFeature user={user} />}
                            <Button
                                color="blue"
                                leftSection={<PiFloppyDiskDuotone size="1rem" />}
                                loading={isUpdateUserPending}
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
