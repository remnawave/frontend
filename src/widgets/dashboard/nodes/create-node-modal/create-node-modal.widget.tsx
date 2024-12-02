import {
    Accordion,
    ActionIcon,
    Button,
    Code,
    Collapse,
    CopyButton,
    Divider,
    Group,
    Modal,
    NumberInput,
    rem,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import {
    PiCheck,
    PiCheckDuotone,
    PiCopy,
    PiFloppyDiskDuotone,
    PiInfo,
    PiXDuotone
} from 'react-icons/pi'
import { CreateNodeCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import consola from 'consola/browser'
import { useState } from 'react'
import { z } from 'zod'

import {
    useNodesStoreActions,
    useNodesStoreCreateModalIsOpen,
    useNodesStorePubKey
} from '@entitites/dashboard/nodes'
import { gbToBytesUtil } from '@/shared/utils/bytes'
import { handleFormErrors } from '@/shared/utils'

export const CreateNodeModalWidget = () => {
    const isModalOpen = useNodesStoreCreateModalIsOpen()
    const actions = useNodesStoreActions()
    const pubKey = useNodesStorePubKey()

    const [advancedOpened, setAdvancedOpened] = useState(false)
    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

    const form = useForm<CreateNodeCommand.Request>({
        name: 'create-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(CreateNodeCommand.RequestSchema)
    })

    const handleClose = () => {
        actions.toggleCreateModal(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
            setAdvancedOpened(false)
        }, 300)
    }

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true)

            await actions.createNode({
                ...values,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes)
            })

            notifications.show({
                title: 'Success',
                message: 'Node created successfully',
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
                message: error instanceof Error ? error.message : 'Failed to create node',
                color: 'red'
            })
        } finally {
            setIsDataSubmitting(false)

            handleClose()
        }
    })

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>Create node</Text>
                </Group>
            }
        >
            <form onSubmit={handleSubmit}>
                <Group align="flex-start" grow={false}>
                    <Stack gap="md" w={400}>
                        <Group gap="xs" justify="space-between" w="100%"></Group>

                        <Accordion radius="md" variant="contained">
                            <Accordion.Item value="info">
                                <Accordion.Control icon={<PiInfo color="gray" size={'1.50rem'} />}>
                                    Important note
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack gap={'0'}>
                                        <Text>
                                            In order to connect node, you need to run Remnawave Node
                                            with the following{' '}
                                            <Code color="var(--mantine-color-blue-light)">
                                                .env
                                            </Code>{' '}
                                            value.
                                        </Text>
                                        <Group justify="flex-end">
                                            <CopyButton
                                                value={`SSL_CERT="${pubKey?.pubKey.trimEnd()}"`}
                                            >
                                                {({ copied, copy }) => (
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'blue'}
                                                        onClick={copy}
                                                        radius="md"
                                                        size="lg"
                                                        variant="outline"
                                                    >
                                                        {copied ? (
                                                            <PiCheck size="1rem" />
                                                        ) : (
                                                            <PiCopy size="1rem" />
                                                        )}
                                                    </ActionIcon>
                                                )}
                                            </CopyButton>
                                        </Group>
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>

                        <TextInput
                            key={form.key('name')}
                            label="Internal name"
                            {...form.getInputProps('name')}
                            required
                        />

                        <Stack gap="md" w={400}>
                            <Group gap="xs" justify="space-between" w="100%">
                                <TextInput
                                    key={form.key('address')}
                                    label="Address"
                                    {...form.getInputProps('address')}
                                    placeholder="e.g. example.com"
                                    required
                                    w="75%"
                                />

                                <NumberInput
                                    key={form.key('port')}
                                    label="Port"
                                    {...form.getInputProps('port')}
                                    allowDecimal={false}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    decimalScale={0}
                                    hideControls
                                    max={65535}
                                    placeholder="e.g. 443"
                                    required
                                    w="20%"
                                />
                            </Group>

                            <Switch
                                key={form.key('isTrafficTrackingActive')}
                                {...form.getInputProps('isTrafficTrackingActive', {
                                    type: 'checkbox'
                                })}
                                label="Traffic tracking"
                                onClick={() => setAdvancedOpened((o) => !o)}
                                size="md"
                                thumbIcon={
                                    advancedOpened ? (
                                        <PiCheckDuotone
                                            color={'teal'}
                                            style={{ width: rem(12), height: rem(12) }}
                                        />
                                    ) : (
                                        <PiXDuotone
                                            color="red.6"
                                            style={{ width: rem(12), height: rem(12) }}
                                        />
                                    )
                                }
                            />

                            <Collapse in={advancedOpened}>
                                <Stack gap="md">
                                    <Group gap="xs" justify="space-between" w="100%">
                                        <NumberInput
                                            allowDecimal={false}
                                            decimalScale={0}
                                            defaultValue={0}
                                            hideControls
                                            key={form.key('trafficLimitBytes')}
                                            label="Traffic limit"
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
                                            w="30%"
                                        />

                                        <NumberInput
                                            key={form.key('trafficResetDay')}
                                            label="Traffic reset day"
                                            {...form.getInputProps('trafficResetDay')}
                                            allowDecimal={false}
                                            allowNegative={false}
                                            clampBehavior="strict"
                                            decimalScale={0}
                                            hideControls
                                            max={31}
                                            min={1}
                                            placeholder="e.g. 1-31"
                                            w="30%"
                                        />

                                        <NumberInput
                                            key={form.key('notifyPercent')}
                                            label="Notify percent"
                                            {...form.getInputProps('notifyPercent')}
                                            allowDecimal={false}
                                            allowNegative={false}
                                            clampBehavior="strict"
                                            decimalScale={0}
                                            hideControls
                                            max={100}
                                            placeholder="e.g. 50"
                                            w="30%"
                                        />
                                    </Group>
                                </Stack>
                            </Collapse>
                        </Stack>
                    </Stack>
                </Group>

                <Group gap="xs" justify="flex-end" pt={15} w="100%">
                    <Button
                        color="teal"
                        disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                        leftSection={<PiFloppyDiskDuotone size="1rem" />}
                        loading={isDataSubmitting}
                        size="md"
                        type="submit"
                        variant="outline"
                    >
                        Create
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}
