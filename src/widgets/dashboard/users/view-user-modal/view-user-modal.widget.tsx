import { useEffect, useState } from 'react';
import { UpdateUserCommand } from '@remnawave/backend-contract';
import { PiUserDuotone } from 'react-icons/pi';
import { z } from 'zod';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
    useDashboardStoreActions,
    useDSInbounds,
} from '@/entitites/dashboard/dashboard-store/dashboard-store';
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUser,
} from '@/entitites/dashboard/user-modal-store/user-modal-store';
import { DeleteUserFeature } from '@/features/ui/dashboard/users/delete-user';
import { ResetUsageUserFeature } from '@/features/ui/dashboard/users/reset-usage-user';
import { RevokeSubscriptionUserFeature } from '@/features/ui/dashboard/users/revoke-subscription-user';
import { resetDataStrategy } from '@/shared/constants';
import { handleFormErrors } from '@/shared/utils';
import { bytesToGbUtil, gbToBytesUtil } from '@/shared/utils/bytes';
import { LoaderModalShared } from '../../../../shared/ui/loader-modal';
import { InboundCheckboxCardWidget } from '../inbound-checkbox-card';
import { IFormValues } from './interfaces';

export const ViewUserModal = () => {
    const isModalOpen = useUserModalStoreIsModalOpen();
    const actions = useUserModalStoreActions();
    const user = useUserModalStoreUser();
    const inbounds = useDSInbounds();
    const actionsDS = useDashboardStoreActions();

    const [isLoading, setIsLoading] = useState(true);
    const [isDataSubmitting, setIsDataSubmitting] = useState(false);

    const form = useForm<IFormValues>({
        mode: 'uncontrolled',
        validate: zodResolver(UpdateUserCommand.RequestSchema),
    });

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        if (isModalOpen) {
            (async () => {
                setIsLoading(true);
                try {
                    await actions.getUser();
                    await actionsDS.getInbounds();
                } finally {
                    timeout = setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                }
            })();
            if (!isModalOpen) {
                if (timeout) {
                    clearTimeout(timeout);
                }
            }
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (user && inbounds) {
            const activeInboundUuids = user.activeUserInbounds.map((inbound) => inbound.uuid);
            form.setValues({
                uuid: user.uuid,
                username: user.username,
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
                activeUserInbounds: activeInboundUuids,
            });
        }
    }, [user, inbounds]);

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true);
            const updateData = {
                uuid: values.uuid,
                trafficLimitStrategy: values.trafficLimitStrategy,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                expireAt: values.expireAt,
                activeUserInbounds: values.activeUserInbounds,
            };

            await actions.updateUser(updateData);

            notifications.show({
                title: 'Success',
                message: 'User updated successfully',
                color: 'green',
            });
        } catch (error) {
            console.error('Full error:', error);

            if (error instanceof z.ZodError) {
                console.error('Zod validation error:', error.errors);
            }

            if (error instanceof Error) {
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }

            handleFormErrors(form, error);
            notifications.show({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to update user',
                color: 'red',
            });
        } finally {
            setIsDataSubmitting(false);
            actions.changeModalState(false);
        }
    });

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => actions.changeModalState(false)}
            title="Edit user"
            size="lg"
            centered
        >
            {isLoading ? (
                <LoaderModalShared text="Loading user data..." h="400" />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            label="Username"
                            description="Username cannot be changed"
                            {...form.getInputProps('username')}
                            disabled
                            radius="xs"
                            leftSection={<PiUserDuotone size="1rem" />}
                        />

                        <Group grow align="flex-start">
                            <NumberInput
                                {...form.getInputProps('trafficLimitBytes')}
                                leftSection={
                                    <>
                                        <Text
                                            ta="center"
                                            size="1rem"
                                            w={28}
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
                            />

                            <Select
                                label="Traffic reset strategy"
                                description="How often the user's traffic should be reset"
                                placeholder="Pick value"
                                data={resetDataStrategy}
                                {...form.getInputProps('trafficLimitStrategy')}
                            />
                        </Group>

                        <DateTimePicker
                            label="Expiry Date"
                            valueFormat="MMMM D, YYYY - HH:mm"
                            {...form.getInputProps('expireAt')}
                            clearable
                        />

                        <Box>
                            <Stack gap="xs">
                                <Checkbox.Group
                                    {...form.getInputProps('activeUserInbounds')}
                                    label="Inbounds"
                                    description="Select available inbounds for this user"
                                >
                                    <Stack pt="md" gap="xs">
                                        {inbounds?.map((inbound) => (
                                            <InboundCheckboxCardWidget inbound={inbound} />
                                        ))}
                                    </Stack>
                                </Checkbox.Group>
                            </Stack>
                        </Box>

                        <Group justify="space-between" mt="xl">
                            <Group>
                                <DeleteUserFeature />
                                <ResetUsageUserFeature />
                                <RevokeSubscriptionUserFeature />
                            </Group>

                            <Button type="submit" color="blue" loading={isDataSubmitting}>
                                Edit user
                            </Button>
                        </Group>
                    </Stack>
                </form>
            )}
        </Modal>
    );
};
