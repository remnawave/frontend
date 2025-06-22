import {
    ActionIcon,
    Button,
    Collapse,
    Divider,
    Group,
    NumberInput,
    rem,
    Select,
    Skeleton,
    Slider,
    Stack,
    Switch,
    Text,
    TextInput
} from '@mantine/core'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { PiCheckDuotone, PiFloppyDiskDuotone, PiXDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

import { ShowConfigProfilesWithInboundsFeature } from '@features/ui/dashboard/nodes/show-config-profiles-with-inbounds'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { useGetConfigProfiles } from '@shared/api/hooks'

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
        setAdvancedOpened
    } = props

    const { t } = useTranslation()

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const saveInbounds = (inbounds: string[], configProfileUuid: string) => {
        form.setValues({
            configProfile: {
                activeInbounds: inbounds,
                activeConfigProfileUuid: configProfileUuid
            }
        } as Partial<T>)
        form.setTouched({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
        form.setDirty({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
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

                        <Stack gap="md" mb={-10} mt={30}>
                            <SelectInfraProviderShared
                                selectedInfraProviderUuid={form.getValues().providerUuid}
                                setSelectedInfraProviderUuid={(providerUuid) => {
                                    form.setValues({
                                        providerUuid
                                    } as Partial<T>)
                                    form.setTouched({
                                        providerUuid: true
                                    })
                                    form.setDirty({
                                        providerUuid: true
                                    })
                                }}
                            />
                        </Stack>
                    </Stack>

                    {isConfigProfilesLoading && (
                        <Stack gap="md" mt={10}>
                            <Stack gap="xs">
                                <Skeleton height={24} width="40%" />
                                <Skeleton height={16} width="60%" />
                            </Stack>

                            <Skeleton height={76} radius="md" />
                            <Skeleton height={25} radius="sm" width="100%" />
                        </Stack>
                    )}
                    {!isConfigProfilesLoading && configProfiles && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{
                                duration: 0.4,
                                ease: 'easeInOut'
                            }}
                        >
                            <Stack gap="xs" key="123" mb={10}>
                                <ShowConfigProfilesWithInboundsFeature
                                    activeConfigProfileInbounds={
                                        form.getValues().configProfile?.activeInbounds ?? []
                                    }
                                    activeConfigProfileUuid={
                                        form.getValues().configProfile?.activeConfigProfileUuid ??
                                        ''
                                    }
                                    configProfiles={configProfiles.configProfiles}
                                    errors={form.errors.configProfile}
                                    onSaveInbounds={saveInbounds}
                                />
                            </Stack>
                        </motion.div>
                    )}
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
