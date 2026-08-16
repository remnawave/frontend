import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { HostSelectInboundFeature } from '@features/ui/dashboard/hosts/host-select-inbound/host-select-inbound.feature'
import {
    ActionIcon,
    Autocomplete,
    Badge,
    Button,
    Checkbox,
    Group,
    HoverCard,
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    Switch,
    Tabs,
    TagsInput,
    Text,
    TextInput,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    ALPN,
    CreateHostCommand,
    FINGERPRINTS,
    MIHOMO_IP_VERSION,
    SECURITY_LAYERS,
    SUBSCRIPTION_TEMPLATE_TYPE,
    UpdateHostCommand,
    UpdateManyHostsCommand
} from '@remnawave/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import {
    PiCaretDown,
    PiFloppyDiskDuotone,
    PiGearSixDuotone,
    PiInfo,
    PiListChecks,
    PiNetwork,
    PiNoteDuotone,
    PiPencilDuotone,
    PiTag
} from 'react-icons/pi'
import {
    TbArrowsExchange,
    TbCirclesRelation,
    TbCloudNetwork,
    TbEye,
    TbFileDescription,
    TbMask,
    TbServer2,
    TbStar
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useIsMobile } from '@shared/hooks'
import { ChipMultiSelect } from '@shared/ui/chip-multi-select'
import { DrawerFooter } from '@shared/ui/drawer-footer'
import { MihomoLogo, SingboxLogo, StashLogo } from '@shared/ui/logos'
import { XrayLogo } from '@shared/ui/logos/xray-logo'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'
import { PopoverWithInfoShared } from '@shared/ui/popovers/popover-with-info'
import { SectionCard } from '@shared/ui/section-card'
import { TagInputPill } from '@shared/ui/tag-input-pill'
import { emojiFlag, resolveCountryCode } from '@shared/utils/misc/resolve-country-code'

import { IProps } from './interfaces'
import { FINAL_MASK_MODAL_ID, FinalMaskModalContent } from './modals/final-mask.modal.content'
import { MUX_MODAL_ID, MuxModalContent } from './modals/mux.modal.content'
import { SOCKOPT_MODAL_ID, SockoptModalContent } from './modals/sockopt.modal.content'
import { XHTTP_MODAL_ID, XhttpModalContent } from './modals/xhttp.modal.content'

const SUBSCRIPTION_TYPES = {
    [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON]: {
        label: 'Xray JSON',
        icon: <XrayLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64]: {
        label: 'Xray Base64',
        icon: <XrayLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO]: {
        label: 'Mihomo',
        icon: <MihomoLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.STASH]: {
        label: 'Stash',
        icon: <StashLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX]: {
        label: 'Singbox',
        icon: <SingboxLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.CLASH]: {
        label: 'Clash',
        icon: <MihomoLogo size={16} />
    }
} as const

export const BaseHostForm = <
    T extends
        | CreateHostCommand.RequestBody
        | UpdateHostCommand.RequestBody
        | UpdateManyHostsCommand.RequestBody
