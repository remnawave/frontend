import { useEffect, useState } from 'react';
import { UpdateUserCommand } from '@remnawave/backend-contract';
import { PiClockCounterClockwiseDuotone, PiTrashDuotone, PiUserDuotone } from 'react-icons/pi';
import { z } from 'zod';
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  Group,
  Loader,
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
import { handleFormErrors } from '@/shared/utils';
import { bytesToGbUtil, gbToBytesUtil } from '@/shared/utils/bytes';
import classes from './Checkbox.module.css';

type UpdateUserRequest = z.infer<typeof UpdateUserCommand.RequestSchema>;

interface FormValues extends UpdateUserRequest {
  username: string;
}

export const ViewUserModal = () => {
  const isModalOpen = useUserModalStoreIsModalOpen();
  const actions = useUserModalStoreActions();
  const user = useUserModalStoreUser();
  const inbounds = useDSInbounds();
  const actionsDS = useDashboardStoreActions();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Validation Schema:', UpdateUserCommand.RequestSchema);
  }, []);

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    validate: zodResolver(UpdateUserCommand.RequestSchema),
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await actions.getUser();
        await actionsDS.getInbounds();
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    })();
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

  useEffect(() => {
    console.log('Form errors:', form.errors);
  }, [form.errors]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
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

      actions.changeModalState(false);
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
        <Center h={400}>
          <Stack align="center" gap="sm">
            <Loader size="lg" variant="bars" />
            <Text size="sm" c="dimmed">
              Loading user data...
            </Text>
          </Stack>
        </Center>
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
                data={[
                  { value: 'NO_RESET', label: 'Never reset' },
                  { value: 'DAILY', label: 'Reset daily' },
                  { value: 'WEEKLY', label: 'Reset weekly' },
                  { value: 'MONTHLY', label: 'Reset monthly' },
                  { value: 'YEARLY', label: 'Reset yearly' },
                ]}
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
                <CheckboxGroup
                  label="Inbounds"
                  description="Select available inbounds for this user"
                  {...form.getInputProps('activeUserInbounds')}
                >
                  <Stack gap="xs">
                    {inbounds?.map((inbound) => (
                      <Checkbox
                        key={inbound.uuid}
                        value={inbound.uuid}
                        label={inbound.tag || inbound.uuid}
                      />
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Stack>
            </Box>

            <Box>
              <Stack gap="xs">
                <Checkbox.Group
                  {...form.getInputProps('activeUserInbounds')}
                  label="Inbounds"
                  description="Select available inbounds for this user"
                >
                  <Stack pt="md" gap="xs">
                    {inbounds?.map((inbound) => (
                      <Checkbox.Card
                        className={classes.root}
                        radius="md"
                        value={inbound.uuid}
                        key={inbound.uuid}
                      >
                        <Group wrap="nowrap" align="flex-start">
                          <Checkbox.Indicator />
                          <div>
                            <Text className={classes.label}>{inbound.tag}</Text>
                            <Badge variant="outline" size="sm" color="gray">
                              {inbound.type}
                            </Badge>
                          </div>
                        </Group>
                      </Checkbox.Card>
                    ))}
                  </Stack>
                </Checkbox.Group>
              </Stack>
            </Box>

            <Group justify="space-between" mt="xl">
              <Group>
                <Button
                  type="button"
                  variant="subtle"
                  color="red"
                  leftSection={<PiTrashDuotone size="1rem" />}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="subtle"
                  leftSection={<PiClockCounterClockwiseDuotone size="1rem" />}
                >
                  Reset Usage
                </Button>
                <Button type="button" variant="subtle" color="red">
                  Revoke Subscription
                </Button>
              </Group>

              <Button type="submit" color="blue">
                Edit user
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
};
