import { useEffect, useState } from 'react'

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
import { useForm, zodResolver } from '@mantine/form'
import { useInterval } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
    useNodesStoreActions,
    useNodesStoreEditModalIsOpen,
    useNodesStoreEditModalNode,
    useNodesStorePubKey
} from '@entitites/dashboard/nodes'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import {
    PiCheck,
    PiCheckDuotone,
    PiCopy,
    PiFloppyDiskDuotone,
    PiInfo,
    PiNetworkSlash,
    PiXDuotone
} from 'react-icons/pi'
import { z } from 'zod'
import { handleFormErrors } from '@/shared/utils'
import { bytesToGbUtil, gbToBytesUtil } from '@/shared/utils/bytes'
import { NodeStatusBadgeWidget } from '../node-status-badge'

export const EditNodeModalWidget = () => {
    const isModalOpen = useNodesStoreEditModalIsOpen()
    const actions = useNodesStoreActions()
    const node = useNodesStoreEditModalNode()
    const pubKey = useNodesStorePubKey()

    const [advancedOpened, setAdvancedOpened] = useState(false)
    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

    const form = useForm<UpdateNodeCommand.Request>({
        name: 'edit-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateNodeCommand.RequestSchema.omit({ uuid: true }))
    })

    useInterval(
        () => {
            if (!node) return

            actions.getNodeByUuid(node.uuid)
        },
        2000,
        { autoInvoke: true }
    )

    useEffect(() => {
        if (node) {
            setAdvancedOpened(node.isTrafficTrackingActive ?? false)
            form.setValues({
                name: node.name,
                address: node.address,
                port: node.port ?? undefined,
                isTrafficTrackingActive: node.isTrafficTrackingActive ?? undefined,
                trafficLimitBytes: bytesToGbUtil(node.trafficLimitBytes ?? undefined),
                trafficResetDay: node.trafficResetDay ?? undefined,
                notifyPercent: node.notifyPercent ?? undefined
            })
        }
    }, [node])

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true)

            if (!node) {
                return
            }

            await actions.updateNode({
                ...values,
                uuid: node.uuid,
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes)
            })

            notifications.show({
                title: 'Success',
                message: 'Node updated successfully',
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
                message: error instanceof Error ? error.message : 'Failed to update node',
                color: 'red'
            })
        } finally {
            setIsDataSubmitting(false)

            handleClose()
        }
    })

    const handleClose = () => {
        actions.toggleEditModal(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    return (
        <Modal
            opened={isModalOpen}
            onClose={handleClose}
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>Edit node</Text>
                    {node && <NodeStatusBadgeWidget node={node} />}
                </Group>
            }
            centered
        >
            <form onSubmit={handleSubmit}>
                <Group align="flex-start" grow={false}>
                    <Stack gap="md" w={400}>
                        <Group gap="xs" justify="space-between" w="100%"></Group>

                        <Accordion
                            variant="contained"
                            radius="md"
                            defaultValue={
                                node &&
                                node.lastStatusMessage !== null &&
                                node.lastStatusMessage !== '' &&
                                node.lastStatusChange !== undefined
                                    ? 'error'
                                    : undefined
                            }
                        >
                            <Accordion.Item value="info">
                                <Accordion.Control icon={<PiInfo size={'1.50rem'} color="gray" />}>
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
                                                        variant="outline"
                                                        size="lg"
                                                        radius="md"
                                                        color={copied ? 'teal' : 'blue'}
                                                        onClick={copy}
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
                            {node &&
                                node.lastStatusMessage !== null &&
                                node.lastStatusMessage !== '' &&
                                node.lastStatusChange !== undefined && (
                                    <Accordion.Item value="error">
                                        <Accordion.Control
                                            icon={
                                                <PiNetworkSlash size={'1.50rem'} color="#FF8787" />
                                            }
                                        >
                                            <Text fw={600}>Last error message</Text>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <Code block>{node.lastStatusMessage}</Code>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                )}
                        </Accordion>

                        <TextInput
                            label="Internal name"
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                            required
                        />

                        <Stack gap="md" w={400}>
                            <Group gap="xs" w="100%" justify="space-between">
                                <TextInput
                                    label="Address"
                                    key={form.key('address')}
                                    {...form.getInputProps('address')}
                                    placeholder="e.g. example.com"
                                    w="75%"
                                    required
                                />

                                <NumberInput
                                    label="Port"
                                    key={form.key('port')}
                                    {...form.getInputProps('port')}
                                    hideControls
                                    allowNegative={false}
                                    allowDecimal={false}
                                    decimalScale={0}
                                    clampBehavior="strict"
                                    max={65535}
                                    placeholder="e.g. 443"
                                    w="20%"
                                    required
                                />
                            </Group>

                            <Switch
                                key={form.key('isTrafficTrackingActive')}
                                {...form.getInputProps('isTrafficTrackingActive', {
                                    type: 'checkbox'
                                })}
                                size="md"
                                onClick={() => setAdvancedOpened((o) => !o)}
                                thumbIcon={
                                    advancedOpened ? (
                                        <PiCheckDuotone
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={'teal'}
                                        />
                                    ) : (
                                        <PiXDuotone
                                            style={{ width: rem(12), height: rem(12) }}
                                            color="red.6"
                                        />
                                    )
                                }
                                label="Traffic tracking"
                            />

                            <Collapse in={advancedOpened}>
                                <Stack gap="md">
                                    <Group gap="xs" w="100%" justify="space-between">
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
                                            label="Traffic limit"
                                            allowDecimal={false}
                                            defaultValue={0}
                                            decimalScale={0}
                                            hideControls
                                            key={form.key('trafficLimitBytes')}
                                            {...form.getInputProps('trafficLimitBytes')}
                                            w="30%"
                                        />

                                        <NumberInput
                                            label="Traffic reset day"
                                            key={form.key('trafficResetDay')}
                                            {...form.getInputProps('trafficResetDay')}
                                            placeholder="e.g. 1-31"
                                            hideControls
                                            allowNegative={false}
                                            allowDecimal={false}
                                            decimalScale={0}
                                            clampBehavior="strict"
                                            min={1}
                                            max={31}
                                            w="30%"
                                        />

                                        <NumberInput
                                            label="Notify percent"
                                            key={form.key('notifyPercent')}
                                            {...form.getInputProps('notifyPercent')}
                                            hideControls
                                            allowNegative={false}
                                            allowDecimal={false}
                                            decimalScale={0}
                                            clampBehavior="strict"
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

                <Group gap="xs" w="100%" pt={15} justify="space-between">
                    <ActionIcon.Group>
                        <DeleteNodeFeature />
                    </ActionIcon.Group>

                    <Group>
                        <ToggleNodeStatusButtonFeature />
                        <Button
                            type="submit"
                            color="blue"
                            leftSection={<PiFloppyDiskDuotone size="1rem" />}
                            variant="outline"
                            size="md"
                            disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                            loading={isDataSubmitting}
                        >
                            Save
                        </Button>
                    </Group>
                </Group>
            </form>
        </Modal>
    )
}
