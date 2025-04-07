import {
    ActionIcon,
    Button,
    Checkbox,
    Collapse,
    Divider,
    Group,
    NumberInput,
    rem,
    Select,
    SimpleGrid,
    Slider,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { PiCheckDuotone, PiFloppyDiskDuotone, PiXDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { InboundCheckboxCardWidget } from '@widgets/dashboard/users/inbound-checkbox-card'
import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'

import { COUNTRIES } from './constants'
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

    const { t } = useTranslation()

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
            <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                <Stack gap="md" style={{ flex: '1 1 350px' }}>
                    <ModalAccordionWidget fetchedNode={fetchedNode} node={node} pubKey={pubKey} />

                    <Select
                        key={form.key('countryCode')}
                        label={t('base-node-form.country')}
                        {...form.getInputProps('countryCode')}
                        data={COUNTRIES}
                        placeholder={t('base-node-form.select-country')}
                        required
                        searchable
                    />

                    <TextInput
                        key={form.key('name')}
                        label={t('base-node-form.internal-name')}
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
                                label={t('base-node-form.address')}
                                {...form.getInputProps('address')}
                                placeholder={t('base-node-form.e-g-example-com')}
                                required
                                w="75%"
                            />

                            <NumberInput
                                key={form.key('port')}
                                label={t('base-node-form.port')}
                                {...form.getInputProps('port')}
                                allowDecimal={false}
                                allowNegative={false}
                                clampBehavior="strict"
                                decimalScale={0}
                                hideControls
                                max={65535}
                                placeholder={t('base-node-form.e-g-443')}
                                required
                                w="20%"
                            />
                        </Group>

                        <Switch
                            key={form.key('isTrafficTrackingActive')}
                            {...form.getInputProps('isTrafficTrackingActive', {
                                type: 'checkbox'
                            })}
                            label={t('base-node-form.traffic-tracking')}
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
                                    label={t('base-node-form.limit')}
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
                                    label={t('base-node-form.reset-day')}
                                    {...form.getInputProps('trafficResetDay')}
                                    allowDecimal={false}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    decimalScale={0}
                                    hideControls
                                    max={31}
                                    min={1}
                                    placeholder={t('base-node-form.e-g-1-31')}
                                    w={'30%'}
                                />

                                <NumberInput
                                    key={form.key('notifyPercent')}
                                    label={t('base-node-form.notify-percent')}
                                    {...form.getInputProps('notifyPercent')}
                                    allowDecimal={false}
                                    allowNegative={false}
                                    clampBehavior="strict"
                                    decimalScale={0}
                                    hideControls
                                    max={100}
                                    placeholder={t('base-node-form.e-g-50')}
                                    w={'30%'}
                                />
                            </Group>
                        </Collapse>
                    </Stack>
                </Stack>

                <Divider className="responsive-divider" orientation="vertical" visibleFrom="md" />

                <Stack gap="md" style={{ flex: '1 1 350px' }}>
                    <Stack gap="xs" mb={10}>
                        <Text fw={600} size="sm">
                            {t('base-node-form.consumption-multiplier')}
                        </Text>
                        <Slider
                            key={form.key('consumptionMultiplier')}
                            {...form.getInputProps('consumptionMultiplier')}
                            defaultValue={node?.consumptionMultiplier ?? 1.0}
                            marks={[
                                { value: 10.0, label: '10.0' },
                                { value: 1.0, label: '1.0' },
                                { value: 0.1, label: '0.1' }
                            ]}
                            max={10.0}
                            min={0.1}
                            step={0.1}
                            styles={{ thumb: { borderWidth: 2, padding: 3 } }}
                            thumbSize={22}
                        />
                    </Stack>

                    <Checkbox.Group
                        description={t('base-node-form.select-active-inbounds-for-this-node')}
                        key={form.key('excludedInbounds')}
                        label={t('base-node-form.inbounds')}
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
            </Group>

            <Group gap="xs" justify="space-between" pt={15} w="100%">
                <ActionIcon.Group>
                    {node && <DeleteNodeFeature handleClose={handleClose} node={node} />}
                </ActionIcon.Group>

                <Group grow preventGrowOverflow={false} wrap="wrap">
                    {node && (
                        <>
                            <GetNodeUsersUsageFeature nodeUuid={node.uuid} />
                            <ToggleNodeStatusButtonFeature handleClose={handleClose} node={node} />
                        </>
                    )}
                    <Button
                        color="blue"
                        disabled={!form.isDirty() || !form.isTouched()}
                        leftSection={<PiFloppyDiskDuotone size="1rem" />}
                        loading={isUpdateNodePending}
                        size="md"
                        type="submit"
                        variant="outline"
                    >
                        {t('base-node-form.save')}
                    </Button>
                </Group>
            </Group>
        </form>
    )
}
