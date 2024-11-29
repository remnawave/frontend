import { useEffect, useState } from 'react'

import {
    ActionIcon,
    Button,
    Collapse,
    Group,
    Modal,
    NumberInput,
    Select,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useHostsStoreActions, useHostsStoreCreateModalIsOpen } from '@entitites/dashboard'
import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { ALPN, CreateHostCommand, FINGERPRINTS, x } from '@remnawave/backend-contract'
import { PiCaretDown, PiCaretUp, PiFloppyDiskDuotone } from 'react-icons/pi'
import { z } from 'zod'
import { useDSInbounds } from '@/entitites/dashboard/dashboard-store/dashboard-store'
import { handleFormErrors } from '@/shared/utils'
import { RemarkInfoPopoverWidget } from '../popovers/remark-info/remark-info.widget'

export const CreateHostModalWidget = () => {
    const isModalOpen = useHostsStoreCreateModalIsOpen()
    const actions = useHostsStoreActions()

    const inbounds = useDSInbounds()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

    const form = useForm<CreateHostCommand.Request>({
        name: 'create-host-form',
        mode: 'uncontrolled',
        validate: zodResolver(CreateHostCommand.RequestSchema)
    })

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            if (!values.inboundUuid) {
                throw new Error('No inbound selected')
            }

            setIsDataSubmitting(true)

            await actions.createHost({
                ...values,
                inboundUuid: values.inboundUuid,
                isDisabled: !values.isDisabled
            })

            notifications.show({
                title: 'Success',
                message: 'Host created successfully',
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
                message: error instanceof Error ? error.message : 'Failed to create host',
                color: 'red'
            })
        } finally {
            setIsDataSubmitting(false)

            handleClose()
        }
    })

    const handleClose = () => {
        actions.toggleCreateModal(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    return (
        <Modal
            opened={isModalOpen}
            onClose={handleClose}
            title={<Text fw={500}>Create host</Text>}
            centered
        >
            <form onSubmit={handleSubmit}>
                <Group align="flex-start" grow={false}>
                    <Stack gap="md" w={400}>
                        <Group gap="xs" justify="space-between" w="100%"></Group>

                        <TextInput
                            label="Remark"
                            key={form.key('remark')}
                            {...form.getInputProps('remark')}
                            placeholder="e.g. 📊 {{TRAFFIC_USED}}"
                            required
                            leftSection={<RemarkInfoPopoverWidget />}
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
                                    min={1}
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

                            <Group gap="xs" w="100%" justify="space-between">
                                <Select
                                    label="Inbound"
                                    key={form.key('inboundUuid')}
                                    data={Object.values(inbounds ?? {}).map((inbound) => ({
                                        label: inbound.tag,
                                        value: inbound.uuid
                                    }))}
                                    {...form.getInputProps('inboundUuid')}
                                    placeholder="Select inbound"
                                    w="75%"
                                    allowDeselect={false}
                                    required
                                />

                                <Switch
                                    w="20%"
                                    size="xl"
                                    radius="md"
                                    color="teal.8"
                                    mt={25}
                                    key={form.key('isDisabled')}
                                    {...form.getInputProps('isDisabled', { type: 'checkbox' })}
                                />
                            </Group>

                            <Button
                                variant="subtle"
                                onClick={() => setAdvancedOpened((o) => !o)}
                                rightSection={
                                    advancedOpened ? (
                                        <PiCaretUp size="1rem" />
                                    ) : (
                                        <PiCaretDown size="1rem" />
                                    )
                                }
                            >
                                Advanced options
                            </Button>

                            <Collapse in={advancedOpened}>
                                <Stack gap="md">
                                    <TextInput
                                        label="SNI"
                                        placeholder="SNI (e.g. example.com)"
                                        key={form.key('sni')}
                                        {...form.getInputProps('sni')}
                                    />

                                    <TextInput
                                        label="Request Host"
                                        key={form.key('requestHost')}
                                        placeholder="Host (e.g. example.com)"
                                        {...form.getInputProps('requestHost')}
                                    />

                                    <TextInput
                                        label="Path"
                                        key={form.key('path')}
                                        placeholder="path (e.g. /ws)"
                                        {...form.getInputProps('path')}
                                    />

                                    <Select
                                        label="ALPN"
                                        placeholder="ALPN (e.g. h2)"
                                        key={form.key('alpn')}
                                        data={Object.values(ALPN).map((alpn) => ({
                                            label: alpn,
                                            value: alpn
                                        }))}
                                        clearable
                                        {...form.getInputProps('alpn')}
                                    />

                                    <Select
                                        label="Fingerprint"
                                        key={form.key('fingerprint')}
                                        placeholder="Fingerprint (e.g. chrome)"
                                        data={Object.values(FINGERPRINTS).map((fingerprint) => ({
                                            label: fingerprint,
                                            value: fingerprint
                                        }))}
                                        clearable
                                        {...form.getInputProps('fingerprint')}
                                    />
                                </Stack>
                            </Collapse>
                        </Stack>
                    </Stack>
                </Group>

                <Group gap="xs" w="100%" pt={15} justify="space-between">
                    <ActionIcon.Group>
                        <DeleteHostFeature />
                    </ActionIcon.Group>

                    <Button
                        type="submit"
                        color="blue"
                        leftSection={<PiFloppyDiskDuotone size="1rem" />}
                        variant="outline"
                        size="md"
                        loading={isDataSubmitting}
                    >
                        Save
                    </Button>
                </Group>
            </form>
        </Modal>
    )
}
