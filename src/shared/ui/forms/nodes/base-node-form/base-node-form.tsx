import {
    ActionIcon,
    Button,
    Checkbox,
    Collapse,
    Divider,
    Group,
    NumberInput,
    rem,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { PiCheckDuotone, PiFloppyDiskDuotone, PiXDuotone } from 'react-icons/pi'
import { useMemo } from 'react'

import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { InboundCheckboxCardWidget } from '@widgets/dashboard/users/inbound-checkbox-card'
import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'

import { IProps } from './interfaces'

export const BaseNodeForm = <T extends CreateNodeCommand.Request | UpdateNodeCommand.Request>(
    props: IProps<T>
) => {
    const {
        form,
        handleClose,
        node,
        fetchedNode,
        pubKey,
        advancedOpened,
        isUpdateNodePending,
        handleSubmit,
        setAdvancedOpened,
        inbounds
    } = props

    const includedInbounds = useMemo(() => {
        const excluded = form.getValues().excludedInbounds || []
        const allInboundUuids = inbounds?.map((inbound) => inbound.uuid) || []

        const included = allInboundUuids.filter((uuid) => !excluded.includes(uuid))
        return included
    }, [inbounds, form.getValues().excludedInbounds])

    const handleIncludedInboundsChange = (values: string[]) => {
        const allInboundUuids = inbounds?.map((inbound) => inbound.uuid) || []
        const newExcludedInbounds = allInboundUuids.filter((uuid) => !values.includes(uuid))

        // @ts-expect-error unknown error
        form.setFieldValue('excludedInbounds', newExcludedInbounds)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <ModalAccordionWidget fetchedNode={fetchedNode} node={node} pubKey={pubKey} />
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
                        onClick={() => setAdvancedOpened(!advancedOpened)}
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

                    <Checkbox.Group
                        description="Select active inbounds for this node"
                        key={form.key('excludedInbounds')}
                        label="Inbounds"
                        onChange={handleIncludedInboundsChange}
                        value={includedInbounds}
                    >
                        <SimpleGrid
                            cols={{
                                base: 1,
                                sm: 1,
                                md: 2
                            }}
                            key="node-inbounds-grid"
                            pt="md"
                        >
                            {inbounds?.map((inbound) => (
                                <InboundCheckboxCardWidget inbound={inbound} key={inbound.uuid} />
                            ))}
                        </SimpleGrid>
                    </Checkbox.Group>
                </Stack>
            </Stack>

            <Group gap="xs" justify="space-between" pt={15} w="100%">
                <ActionIcon.Group>
                    {node && <DeleteNodeFeature handleClose={handleClose} node={node} />}
                </ActionIcon.Group>

                <Group>
                    {node && (
                        <ToggleNodeStatusButtonFeature handleClose={handleClose} node={node} />
                    )}
                    <Button
                        color="blue"
                        disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                        leftSection={<PiFloppyDiskDuotone size="1rem" />}
                        loading={isUpdateNodePending}
                        size="md"
                        type="submit"
                        variant="outline"
                    >
                        Save
                    </Button>
                </Group>
            </Group>
        </form>
    )
}
