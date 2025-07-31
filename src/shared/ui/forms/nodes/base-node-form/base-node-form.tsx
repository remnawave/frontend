import {
    ActionIcon,
    Badge,
    Button,
    Collapse,
    CopyButton,
    Divider,
    Fieldset,
    Group,
    HoverCard,
    Menu,
    NumberInput,
    Paper,
    px,
    rem,
    Select,
    Skeleton,
    Slider,
    Stack,
    Switch,
    Text,
    TextInput,
    Title
} from '@mantine/core'
import {
    TbChartBar,
    TbChartLine,
    TbCopy,
    TbDots,
    TbMapPin,
    TbUserCheck,
    TbWorld
} from 'react-icons/tb'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { PiCheckDuotone, PiFloppyDiskDuotone, PiXDuotone } from 'react-icons/pi'
import { HiOutlineServer, HiQuestionMarkCircle } from 'react-icons/hi'
import { SiSecurityscorecard } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

import { ShowConfigProfilesWithInboundsFeature } from '@features/ui/dashboard/nodes/show-config-profiles-with-inbounds'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { RestartNodeButtonFeature } from '@features/ui/dashboard/nodes/restart-node-button'
import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { useGetConfigProfiles } from '@shared/api/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'

import { COUNTRIES } from './constants'
import { IProps } from './interfaces'

