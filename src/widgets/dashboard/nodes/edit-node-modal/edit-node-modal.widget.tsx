/* eslint-disable indent */
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
    useNodesStoreActions,
    useNodesStoreEditModalIsOpen,
    useNodesStoreEditModalNode,
    useNodesStorePubKey
} from '@entities/dashboard/nodes'
import {
    PiCheck,
    PiCheckDuotone,
    PiCopy,
    PiFloppyDiskDuotone,
    PiInfo,
    PiNetworkSlash,
    PiXDuotone
} from 'react-icons/pi'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { useInterval } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { wrap } from 'module'
import { z } from 'zod'

import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
import { handleFormErrors } from '@shared/utils'

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

    const handleClose = () => {
        actions.toggleEditModal(false)
        setAdvancedOpened(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
        }, 300)
    }

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
                consola.error('Zod validation error:', error.errors)
            }
            if (error instanceof Error) {
                consola.error('Error message:', error.message)
                consola.error('Error stack:', error.stack)
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

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>Edit node</Text>
                    {node && <NodeStatusBadgeWidget node={node} />}
                </Group>
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <Accordion
                        defaultValue={
                            node &&
                            node.lastStatusMessage !== null &&
                            node.lastStatusMessage !== '' &&
                            node.lastStatusChange !== undefined
                                ? 'error'
                                : undefined
                        }
                        radius="md"
                        variant="contained"
                    >
                        <Accordion.Item value="info">
                            <Accordion.Control icon={<PiInfo color="gray" size={'1.50rem'} />}>
                                Important note
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={'0'}>
                                    <Text>
                                        In order to connect node, you need to run Remnawave Node
                                        with the following{' '}
                                        <Code color="var(--mantine-color-blue-light)">.env</Code>{' '}
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
                        {node &&
                            node.lastStatusMessage !== null &&
                            node.lastStatusMessage !== '' &&
                            node.lastStatusChange !== undefined && (
                                <Accordion.Item value="error">
                                    <Accordion.Control
                                        icon={<PiNetworkSlash color="#FF8787" size={'1.50rem'} />}
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
                        key={form.key('name')}
                        label="Internal name"
                        {...form.getInputProps('name')}
                        required
                    />

                    <Stack gap="md">
                        <Group
                            gap="xs"
                            grow
                            justify="space-between"
                            preventGrowOverflow={false}
                            w="100%"
                        >
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
                            <Group
                                gap="md"
                                grow
                                justify="space-between"
                                preventGrowOverflow={false}
                                w="100%"
                            >
                                <NumberInput
                                    allowDecimal={false}
                                    decimalScale={0}
                                    defaultValue={0}
                                    hideControls
                                    key={form.key('trafficLimitBytes')}
                                    label="Limit"
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
                                    w={'30%'}
                                />

                                <NumberInput
                                    key={form.key('trafficResetDay')}
                                    label="Reset day"
                                    {...form.getInputProps('trafficResetDay')}
                                    allowDecimal={false}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    decimalScale={0}
                                    hideControls
                                    max={31}
                                    min={1}
                                    placeholder="e.g. 1-31"
                                    w={'30%'}
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
                                    w={'30%'}
                                />
                            </Group>
                        </Collapse>
                    </Stack>
                </Stack>

                <Group gap="xs" justify="space-between" pt={15} w="100%">
                    <ActionIcon.Group>
                        <DeleteNodeFeature />
                    </ActionIcon.Group>

                    <Group>
                        <ToggleNodeStatusButtonFeature />
                        <Button
                            color="blue"
                            disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                            leftSection={<PiFloppyDiskDuotone size="1rem" />}
                            loading={isDataSubmitting}
                            size="md"
                            type="submit"
                            variant="outline"
                        >
                            Save
                        </Button>
                    </Group>
                </Group>
            </form>
        </Modal>
    )
}