>(
    props: IProps<T>
) => {
    const {
        form,
        handleSubmit,
        configProfiles,
        isSubmitting,
        nodes,
        internalSquads,
        subscriptionTemplates,
        hostTags,
        removeRequiredFields,
        hostUuid
    } = props

    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<null | string>('basic')
    const isMobile = useIsMobile()

    const securityLayerLabels = {
        [SECURITY_LAYERS.TLS]: t('base-host-form.tls-transport-layer-security'),
        [SECURITY_LAYERS.NONE]: t('base-host-form.none'),
        [SECURITY_LAYERS.DEFAULT]: t('base-host-form.inbounds-default')
    }

    const resolveSelectedRawInbound = () => {
        const { inbound } = form.getValues()

        if (!inbound?.configProfileUuid || !inbound.configProfileInboundUuid) {
            return undefined
        }

        return configProfiles
            ?.find((configProfile) => configProfile.uuid === inbound.configProfileUuid)
            ?.inbounds.find(
                (profileInbound) => profileInbound.uuid === inbound.configProfileInboundUuid
            )?.rawInbound
    }

    const isXhttpExtraButtonDisabled = () => {
        const { inbound } = form.getValues()

        if (!inbound) {
            return true
        }

        if (!configProfiles || !inbound.configProfileInboundUuid || !inbound.configProfileUuid) {
            return true
        }

        return !configProfiles.some(
            (configProfile) =>
                configProfile.uuid === inbound.configProfileUuid &&
                configProfile.inbounds.some((inbound) => inbound.network === 'xhttp')
        )
    }

    const saveInbound = (inbound: string, configProfileUuid: string) => {
        form.setValues({
            inbound: {
                configProfileInboundUuid: inbound,
                configProfileUuid
            }
        } as Partial<T>)
        form.setTouched({
            configProfileInboundUuid: true,
            configProfileUuid: true
        })
        form.setDirty({
            configProfileInboundUuid: true,
            configProfileUuid: true
        })
    }

    const patternHoverCard = (showSingle = true, showMulti = true, showWildcard = true) => {
        return (
            <HoverCard shadow="md" width={300} withArrow>
                <HoverCard.Target>
                    <ActionIcon color="gray" size="xs" variant="subtle">
                        <HiQuestionMarkCircle size={20} />
                    </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Stack gap="md">
                        <Stack gap="sm">
                            {showSingle && (
                                <Stack gap={0}>
                                    <Text fw={600} mb={4} size="sm">
                                        {t('base-host-form.single-domain')}
                                    </Text>
                                    <Text c="dimmed" mb={6} size="xs">
                                        {t('base-host-form.default-mode-for-one-domain')}
                                    </Text>
                                    <Text c="blue" ff="monospace" size="xs">
                                        eu.node.com
                                    </Text>
                                </Stack>
                            )}

                            {showMulti && (
                                <Stack gap={0}>
                                    <Text fw={600} mb={4} size="sm">
                                        {t('base-host-form.multi-domain')}
                                    </Text>
                                    <Text c="dimmed" mb={6} size="xs">
                                        {t('base-host-form.multi-domain-description')}
                                    </Text>
                                    <Text c="blue" ff="monospace" size="xs">
                                        eu.node.com,us.node.com,au.node.com
                                    </Text>
                                </Stack>
                            )}

                            {showWildcard && (
                                <Stack gap={0}>
                                    <Text fw={600} mb={4} size="sm">
                                        {t('base-host-form.wildcard-domain')}
                                    </Text>
                                    <Text c="dimmed" mb={6} size="xs">
                                        {t('base-host-form.wildcard-domain-description')}
                                    </Text>
                                    <Text c="blue" ff="monospace" size="xs">
                                        *.node.com
                                    </Text>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </HoverCard.Dropdown>
            </HoverCard>
        )
    }

    const shuffleHostHoverCard = () => {
        return (
            <HoverCard shadow="md" width={280} withArrow>
                <HoverCard.Target>
                    <ActionIcon color="gray" size="xs" variant="subtle">
                        <HiQuestionMarkCircle size={20} />
                    </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Stack gap="md">
                        <Stack gap="sm">
                            <Text c="dimmed" size="sm">
                                {t('base-host-form.shuffled-hosts-hover-card')}
                            </Text>
                        </Stack>
                    </Stack>
                </HoverCard.Dropdown>
            </HoverCard>
        )
    }

    const tagsInputProps = form.getInputProps('tags')

    const handleTagsChange = (value: string[]) => {
        tagsInputProps.onChange?.(value)

        form.setErrors((errors) =>
            Object.fromEntries(
                Object.entries(errors).filter(([key]) => key !== 'tags' && !key.startsWith('tags.'))
            )
        )
        form.validateField('tags')
    }

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="xs" justify="space-between" mb="md" pl={4} pr={4}>
                <Group gap="xs">
                    <ThemeIcon color="indigo" size="lg" variant="soft">
                        <TbEye size={24} />
                    </ThemeIcon>

                    <Text fw={600} size="lg">
                        {t('base-host-form.host-visibility')}
                    </Text>
                </Group>
                <Switch
                    color="teal.8"
                    key={form.key('isDisabled')}
                    size="lg"
                    {...form.getInputProps('isDisabled', { type: 'checkbox' })}
                />
            </Group>

            <Tabs
                keepMounted
                keepMountedMode="display-none"
                onChange={setActiveTab}
                value={activeTab}
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab key="basic" leftSection={<PiNoteDuotone size={16} />} value="basic">
                        {t('base-host-form.basic')}
                    </Tabs.Tab>

                    <Tabs.Tab
                        key="advanced"
                        leftSection={<PiGearSixDuotone size={16} />}
                        value="advanced"
                    >
                        {t('base-host-form.advanced')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="basic">
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === 'basic'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <SectionCard.Root style={styles}>
                                <SectionCard.Section>
                                    <BaseOverlayHeader
                                        iconColor="teal"
                                        IconComponent={PiTag}
                                        iconVariant="soft"
                                        title={t('base-host-form.vital-parameters')}
                                        titleOrder={5}
                                    />
                                </SectionCard.Section>
                                <SectionCard.Section>
                                    <Stack gap="md">
                                        <TextInput
                                            key={form.key('remark')}
                                            label={t('base-host-form.remark')}
                                            {...form.getInputProps('remark')}
                                            leftSection={<TemplateInfoPopoverShared />}
                                            required={!removeRequiredFields}
                                        />

                                        <Stack gap="xs">
                                            <HostSelectInboundFeature
                                                activeConfigProfileInbound={
                                                    form.getValues().inbound
                                                        ?.configProfileInboundUuid ?? undefined
                                                }
                                                activeConfigProfileUuid={
                                                    form.getValues().inbound?.configProfileUuid ??
                                                    undefined
                                                }
                                                configProfiles={configProfiles}
                                                onSaveInbound={saveInbound}
                                            />
                                        </Stack>

                                        <Group
                                            gap="xs"
                                            grow
                                            justify="space-between"
                                            preventGrowOverflow={false}
                                            w="100%"
                                        >
                                            <TextInput
                                                key={form.key('address')}
                                                label={t('base-host-form.address')}
                                                leftSection={
                                                    <PopoverWithInfoShared
                                                        text={
                                                            <>
                                                                {t(
                                                                    'base-host-form.address-description-line-1'
                                                                )}
                                                                <br />
                                                                {t(
                                                                    'base-host-form.address-description-line-2'
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                }
                                                {...form.getInputProps('address')}
                                                placeholder={t('base-host-form.e-g-example-com')}
                                                required={!removeRequiredFields}
                                                rightSection={patternHoverCard(true, true, true)}
                                                w="65%"
                                            />

                                            <NumberInput
                                                key={form.key('port')}
                                                label={t('base-host-form.port')}
                                                {...form.getInputProps('port')}
                                                allowDecimal={false}
                                                allowNegative={false}
                                                clampBehavior="strict"
                                                decimalScale={0}
                                                hideControls
                                                leftSection={
                                                    <PopoverWithInfoShared
                                                        text={
                                                            <>
                                                                {t(
                                                                    'base-host-form.port-description-line-1'
                                                                )}
                                                                <br />
                                                                <br />
                                                                {t(
                                                                    'base-host-form.port-description-line-2'
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                }
                                                max={65535}
                                                min={1}
                                                placeholder={t('base-host-form.e-g-443')}
                                                required={!removeRequiredFields}
                                                w="30%"
                                            />
                                        </Group>

                                        <TagsInput
                                            clearable
                                            data={hostTags ?? []}
                                            description={t(
                                                'host-tags-input.tags-are-not-visible-to-end-users-tag-will-be-sent-with-raw-subscription-only'
                                            )}
                                            key={form.key('tags')}
                                            label={t('use-nodes-table-widget.tags')}
                                            leftSection={<TbStar size="16px" />}
                                            maxTags={10}
                                            placeholder="Enter tags (comma, space, semicolon)"
                                            splitChars={[',', ' ', ';']}
                                            {...tagsInputProps}
                                            error={
                                                Object.keys(form.errors)
                                                    .filter((key) => key.startsWith('tags.'))
                                                    .map((key) => form.errors[key])
                                                    .join(', ') || tagsInputProps.error
                                            }
                                            onChange={handleTagsChange}
                                            renderPill={({ value, onRemove }) => (
                                                <TagInputPill onRemove={onRemove} value={value} />
                                            )}
                                        />

                                        <MultiSelect
                                            clearButtonProps={{
                                                size: 'xs'
                                            }}
                                            data={nodes.map((node) => ({
                                                label: `${emojiFlag(node.countryCode)} ${node.name}${
                                                    node.provider ? ` (${node.provider.name})` : ''
                                                }`,
                                                value: node.uuid
                                            }))}
                                            description={t(
                                                'base-host-form.pick-nodes-which-resolved-from-this-host-only-visual-assignment'
                                            )}
                                            inputWrapperOrder={[
                                                'label',
                                                'input',
                                                'description',
                                                'error'
                                            ]}
                                            key={form.key('nodes')}
                                            label={t('base-host-form.nodes')}
                                            leftSection={<TbServer2 size={16} />}
                                            renderOption={(item) => {
                                                const node = nodes.find(
                                                    (node) => node.uuid === item.option.value
                                                )
                                                if (!node) return null
                                                return (
                                                    <>
                                                        <Checkbox
                                                            aria-hidden
                                                            checked={item.checked}
                                                            onChange={() => {}}
                                                            style={{ pointerEvents: 'none' }}
                                                            tabIndex={-1}
                                                        />
                                                        <Group
                                                            gap={7}
                                                            justify="space-between"
                                                            w="100%"
                                                        >
                                                            <Group gap={7}>
                                                                {resolveCountryCode(
                                                                    node.countryCode
                                                                )}
                                                                <span>{node.name}</span>
                                                            </Group>
                                                            {node.provider && (
                                                                <Badge color="gray" size="xs">
                                                                    {node.provider.name}
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                    </>
                                                )
                                            }}
                                            renderPill={({ option, value, onRemove }) => (
                                                <TagInputPill
                                                    onRemove={onRemove}
                                                    value={option?.label ?? value}
                                                />
                                            )}
                                            searchable
                                            {...form.getInputProps('nodes')}
                                        />

                                        <MultiSelect
                                            clearable
                                            clearButtonProps={{
                                                size: 'xs'
                                            }}
                                            data={internalSquads.map((internalSquad) => ({
                                                label: internalSquad.name,
                                                value: internalSquad.uuid
                                            }))}
                                            description={t(
                                                'base-host-form.exclude-this-host-from-specific-internal-squads'
                                            )}
                                            inputWrapperOrder={[
                                                'label',
                                                'input',
                                                'description',
                                                'error'
                                            ]}
                                            key={form.key('excludedInternalSquads')}
                                            label={t('base-host-form.excluded-internal-squads')}
                                            leftSection={<TbCirclesRelation size={16} />}
                                            renderOption={(item) => {
                                                return (
                                                    <Checkbox
                                                        aria-hidden
                                                        checked={item.checked}
                                                        label={item.option.label}
                                                        onChange={() => {}}
                                                        style={{ pointerEvents: 'none' }}
                                                        tabIndex={-1}
                                                    />
                                                )
                                            }}
                                            renderPill={({ option, value, onRemove }) => (
                                                <TagInputPill
                                                    onRemove={onRemove}
                                                    value={option?.label ?? value}
                                                />
                                            )}
                                            searchable
                                            {...form.getInputProps('excludedInternalSquads')}
                                        />
                                    </Stack>
                                </SectionCard.Section>
                            </SectionCard.Root>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value="advanced">
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === 'advanced'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <SectionCard.Root>
                                    <SectionCard.Section>
                                        <BaseOverlayHeader
                                            iconColor="teal"
                                            IconComponent={PiGearSixDuotone}
                                            iconVariant="soft"
                                            title={t('base-host-form.connection-overrides')}
                                            titleOrder={5}
                                        />
                                    </SectionCard.Section>
                                    <SectionCard.Section>
                                        <Stack gap="xs">
                                            <TextInput
                                                key={form.key('sni')}
                                                label="SNI"
                                                leftSection={
                                                    <PopoverWithInfoShared
                                                        text={
                                                            <>
                                                                {t(
                                                                    'base-host-form.sni-description-line-1'
                                                                )}
                                                                <br />
                                                                <br />
                                                                {t(
                                                                    'base-host-form.sni-description-line-2'
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                }
                                                placeholder={t(
                                                    'base-host-form.sni-e-g-example-com'
                                                )}
                                                rightSection={patternHoverCard(true, true, true)}
                                                {...form.getInputProps('sni')}
                                            />

                                            <Group gap="xs" justify="space-between">
                                                <Group gap={4}>
                                                    <Text fw={600} size="sm">
                                                        {t(
                                                            'base-host-form.override-sni-from-address'
                                                        )}
                                                    </Text>
                                                    <HoverCard shadow="md" width={280} withArrow>
                                                        <HoverCard.Target>
                                                            <ActionIcon
                                                                color="gray"
                                                                size="xs"
                                                                variant="subtle"
                                                            >
                                                                <HiQuestionMarkCircle size={20} />
                                                            </ActionIcon>
                                                        </HoverCard.Target>
                                                        <HoverCard.Dropdown>
                                                            <Stack gap="sm">
                                                                <Text c="dimmed" size="sm">
                                                                    {t(
                                                                        'base-host-form.override-sni-from-address-description'
                                                                    )}
                                                                </Text>
                                                            </Stack>
                                                        </HoverCard.Dropdown>
                                                    </HoverCard>
                                                </Group>
                                                <Switch
                                                    color="teal.8"
                                                    key={form.key('overrideSniFromAddress')}
                                                    size="md"
                                                    {...form.getInputProps(
                                                        'overrideSniFromAddress',
                                                        {
                                                            type: 'checkbox'
                                                        }
                                                    )}
                                                />
                                            </Group>

                                            <Group gap="xs" justify="space-between">
                                                <Group gap={4}>
                                                    <Text fw={600} size="sm">
                                                        {t('base-host-form.keep-sni-blank')}
                                                    </Text>
                                                    <HoverCard shadow="md" width={280} withArrow>
                                                        <HoverCard.Target>
                                                            <ActionIcon
                                                                color="gray"
                                                                size="xs"
                                                                variant="subtle"
                                                            >
                                                                <HiQuestionMarkCircle size={20} />
                                                            </ActionIcon>
                                                        </HoverCard.Target>
                                                        <HoverCard.Dropdown>
                                                            <Stack gap="sm">
                                                                <Text c="dimmed" size="sm">
                                                                    {t(
                                                                        'base-host-form.keep-sni-blank-description'
                                                                    )}
                                                                </Text>
                                                            </Stack>
                                                        </HoverCard.Dropdown>
                                                    </HoverCard>
                                                </Group>
                                                <Switch
                                                    color="teal.8"
                                                    key={form.key('keepSniBlank')}
                                                    size="md"
                                                    {...form.getInputProps('keepSniBlank', {
                                                        type: 'checkbox'
                                                    })}
                                                />
                                            </Group>

                                            <Group
                                                gap="xs"
                                                grow
                                                justify="space-between"
                                                preventGrowOverflow={false}
                                                w="100%"
                                            >
                                                <TextInput
                                                    key={form.key('host')}
                                                    label={t('base-host-form.host')}
                                                    placeholder={t(
                                                        'base-host-form.host-e-g-example-com'
                                                    )}
                                                    rightSection={patternHoverCard(
                                                        true,
                                                        false,
                                                        true
                                                    )}
                                                    {...form.getInputProps('host')}
                                                    w="55%"
                                                />
                                                <TextInput
                                                    key={form.key('path')}
                                                    label={t('base-host-form.path')}
                                                    placeholder={t('base-host-form.path-e-g-ws')}
                                                    {...form.getInputProps('path')}
                                                    w="40%"
                                                />
                                            </Group>

                                            <Select
                                                allowDeselect={false}
                                                clearable={false}
                                                data={Object.values(SECURITY_LAYERS).map(
                                                    (securityLayer) => ({
                                                        label:
                                                            securityLayerLabels[securityLayer] ||
                                                            securityLayer,
                                                        value: securityLayer
                                                    })
                                                )}
                                                key={form.key('securityLayer')}
                                                label={t('base-host-form.security-layer')}
                                                leftSection={
                                                    <Tooltip
                                                        events={{
                                                            hover: true,
                                                            focus: true,
                                                            touch: false
                                                        }}
                                                        label={t(
                                                            'base-host-form.here-you-can-override-security-settings-from-xtls-config'
                                                        )}
                                                        multiline
                                                        offset={10}
                                                        transitionProps={{ duration: 200 }}
                                                        w={220}
                                                        withArrow
                                                    >
                                                        <span
                                                            style={{
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <PiInfo size="20px" />
                                                        </span>
                                                    </Tooltip>
                                                }
                                                {...form.getInputProps('securityLayer')}
                                            />

                                            <Group
                                                gap="xs"
                                                grow
                                                justify="space-between"
                                                preventGrowOverflow={false}
                                                w="100%"
                                            >
                                                <Select
                                                    clearable
                                                    data={Object.values(ALPN).map((alpn) => ({
                                                        label: alpn,
                                                        value: alpn
                                                    }))}
                                                    key={form.key('alpn')}
                                                    label="ALPN"
                                                    placeholder={t('base-host-form.alpn-e-g-h2')}
                                                    {...form.getInputProps('alpn')}
                                                    w="40%"
                                                />

                                                <Autocomplete
                                                    clearable
                                                    clearSectionMode="both"
                                                    data={FINGERPRINTS}
                                                    key={form.key('fingerprint')}
                                                    label={t('base-host-form.fingerprint')}
                                                    placeholder={t(
                                                        'base-host-form.fingerprint-e-g-chrome'
                                                    )}
                                                    rightSection={<PiCaretDown size={16} />}
                                                    {...form.getInputProps('fingerprint')}
                                                    w="55%"
                                                />
                                            </Group>

                                            <NumberInput
                                                key={form.key('vlessRouteId')}
                                                label="Vless Route ID"
                                                {...form.getInputProps('vlessRouteId')}
                                                allowDecimal={false}
                                                allowNegative={false}
                                                clampBehavior="strict"
                                                decimalScale={0}
                                                description={t(
                                                    'base-host-form.vless-route-description'
                                                )}
                                                hideControls
                                                max={65535}
                                                min={0}
                                                rightSection={
                                                    <ActionIcon
                                                        color="gray"
                                                        onClick={() => {
                                                            window.open(
                                                                'https://xtls.github.io/config/routing.html',
                                                                '_blank'
                                                            )
                                                        }}
                                                        size="xs"
                                                        variant="subtle"
                                                    >
                                                        <HiQuestionMarkCircle size={20} />
                                                    </ActionIcon>
                                                }
                                            />
                                        </Stack>
                                    </SectionCard.Section>

                                    <SectionCard.Section>
                                        <Stack gap="xs">
                                            <Group gap="xs" justify="space-between">
                                                <Group gap={4}>
                                                    <Text fw={600} size="sm">
                                                        {t('base-host-form.hide-host')}
                                                    </Text>
                                                    <HoverCard shadow="md" width={280} withArrow>
                                                        <HoverCard.Target>
                                                            <ActionIcon
                                                                color="gray"
                                                                size="xs"
                                                                variant="subtle"
                                                            >
                                                                <HiQuestionMarkCircle size={20} />
                                                            </ActionIcon>
                                                        </HoverCard.Target>
                                                        <HoverCard.Dropdown>
                                                            <Stack gap="sm">
                                                                <Text c="dimmed" size="sm">
                                                                    {t(
                                                                        'base-host-form.hidden-host-description'
                                                                    )}
                                                                </Text>
                                                            </Stack>
                                                        </HoverCard.Dropdown>
                                                    </HoverCard>
                                                </Group>
                                                <Switch
                                                    color="teal.8"
                                                    key={form.key('isHidden')}
                                                    size="md"
                                                    {...form.getInputProps('isHidden', {
                                                        type: 'checkbox'
                                                    })}
                                                />
                                            </Group>

                                            <ChipMultiSelect
                                                data={Object.entries(SUBSCRIPTION_TYPES).map(
                                                    ([value, { label, icon }]) => ({
                                                        label,
                                                        icon,
                                                        value
                                                    })
                                                )}
                                                description={t(
                                                    'base-host-form.select-one-or-more-subscription-types-description'
                                                )}
                                                key={form.key('excludeFromSubscriptionTypes')}
                                                label={t(
                                                    'base-host-form.exclude-from-subscription-type'
                                                )}
                                                {...form.getInputProps(
                                                    'excludeFromSubscriptionTypes'
                                                )}
                                            />
                                        </Stack>
                                    </SectionCard.Section>
                                </SectionCard.Root>

                                <SectionCard.Root>
                                    <SectionCard.Section>
                                        <BaseOverlayHeader
                                            iconColor="violet"
                                            IconComponent={XrayLogo}
                                            iconVariant="soft"
                                            title={t('base-host-form.xray-json-and-raw')}
                                            titleOrder={5}
                                        />
                                    </SectionCard.Section>
                                    <SectionCard.Section>
                                        <Stack gap="xs">
                                            <Select
                                                clearable
                                                data={subscriptionTemplates
                                                    .filter(
                                                        (template) =>
                                                            template.templateType === 'XRAY_JSON'
                                                    )
                                                    .map((template) => ({
                                                        label: template.name,
                                                        value: template.uuid
                                                    }))}
                                                description={t(
                                                    'base-host-form.override-the-xray-json-template'
                                                )}
                                                key={form.key('xrayJsonTemplateUuid')}
                                                label={t('base-host-form.xray-json-template')}
                                                leftSection={<XrayLogo size={16} />}
                                                placeholder={t(
                                                    'base-host-form.select-a-xray-json-template'
                                                )}
                                                {...form.getInputProps('xrayJsonTemplateUuid')}
                                            />
                                        </Stack>
                                    </SectionCard.Section>

                                    <SectionCard.Section>
                                        <Group
                                            gap="xs"
                                            grow
                                            justify="space-between"
                                            preventGrowOverflow={false}
                                            w="100%"
                                        >
                                            <Button
                                                color="gray"
                                                disabled={isXhttpExtraButtonDisabled()}
                                                leftSection={<PiPencilDuotone />}
                                                onClick={() => {
                                                    modals.open({
                                                        modalId: XHTTP_MODAL_ID,
                                                        fullScreen: isMobile,
                                                        title: (
                                                            <BaseOverlayHeader
                                                                iconColor="teal"
                                                                IconComponent={PiPencilDuotone}
                                                                iconVariant="soft"
                                                                title={t(
                                                                    'base-host-form.xhttp-extra-params'
                                                                )}
                                                            />
                                                        ),
                                                        centered: true,
                                                        size: 'lg',
                                                        withCloseButton: true,
                                                        children: <XhttpModalContent form={form} />
                                                    })
                                                }}
                                                variant="soft"
                                            >
                                                xHTTP
                                            </Button>

                                            <Button
                                                color="gray"
                                                leftSection={<TbCloudNetwork />}
                                                onClick={() => {
                                                    modals.open({
                                                        modalId: MUX_MODAL_ID,
                                                        fullScreen: isMobile,
                                                        title: (
                                                            <BaseOverlayHeader
                                                                iconColor="teal"
                                                                IconComponent={TbCloudNetwork}
                                                                iconVariant="soft"
                                                                title="MUX"
                                                            />
                                                        ),
                                                        centered: true,
                                                        size: 'lg',
                                                        withCloseButton: true,
                                                        children: <MuxModalContent form={form} />
                                                    })
                                                }}
                                                variant="soft"
                                            >
                                                Mux
                                            </Button>

                                            <Button
                                                color="gray"
                                                leftSection={<PiNetwork />}
                                                onClick={() => {
                                                    modals.open({
                                                        modalId: SOCKOPT_MODAL_ID,
                                                        fullScreen: isMobile,
                                                        title: (
                                                            <BaseOverlayHeader
                                                                iconColor="teal"
                                                                IconComponent={PiNetwork}
                                                                iconVariant="soft"
                                                                title="SockOpt"
                                                            />
                                                        ),
                                                        centered: true,
                                                        size: 'lg',
                                                        withCloseButton: true,
                                                        children: (
                                                            <SockoptModalContent form={form} />
                                                        )
                                                    })
                                                }}
                                                variant="soft"
                                            >
                                                SockOpt
                                            </Button>

                                            <Button
                                                color="gray"
                                                leftSection={<TbMask />}
                                                onClick={() => {
                                                    modals.open({
                                                        modalId: FINAL_MASK_MODAL_ID,
                                                        fullScreen: isMobile,
                                                        title: (
                                                            <BaseOverlayHeader
                                                                iconColor="teal"
                                                                IconComponent={TbMask}
                                                                iconVariant="soft"
                                                                title="Final Mask"
                                                            />
                                                        ),
                                                        centered: true,
                                                        size: 'lg',
                                                        withCloseButton: true,
                                                        children: (
                                                            <FinalMaskModalContent form={form} />
                                                        )
                                                    })
                                                }}
                                                variant="soft"
                                            >
                                                Final Mask
                                            </Button>
                                        </Group>
                                    </SectionCard.Section>

                                    <SectionCard.Section>
                                        <Button
                                            color="gray"
                                            fullWidth
                                            leftSection={<TbArrowsExchange />}
                                            onClick={() => {
                                                showModal('hosts_hostMapperModal', {
                                                    form,
                                                    rawInbound: resolveSelectedRawInbound()
                                                })
                                            }}
                                            variant="soft"
                                        >
                                            {t('base-host-form.mapper')}
                                        </Button>
                                    </SectionCard.Section>
                                </SectionCard.Root>

                                <SectionCard.Root>
                                    <SectionCard.Section>
                                        <BaseOverlayHeader
                                            iconColor="teal"
                                            IconComponent={PiListChecks}
                                            iconVariant="soft"
                                            title={t('base-host-form.misc-settings')}
                                            titleOrder={5}
                                        />
                                    </SectionCard.Section>
                                    <SectionCard.Section>
                                        <Stack gap="xs">
                                            <TextInput
                                                key={form.key('serverDescription')}
                                                label={
                                                    <Group gap={4} justify="flex-start">
                                                        <Text fw={600} size="sm">
                                                            {t(
                                                                'base-host-form.server-description-header'
                                                            )}
                                                        </Text>
                                                        <HoverCard
                                                            shadow="md"
                                                            width={280}
                                                            withArrow
                                                        >
                                                            <HoverCard.Target>
                                                                <ActionIcon
                                                                    color="gray"
                                                                    size="xs"
                                                                    variant="subtle"
                                                                >
                                                                    <HiQuestionMarkCircle
                                                                        size={20}
                                                                    />
                                                                </ActionIcon>
                                                            </HoverCard.Target>
                                                            <HoverCard.Dropdown>
                                                                <Stack gap="sm">
                                                                    <Text fw={600} size="sm">
                                                                        {t(
                                                                            'base-host-form.server-description-header'
                                                                        )}
                                                                    </Text>
                                                                    <Text c="dimmed" size="sm">
                                                                        {t(
                                                                            'base-host-form.server-description-1'
                                                                        )}
                                                                        <br />
                                                                        <br />
                                                                        {t(
                                                                            'base-host-form.server-description-2'
                                                                        )}
                                                                    </Text>
                                                                    <Text fw={600} size="sm">
                                                                        {t(
                                                                            'base-host-form.supported-clients'
                                                                        )}
                                                                    </Text>
                                                                    <Text c="dimmed" size="sm">
                                                                        Mihomo: FlClash X, Flowvy,
                                                                        prizrak-box, Koala Clash
                                                                        <br />
                                                                        Xray: Happ, Incy
                                                                    </Text>
                                                                </Stack>
                                                            </HoverCard.Dropdown>
                                                        </HoverCard>
                                                    </Group>
                                                }
                                                leftSection={<TbFileDescription size={20} />}
                                                placeholder={t(
                                                    'base-host-form.server-description-placeholder'
                                                )}
                                                {...form.getInputProps('serverDescription')}
                                            />

                                            <TextInput
                                                key={form.key('pinnedPeerCertSha256')}
                                                label={
                                                    <Group gap={4} justify="flex-start">
                                                        <Text fw={600} size="sm">
                                                            Pinned Peer Cert SHA256
                                                        </Text>
                                                        <ActionIcon
                                                            color="gray"
                                                            onClick={() => {
                                                                window.open(
                                                                    'https://xtls.github.io/ru/config/transports/tls.html#tlsobject',
                                                                    '_blank'
                                                                )
                                                            }}
                                                            size="xs"
                                                            variant="subtle"
                                                        >
                                                            <HiQuestionMarkCircle size={20} />
                                                        </ActionIcon>
                                                    </Group>
                                                }
                                                {...form.getInputProps('pinnedPeerCertSha256')}
                                            />

                                            <TextInput
                                                key={form.key('verifyPeerCertByName')}
                                                label={
                                                    <Group gap={4} justify="flex-start">
                                                        <Text fw={600} size="sm">
                                                            Verify Peer Cert By Name
                                                        </Text>
                                                        <ActionIcon
                                                            color="gray"
                                                            onClick={() => {
                                                                window.open(
                                                                    'https://xtls.github.io/ru/config/transports/tls.html#tlsobject',
                                                                    '_blank'
                                                                )
                                                            }}
                                                            size="xs"
                                                            variant="subtle"
                                                        >
                                                            <HiQuestionMarkCircle size={20} />
                                                        </ActionIcon>
                                                    </Group>
                                                }
                                                {...form.getInputProps('verifyPeerCertByName')}
                                            />

                                            <Group gap="xs" justify="space-between">
                                                <Group gap={4}>
                                                    <Text fw={600} size="sm">
                                                        {t('base-host-form.shuffle-host')}
                                                    </Text>
                                                    {shuffleHostHoverCard()}
                                                </Group>
                                                <Switch
                                                    color="teal.8"
                                                    key={form.key('shuffleHost')}
                                                    size="md"
                                                    {...form.getInputProps('shuffleHost', {
                                                        type: 'checkbox'
                                                    })}
                                                />
                                            </Group>
                                        </Stack>
                                    </SectionCard.Section>
                                </SectionCard.Root>

                                <SectionCard.Root>
                                    <SectionCard.Section>
                                        <BaseOverlayHeader
                                            iconColor="indigo"
                                            IconComponent={MihomoLogo}
                                            iconVariant="soft"
                                            title={t('base-host-form.mihomo-specific')}
                                            titleOrder={5}
                                        />
                                    </SectionCard.Section>
                                    <SectionCard.Section>
                                        <Stack gap="xs">
                                            <Group gap="xs" justify="space-between">
                                                <Group gap={4}>
                                                    <Text fw={600} size="sm">
                                                        {t('base-host-form.enable-x25519mlkem768')}
                                                    </Text>
                                                    <ActionIcon
                                                        color="gray"
                                                        onClick={() => {
                                                            window.open(
                                                                'https://wiki.metacubex.one/en/config/proxies/tls/#reality-optssupport-x25519mlkem768',
                                                                '_blank'
                                                            )
                                                        }}
                                                        size="xs"
                                                        variant="subtle"
                                                    >
                                                        <HiQuestionMarkCircle size={20} />
                                                    </ActionIcon>
                                                </Group>
                                                <Switch
                                                    color="teal.8"
                                                    key={form.key('mihomoX25519')}
                                                    size="md"
                                                    {...form.getInputProps('mihomoX25519', {
                                                        type: 'checkbox'
                                                    })}
                                                />
                                            </Group>

                                            <Select
                                                clearable
                                                data={Object.values(MIHOMO_IP_VERSION).map(
                                                    (ipVersion) => ({
                                                        label: ipVersion,
                                                        value: ipVersion
                                                    })
                                                )}
                                                key={form.key('mihomoIpVersion')}
                                                label={
                                                    <Group gap={4} justify="flex-start">
                                                        <Text fw={600} size="sm">
                                                            Mihomo IP Version
                                                        </Text>
                                                        <ActionIcon
                                                            color="gray"
                                                            onClick={() => {
                                                                window.open(
                                                                    'https://wiki.metacubex.one/ru/config/proxies/#ip-version',
                                                                    '_blank'
                                                                )
                                                            }}
                                                            size="xs"
                                                            variant="subtle"
                                                        >
                                                            <HiQuestionMarkCircle size={20} />
                                                        </ActionIcon>
                                                    </Group>
                                                }
                                                {...form.getInputProps('mihomoIpVersion')}
                                            />
                                        </Stack>
                                    </SectionCard.Section>
                                </SectionCard.Root>
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>

            <DrawerFooter>
                <Group gap="xs" justify="space-between" w="100%">
                    <Group gap="xs">
                        <Button
                            color="teal"
                            disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                            leftSection={<PiFloppyDiskDuotone size="16px" />}
                            loading={isSubmitting}
                            size="md"
                            type="submit"
                            variant="soft"
                        >
                            {t('common.save')}
                        </Button>
                    </Group>

                    {!!hostUuid && <DeleteHostFeature hostUuid={hostUuid} />}
                </Group>
            </DrawerFooter>
        </form>
    )
}