const MotionWrapper = motion.div
const MotionStack = motion(Stack)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

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
        nodeDetailsCard
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
            <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                {/* Left Side */}
                <MotionStack
                    animate="visible"
                    gap="lg"
                    initial="hidden"
                    style={{ flex: '1 1 400px' }}
                    variants={containerVariants}
                >
                    <ModalAccordionWidget fetchedNode={fetchedNode} node={node} pubKey={pubKey} />

                    {nodeDetailsCard && (
                        <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                    )}

                    {/* Node Vitals */}
                    <MotionWrapper variants={cardVariants}>
                        <Fieldset
                            legend={
                                <Group gap="xs" mb="xs">
                                    <HiOutlineServer
                                        size={20}
                                        style={{
                                            color: 'var(--mantine-color-blue-4)'
                                        }}
                                    />
                                    <Title c="blue.4" order={4}>
                                        {t('base-node-form.node-vitals')}
                                    </Title>
                                </Group>
                            }
                        >
                            <Stack gap="md">
                                <Select
                                    key={form.key('countryCode')}
                                    label={t('base-node-form.country')}
                                    {...form.getInputProps('countryCode')}
                                    data={COUNTRIES}
                                    leftSection={<TbMapPin size={16} />}
                                    placeholder={t('base-node-form.select-country')}
                                    required
                                    searchable
                                    styles={{
                                        label: { fontWeight: 500 }
                                    }}
                                />

                                <TextInput
                                    key={form.key('name')}
                                    label={t('base-node-form.internal-name')}
                                    {...form.getInputProps('name')}
                                    leftSection={<TbUserCheck size={16} />}
                                    required
                                    styles={{
                                        label: { fontWeight: 500 }
                                    }}
                                />

                                <Group gap="xs" grow justify="space-between" w="100%">
                                    <TextInput
                                        key={form.key('address')}
                                        label={t('base-node-form.address')}
                                        {...form.getInputProps('address')}
                                        leftSection={<TbWorld size={16} />}
                                        placeholder={t('base-node-form.e-g-example-com')}
                                        required
                                        styles={{
                                            label: { fontWeight: 500 },
                                            root: { flex: '1 1 70%' }
                                        }}
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
                                        styles={{
                                            label: { fontWeight: 500 },
                                            root: { flex: '1 1 25%' }
                                        }}
                                    />
                                </Group>
                            </Stack>
                        </Fieldset>
                    </MotionWrapper>

                    {/* Node consumption */}
                    <MotionWrapper variants={cardVariants}>
                        <Fieldset
                            legend={
                                <Group gap="xs" mb="xs">
                                    <TbChartLine
                                        size={20}
                                        style={{
                                            color: 'var(--mantine-color-indigo-4)'
                                        }}
                                    />
                                    <Title c="indigo.4" order={4}>
                                        {t('base-node-form.consumption')}
                                    </Title>
                                </Group>
                            }
                        >
                            <Stack gap="md">
                                <Group gap="xs" justify="space-between" w="100%">
                                    <Group gap="xs">
                                        <Text fw={500} size="sm">
                                            {t('base-node-form.consumption-multiplier')}
                                        </Text>

                                        <HoverCard shadow="md" width={280} withArrow>
                                            <HoverCard.Target>
                                                <ActionIcon color="gray" size="xs" variant="subtle">
                                                    <HiQuestionMarkCircle size={16} />
                                                </ActionIcon>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <Stack gap="sm">
                                                    <Text fw={600} size="sm">
                                                        {t('base-node-form.consumption-multiplier')}
                                                    </Text>
                                                    <Text c="dimmed" size="sm">
                                                        {t('base-node-form.consumption-m-line-1')}
                                                    </Text>
                                                    <Text c="dimmed" size="sm">
                                                        {t('base-node-form.consumption-m-line-2')}
                                                    </Text>
                                                </Stack>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
                                    </Group>
                                </Group>

                                <Paper p="sm" radius="md">
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
                                        styles={{
                                            thumb: { borderWidth: 2, padding: 3 },
                                            track: { height: 6 },
                                            bar: { height: 6 }
                                        }}
                                        thumbSize={24}
                                    />
                                </Paper>
                            </Stack>
                        </Fieldset>
                    </MotionWrapper>
                </MotionStack>

                {/* Right Side */}
                <MotionStack
                    animate="visible"
                    gap="lg"
                    initial="hidden"
                    style={{ flex: '1 1 400px' }}
                    variants={containerVariants}
                >
                    {/* Config Profiles */}
                    <MotionWrapper variants={cardVariants}>
                        <Fieldset
                            legend={
                                <Group gap="xs" mb="xs">
                                    <SiSecurityscorecard
                                        size={20}
                                        style={{
                                            color: 'var(--mantine-color-teal-4)'
                                        }}
                                    />
                                    <Title c="teal.4" order={4}>
                                        {t('base-node-form.core-configuration')}
                                    </Title>
                                </Group>
                            }
                        >
                            {isConfigProfilesLoading && (
                                <Stack gap="md">
                                    <Skeleton height={24} width="40%" />
                                    <Skeleton height={16} width="60%" />
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
                                    <ShowConfigProfilesWithInboundsFeature
                                        activeConfigProfileInbounds={
                                            form.getValues().configProfile?.activeInbounds ?? []
                                        }
                                        activeConfigProfileUuid={
                                            form.getValues().configProfile
                                                ?.activeConfigProfileUuid ?? ''
                                        }
                                        configProfiles={configProfiles.configProfiles}
                                        errors={form.errors.configProfile}
                                        onSaveInbounds={saveInbounds}
                                    />
                                </motion.div>
                            )}
                        </Fieldset>
                    </MotionWrapper>

                    {/* Tracking & Billing */}
                    <MotionWrapper variants={cardVariants}>
                        <Fieldset
                            legend={
                                <Group gap="xs" mb="xs">
                                    <TbChartBar
                                        size={20}
                                        style={{
                                            color: 'var(--mantine-color-yellow-4)'
                                        }}
                                    />
                                    <Title c="yellow.4" order={4}>
                                        {t('base-node-form.tracking-and-billing')}
                                    </Title>
                                </Group>
                            }
                        >
                            <Stack gap="md">
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

                                <Stack gap={0}>
                                    <Group gap="xs" justify="space-between">
                                        <Group gap="xs">
                                            <TbChartLine
                                                size={18}
                                                style={{ color: 'var(--mantine-color-indigo-6)' }}
                                            />
                                            <Text fw={500} size="sm">
                                                {t('base-node-form.traffic-tracking')}
                                            </Text>
                                        </Group>
                                        <Switch
                                            key={form.key('isTrafficTrackingActive')}
                                            {...form.getInputProps('isTrafficTrackingActive', {
                                                type: 'checkbox'
                                            })}
                                            onChange={(event) => {
                                                form.getInputProps(
                                                    'isTrafficTrackingActive'
                                                ).onChange(event)
                                                setAdvancedOpened(event.currentTarget.checked)
                                            }}
                                            size="md"
                                            thumbIcon={
                                                form.getValues().isTrafficTrackingActive ? (
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
                                    </Group>

                                    <Collapse in={advancedOpened}>
                                        <Stack gap="sm" mt="sm">
                                            <Divider size="xs" />
                                            <Group gap="md" grow justify="space-between" w="100%">
                                                <NumberInput
                                                    allowDecimal={false}
                                                    decimalScale={0}
                                                    defaultValue={0}
                                                    hideControls
                                                    key={form.key('trafficLimitBytes')}
                                                    label={t('base-node-form.limit')}
                                                    leftSection={
                                                        <Badge
                                                            color="blue"
                                                            size="xs"
                                                            variant="light"
                                                        >
                                                            GB
                                                        </Badge>
                                                    }
                                                    {...form.getInputProps('trafficLimitBytes')}
                                                    styles={{
                                                        label: { fontWeight: 500 }
                                                    }}
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
                                                    styles={{
                                                        label: { fontWeight: 500 }
                                                    }}
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
                                                    styles={{
                                                        label: { fontWeight: 500 }
                                                    }}
                                                />
                                            </Group>
                                        </Stack>
                                    </Collapse>
                                </Stack>
                            </Stack>
                        </Fieldset>
                    </MotionWrapper>
                </MotionStack>
            </Group>

            <ModalFooter>
                {node && (
                    <Menu keepMounted={true} position="top-end" shadow="md">
                        <Menu.Target>
                            <Button
                                leftSection={<TbDots size={px('1.2rem')} />}
                                size="sm"
                                variant="outline"
                            >
                                {t('base-node-form.more-actions')}
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>{t('base-node-form.quick-actions')}</Menu.Label>
                            <GetNodeUsersUsageFeature nodeUuid={node.uuid} />
                            <CopyButton value={node.uuid}>
                                {({ copy }) => (
                                    <Menu.Item leftSection={<TbCopy size="16px" />} onClick={copy}>
                                        {t('base-node-form.copy-node-uuid')}
                                    </Menu.Item>
                                )}
                            </CopyButton>
                            <Menu.Divider />
                            <Menu.Label>{t('base-node-form.management')}</Menu.Label>
                            <RestartNodeButtonFeature handleClose={handleClose} node={node} />
                            <ToggleNodeStatusButtonFeature handleClose={handleClose} node={node} />
                            <Menu.Divider />
                            <DeleteNodeFeature handleClose={handleClose} node={node} />
                        </Menu.Dropdown>
                    </Menu>
                )}
                <Button
                    color="teal"
                    disabled={!form.isDirty() || !form.isTouched()}
                    leftSection={<PiFloppyDiskDuotone size="16px" />}
                    loading={isUpdateNodePending}
                    size="sm"
                    type="submit"
                    variant="light"
                >
                    {t('base-node-form.save')}
                </Button>
            </ModalFooter>
        </form>
    )
}
