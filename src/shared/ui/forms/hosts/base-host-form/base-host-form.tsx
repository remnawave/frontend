import {
    ActionIcon,
    Button,
    Collapse,
    Group,
    NumberInput,
    Select,
    Stack,
    Switch,
    TextInput
} from '@mantine/core'
import {
    ALPN,
    CreateHostCommand,
    FINGERPRINTS,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { PiCaretDown, PiCaretUp, PiFloppyDiskDuotone } from 'react-icons/pi'

import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { RemarkInfoPopoverWidget } from '@widgets/dashboard/hosts/popovers'

import { IProps } from './interfaces'

export const BaseHostForm = <T extends CreateHostCommand.Request | UpdateHostCommand.Request>(
    props: IProps<T>
) => {
    const { form, advancedOpened, handleSubmit, host, inbounds, setAdvancedOpened, isSubmitting } =
        props

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    key={form.key('remark')}
                    label="Remark"
                    {...form.getInputProps('remark')}
                    leftSection={<RemarkInfoPopoverWidget />}
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
                            min={1}
                            placeholder="e.g. 443"
                            required
                            w="20%"
                        />
                    </Group>

                    <Group
                        gap="xs"
                        grow
                        justify="space-between"
                        preventGrowOverflow={false}
                        w="100%"
                    >
                        <Select
                            data={Object.values(inbounds ?? {}).map((inbound) => ({
                                label: inbound.tag,
                                value: inbound.uuid
                            }))}
                            key={form.key('inboundUuid')}
                            label="Inbound"
                            {...form.getInputProps('inboundUuid')}
                            allowDeselect={false}
                            defaultValue={host?.inboundUuid ?? undefined}
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
                        onClick={() => setAdvancedOpened(!advancedOpened)}
                        rightSection={
                            advancedOpened ? <PiCaretUp size="1rem" /> : <PiCaretDown size="1rem" />
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

            <Group gap="xs" justify="space-between" pt={15} w="100%">
                <ActionIcon.Group>
                    <DeleteHostFeature />
                </ActionIcon.Group>

                <Button
                    color="blue"
                    disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                    leftSection={<PiFloppyDiskDuotone size="1rem" />}
                    loading={isSubmitting}
                    size="md"
                    type="submit"
                    variant="outline"
                >
                    Save
                </Button>
            </Group>
        </form>
    )
}
