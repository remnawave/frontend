import {
    ActionIcon,
    Button,
    Drawer,
    Fieldset,
    Group,
    HoverCard,
    JsonInput,
    NumberInput,
    px,
    Select,
    Stack,
    Switch,
    Tabs,
    Text,
    TextInput,
    Tooltip,
    Transition
} from '@mantine/core'
import {
    PiArrowUpDuotone,
    PiCopyDuotone,
    PiFloppyDiskDuotone,
    PiGearSixDuotone,
    PiInfo,
    PiNetwork,
    PiNoteDuotone,
    PiPencilDuotone
} from 'react-icons/pi'
import {
    ALPN,
    CreateHostCommand,
    FINGERPRINTS,
    SECURITY_LAYERS,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { TbCloudNetwork } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { HappLogo } from '@pages/dashboard/utils/happ-routing-builder/ui/components/happ-routing-builder.page.component'
import { HostSelectInboundFeature } from '@features/ui/dashboard/hosts/host-select-inbound/host-select-inbound.feature'
import { HostTagsInputWidget } from '@widgets/dashboard/hosts/host-tags-input/host-tags-input'
import { PopoverWithInfoShared } from '@shared/ui/popovers/popover-with-info'
import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'
import { ModalFooter } from '@shared/ui/modal-footer'
import { handleFormErrors } from '@shared/utils/misc'

import classes from './HostTabs.module.css'
import { IProps } from './interfaces'

const basicXHttpExtraParams = `{
  "headers": {},
  "xPaddingBytes": "100-1000",
  "noGRPCHeader": false,
  "scMaxEachPostBytes": 1000000,
  "scMinPostsIntervalMs": 30,
  "scStreamUpServerSecs": "20-80",
  "xmux": {
    "maxConcurrency": "16-32",
    "maxConnections": 0,
    "cMaxReuseTimes": 0,
    "hMaxRequestTimes": "600-900",
    "hMaxReusableSecs": "1800-3000",
    "hKeepAlivePeriod": 0
  },
  "downloadSettings": {
    "address": "",
    "port": 443,
    "network": "xhttp",
    "security": "tls",
    "tlsSettings": {},
    "xhttpSettings": {
      "path": "/yourpath"
    },
    "sockopt": {}
  }
}`

const pasteBasicXHttpExtraParams = `{
  "headers": {},
  "xPaddingBytes": "100-1000",
  "noGRPCHeader": false,
  "scMaxEachPostBytes": 1000000,
  "scMinPostsIntervalMs": 30,
  "scStreamUpServerSecs": "20-80",
  "xmux": {
    "maxConcurrency": "16-32",
    "maxConnections": 0,
    "cMaxReuseTimes": 0,
    "hMaxRequestTimes": "600-900",
    "hMaxReusableSecs": "1800-3000",
    "hKeepAlivePeriod": 0
  }
}
`

const basicMuxParams = `{
  "enabled": true,
  "concurrency": -1,
  "xudpConcurrency": 16,
  "xudpProxyUDP443": "reject"
}`

const basicSockoptParams = `{
  "mark": 0,
  "tcpMaxSeg": 1440,
  "tcpFastOpen": false,
  "tproxy": "off",
  "domainStrategy": "AsIs",
  "dialerProxy": "",
  "happyEyeballs": {},
  "acceptProxyProtocol": false,
  "tcpKeepAliveInterval": 0,
  "tcpKeepAliveIdle": 300,
  "tcpUserTimeout": 10000,
  "tcpcongestion": "bbr",
  "interface": "wg0",
  "V6Only": false,
  "tcpWindowClamp": 600,
  "tcpMptcp": false,
  "tcpNoDelay": false
}`

export const BaseHostForm = <T extends CreateHostCommand.Request | UpdateHostCommand.Request>(
    props: IProps<T>
) => {
    const { form, handleSubmit, configProfiles, isSubmitting, handleCloneHost } = props

    const { t } = useTranslation()
    const [opened, { open, close }] = useDisclosure(false)
    const [muxParamsOpened, { open: openMuxParams, close: closeMuxParams }] = useDisclosure(false)
    const [activeTab, setActiveTab] = useState<null | string>('basic')

    const [sockoptParamsOpened, { open: openSockoptParams, close: closeSockoptParams }] =
        useDisclosure(false)

    const securityLayerLabels = {
        [SECURITY_LAYERS.TLS]: t('base-host-form.tls-transport-layer-security'),
        [SECURITY_LAYERS.NONE]: t('base-host-form.none'),
        [SECURITY_LAYERS.DEFAULT]: t('base-host-form.inbounds-default')
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

    useEffect(() => {
        handleFormErrors(form, form.errors)
    }, [form.errors])

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

    const vlessRouteHoverCard = () => {
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
                            <Text c="dimmed" size="sm">
                                Refer to the{' '}
                                <Link
                                    target="_blank"
                                    to="https://xtls.github.io/config/routing.html"
                                >
                                    XTLS Documentation
                                </Link>{' '}
                                for more information.
                            </Text>
                        </Stack>
                    </Stack>
                </HoverCard.Dropdown>
            </HoverCard>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <Group gap="xs" justify="space-between" mb="md">
                <Text fw={500} size="sm">
                    {t('base-host-form.host-visibility')}
                </Text>
                <Switch
                    color="teal.8"
                    key={form.key('isDisabled')}
                    radius="md"
                    size="md"
                    {...form.getInputProps('isDisabled', { type: 'checkbox' })}
                />
            </Group>

            <Tabs
                classNames={classes}
                keepMounted
                onChange={setActiveTab}
                value={activeTab}
                variant="unstyled"
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
                        mounted={activeTab === 'basic'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <TextInput
                                    key={form.key('remark')}
                                    label={t('base-host-form.remark')}
                                    {...form.getInputProps('remark')}
                                    leftSection={<TemplateInfoPopoverShared />}
                                    required
                                />

                                <Stack gap="xs">
                                    <HostSelectInboundFeature
                                        activeConfigProfileInbound={
                                            form.getValues().inbound?.configProfileInboundUuid ??
                                            undefined
                                        }
                                        activeConfigProfileUuid={
                                            form.getValues().inbound?.configProfileUuid ?? undefined
                                        }
                                        configProfiles={configProfiles}
                                        onSaveInbound={saveInbound}
                                    />

                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'base-host-form.select-one-inbound-to-apply-to-the-host'
                                        )}
                                    </Text>
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
                                        required
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
                                        required
                                        w="30%"
                                    />
                                </Group>

                                <HostTagsInputWidget
                                    key={form.key('tag')}
                                    {...form.getInputProps('tag')}
                                    value={form.getValues().tag}
                                />
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value="advanced">
                    <Transition
                        duration={200}
                        mounted={activeTab === 'advanced'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Stack gap="md" style={styles}>
                                <Fieldset legend={t('base-host-form.connection-overrides')}>
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
                                            placeholder={t('base-host-form.sni-e-g-example-com')}
                                            rightSection={patternHoverCard(true, false, true)}
                                            {...form.getInputProps('sni')}
                                        />

                                        <Group gap="xs" justify="space-between">
                                            <Group gap={4}>
                                                <Text fw={600} size="sm">
                                                    {t('base-host-form.override-sni-from-address')}
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
                                                radius="md"
                                                size="md"
                                                {...form.getInputProps('overrideSniFromAddress', {
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
                                                rightSection={patternHoverCard(true, false, true)}
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

                                            <Select
                                                clearable
                                                data={Object.values(FINGERPRINTS).map(
                                                    (fingerprint) => ({
                                                        label: fingerprint,
                                                        value: fingerprint
                                                    })
                                                )}
                                                key={form.key('fingerprint')}
                                                label={t('base-host-form.fingerprint')}
                                                placeholder={t(
                                                    'base-host-form.fingerprint-e-g-chrome'
                                                )}
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
                                            description="From 0 to 65535, empty to disable"
                                            hideControls
                                            max={65535}
                                            min={0}
                                            rightSection={vlessRouteHoverCard()}
                                        />
                                    </Stack>
                                </Fieldset>

                                <Fieldset legend={t('base-host-form.xray-json-and-raw')}>
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
                                                                    'base-host-form.hide-host-from-users-remnawave-will-send-host-only-for-raw-subscription-responses'
                                                                )}
                                                            </Text>
                                                        </Stack>
                                                    </HoverCard.Dropdown>
                                                </HoverCard>
                                            </Group>
                                            <Switch
                                                color="teal.8"
                                                key={form.key('isHidden')}
                                                radius="md"
                                                size="md"
                                                {...form.getInputProps('isHidden', {
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
                                            <Button
                                                disabled={isXhttpExtraButtonDisabled()}
                                                leftSection={<PiPencilDuotone />}
                                                onClick={open}
                                                variant="default"
                                            >
                                                xHTTP
                                            </Button>

                                            <Button
                                                leftSection={<TbCloudNetwork />}
                                                onClick={openMuxParams}
                                                variant="default"
                                            >
                                                Mux
                                            </Button>

                                            <Button
                                                leftSection={<PiNetwork />}
                                                onClick={openSockoptParams}
                                                variant="default"
                                            >
                                                SockOpt
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Fieldset>

                                <Fieldset legend={t('base-host-form.apps-specific')}>
                                    <Stack gap="xs">
                                        <TextInput
                                            description={t(
                                                'base-host-form.server-description-description'
                                            )}
                                            key={form.key('serverDescription')}
                                            label={
                                                <Group gap={4} justify="flex-start">
                                                    <Text fw={600} size="sm">
                                                        {t(
                                                            'base-host-form.server-description-header'
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
                                                                <Text fw={600} size="sm">
                                                                    {t(
                                                                        'base-host-form.server-description-header'
                                                                    )}
                                                                </Text>
                                                                <Text c="dimmed" size="sm">
                                                                    {t(
                                                                        'base-host-form.server-description-line-1'
                                                                    )}{' '}
                                                                    <Link
                                                                        target="_blank"
                                                                        to="https://www.happ.su/main/dev-docs/examples-of-links-and-parameters#serverdescription"
                                                                    >
                                                                        {t(
                                                                            'base-host-form.server-description-line-2'
                                                                        )}
                                                                    </Link>{' '}
                                                                    {t(
                                                                        'base-host-form.server-description-line-3'
                                                                    )}
                                                                    <br />
                                                                    {t(
                                                                        'base-host-form.server-description-line-4'
                                                                    )}
                                                                </Text>
                                                            </Stack>
                                                        </HoverCard.Dropdown>
                                                    </HoverCard>
                                                </Group>
                                            }
                                            leftSection={<HappLogo size={20} />}
                                            placeholder={t(
                                                'base-host-form.server-description-placeholder'
                                            )}
                                            {...form.getInputProps('serverDescription')}
                                        />
                                    </Stack>
                                </Fieldset>
                            </Stack>
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>

            <ModalFooter>
                <Group gap="xs" justify="space-between" w="100%">
                    <ActionIcon.Group>
                        <DeleteHostFeature />
                        {handleCloneHost && (
                            <Tooltip label={t('base-host-form.clone')}>
                                <ActionIcon
                                    color="blue"
                                    loading={isSubmitting}
                                    onClick={handleCloneHost}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    <PiCopyDuotone size="20px" />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </ActionIcon.Group>

                    <Group gap="xs">
                        <Button
                            color="teal"
                            disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                            leftSection={<PiFloppyDiskDuotone size="16px" />}
                            loading={isSubmitting}
                            size="sm"
                            type="submit"
                            variant="outline"
                        >
                            {t('base-host-form.save')}
                        </Button>
                    </Group>
                </Group>
            </ModalFooter>

            <Drawer
                onClose={close}
                opened={opened}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="right"
                size="lg"
                title={t('base-host-form.xhttp-extra-params')}
            >
                <Stack gap="md">
                    <Text size="sm">{t('base-host-form.extra-xhttp-description')}</Text>
                    <JsonInput
                        autosize
                        formatOnBlur
                        key={form.key('xHttpExtraParams')}
                        minRows={15}
                        placeholder={basicXHttpExtraParams}
                        validationError={t('base-host-form.invalid-json')}
                        {...form.getInputProps('xHttpExtraParams')}
                    />

                    <Button
                        color="gray"
                        leftSection={<PiArrowUpDuotone size={px('1.2rem')} />}
                        onClick={() => {
                            // @ts-expect-error -- TODO: fix this
                            form.setFieldValue('xHttpExtraParams', pasteBasicXHttpExtraParams)
                        }}
                        variant="light"
                    >
                        {t('base-host-form.fill-with-sample-xhttp-extra-params')}
                    </Button>

                    <Button onClick={close}>{t('base-host-form.close')}</Button>
                </Stack>
            </Drawer>

            <Drawer
                onClose={closeMuxParams}
                opened={muxParamsOpened}
                padding="lg"
                position="right"
                size="lg"
                title="MUX"
            >
                <Stack gap="md">
                    <Stack gap={0}>
                        <Text size="sm">
                            {t('base-host-form.this-will-only-be-used-for-xray-json-output')}
                        </Text>
                        <Text size="sm">
                            {t('base-host-form.please-ensure-you-provide-a-valid-json-mux-object')}
                        </Text>
                        <Text size="sm">
                            {t('base-host-form.for-more-information-refer-to')}{' '}
                            <Link
                                target="_blank"
                                to="https://xtls.github.io/ru/config/outbound.html#muxobject"
                            >
                                {t('base-host-form.xtls-documentation')}
                            </Link>
                            .
                        </Text>
                    </Stack>
                    <JsonInput
                        autosize
                        formatOnBlur
                        key={form.key('muxParams')}
                        minRows={15}
                        placeholder={basicMuxParams}
                        validationError={t('base-host-form.invalid-json')}
                        {...form.getInputProps('muxParams')}
                    />

                    <Button
                        color="gray"
                        leftSection={<PiArrowUpDuotone size={px('1.2rem')} />}
                        onClick={() => {
                            // @ts-expect-error -- TODO: fix this
                            form.setFieldValue('muxParams', basicMuxParams)
                        }}
                        variant="light"
                    >
                        {t('base-host-form.paste-default-mux-params')}
                    </Button>

                    <Button onClick={closeMuxParams}>{t('base-host-form.close')}</Button>
                </Stack>
            </Drawer>

            <Drawer
                onClose={closeSockoptParams}
                opened={sockoptParamsOpened}
                padding="lg"
                position="right"
                size="lg"
                title="Sockopt"
            >
                <Stack gap="md">
                    <Stack gap={0}>
                        <Text size="sm">
                            {t('base-host-form.this-will-only-be-used-for-xray-json-output')}
                        </Text>
                        <Text size="sm">
                            {t(
                                'base-host-form.please-ensure-you-provide-a-valid-json-sockopt-object'
                            )}
                        </Text>
                        <Text size="sm">
                            {t('base-host-form.for-more-information-refer-to')}{' '}
                            <Link
                                target="_blank"
                                to="https://xtls.github.io/ru/config/transport.html#sockoptobject"
                            >
                                {t('base-host-form.xtls-documentation')}
                            </Link>
                            .
                        </Text>
                    </Stack>

                    <JsonInput
                        autosize
                        formatOnBlur
                        key={form.key('sockoptParams')}
                        minRows={15}
                        placeholder={basicSockoptParams}
                        validationError={t('base-host-form.invalid-json')}
                        {...form.getInputProps('sockoptParams')}
                    />

                    <Button
                        color="gray"
                        leftSection={<PiArrowUpDuotone size={px('1.2rem')} />}
                        onClick={() => {
                            // @ts-expect-error -- TODO: fix this
                            form.setFieldValue('sockoptParams', basicSockoptParams)
                        }}
                        variant="light"
                    >
                        {t('base-host-form.paste-default-sockopt-params')}
                    </Button>

                    <Button onClick={closeSockoptParams}>{t('base-host-form.close')}</Button>
                </Stack>
            </Drawer>
        </form>
    )
}
