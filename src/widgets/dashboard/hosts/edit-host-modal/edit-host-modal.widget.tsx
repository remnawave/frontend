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
import { ALPN, FINGERPRINTS, UpdateHostCommand } from '@remnawave/backend-contract'
import { PiCaretDown, PiCaretUp, PiFloppyDiskDuotone } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { useEffect, useState } from 'react'
import consola from 'consola/browser'
import { z } from 'zod'

import {
    useHostsStoreActions,
    useHostsStoreEditModalHost,
    useHostsStoreEditModalIsOpen
} from '@entitites/dashboard'
import { useDSInbounds } from '@/entitites/dashboard/dashboard-store/dashboard-store'
import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { handleFormErrors } from '@/shared/utils'

import { RemarkInfoPopoverWidget } from '../popovers/remark-info/remark-info.widget'

export const EditHostModalWidget = () => {
    const [advancedOpened, setAdvancedOpened] = useState(false)
    const [isDataSubmitting, setIsDataSubmitting] = useState(false)

    const isModalOpen = useHostsStoreEditModalIsOpen()
    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()
    const inbounds = useDSInbounds()

    const form = useForm<UpdateHostCommand.Request>({
        name: 'edit-host-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateHostCommand.RequestSchema.omit({ uuid: true }))
    })

    useEffect(() => {
        if (host && inbounds) {
            form.setValues({
                remark: host.remark,
                address: host.address,
                port: host.port,
                inboundUuid: host.inboundUuid,
                isDisabled: !host.isDisabled,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                path: host.path ?? undefined,
                alpn: (host.alpn as UpdateHostCommand.Request['alpn']) ?? undefined,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined
            })
        }
    }, [host, inbounds])

    const handleClose = () => {
        actions.toggleEditModal(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            setIsDataSubmitting(true)

            if (!host) {
                return
            }

            await actions.updateHost({
                ...values,
                isDisabled: !values.isDisabled,
                uuid: host.uuid
            })
            notifications.show({
                title: 'Success',
                message: 'Host updated successfully',
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

            handleClose()
        }
    })

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={<Text fw={500}>Edit host</Text>}
        >
            <form onSubmit={handleSubmit}>
                <Group align="flex-start" grow={false}>
                    <Stack gap="md" w={400}>
                        <Group gap="xs" justify="space-between" w="100%"></Group>

                        <TextInput
                            key={form.key('remark')}
                            label="Remark"
                            {...form.getInputProps('remark')}
                            leftSection={<RemarkInfoPopoverWidget />}
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
                                    min={1}
                                    placeholder="e.g. 443"
                                    required
                                    w="20%"
                                />
                            </Group>

                            <Group gap="xs" justify="space-between" w="100%">
                                <Select
                                    data={Object.values(inbounds ?? {}).map((inbound) => ({
                                        label: inbound.tag,
                                        value: inbound.uuid
                                    }))}
                                    key={form.key('inboundUuid')}
                                    label="Inbound"
                                    {...form.getInputProps('inboundUuid')}
                                    allowDeselect={false}
                                    defaultValue={host?.inboundUuid}
                                    placeholder="Select inbound"
                                    required
                                    w="75%"
                                />

                                <Switch
                                    color="teal.8"
                                    key={form.key('isDisabled')}
                                    mt={25}
                                    radius="md"
                                    size="xl"
                                    w="20%"
                                    {...form.getInputProps('isDisabled', { type: 'checkbox' })}
                                />
                            </Group>

                            <Button
                                onClick={() => setAdvancedOpened((o) => !o)}
                                rightSection={
                                    advancedOpened ? (
                                        <PiCaretUp size="1rem" />
                                    ) : (
                                        <PiCaretDown size="1rem" />
                                    )
                                }
                                variant="subtle"
                            >
                                Advanced options
                            </Button>

                            <Collapse in={advancedOpened}>
                                <Stack gap="md">
                                    <TextInput
                                        key={form.key('sni')}
                                        label="SNI"
                                        placeholder="SNI (e.g. example.com)"
                                        {...form.getInputProps('sni')}
                                    />

                                    <TextInput
                                        key={form.key('requestHost')}
                                        label="Request Host"
                                        placeholder="Host (e.g. example.com)"
                                        {...form.getInputProps('requestHost')}
                                    />

                                    <TextInput
                                        key={form.key('path')}
                                        label="Path"
                                        placeholder="path (e.g. /ws)"
                                        {...form.getInputProps('path')}
                                    />

                                    <Select
                                        clearable
                                        data={Object.values(ALPN).map((alpn) => ({
                                            label: alpn,
                                            value: alpn
                                        }))}
                                        key={form.key('alpn')}
                                        label="ALPN"
                                        placeholder="ALPN (e.g. h2)"
                                        {...form.getInputProps('alpn')}
                                    />

                                    <Select
                                        clearable
                                        data={Object.values(FINGERPRINTS).map((fingerprint) => ({
                                            label: fingerprint,
                                            value: fingerprint
                                        }))}
                                        key={form.key('fingerprint')}
                                        label="Fingerprint"
                                        placeholder="Fingerprint (e.g. chrome)"
                                        {...form.getInputProps('fingerprint')}
                                    />
                                </Stack>
                            </Collapse>
                        </Stack>
                    </Stack>
                </Group>

                <Group gap="xs" justify="space-between" pt={15} w="100%">
                    <ActionIcon.Group>
                        <DeleteHostFeature />
                    </ActionIcon.Group>

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
            </form>
        </Modal>
    )
}
