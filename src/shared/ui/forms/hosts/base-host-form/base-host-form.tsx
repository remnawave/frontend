import {
    ActionIcon,
    Button,
    Collapse,
    Drawer,
    Group,
    HoverCard,
    JsonInput,
    NumberInput,
    px,
    Select,
    Stack,
    Switch,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import {
    PiArrowUpDuotone,
    PiCaretDown,
    PiCaretUp,
    PiCopyDuotone,
    PiFloppyDiskDuotone,
    PiInfo,
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
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { HappLogo } from '@pages/dashboard/utils/happ-routing-builder/ui/components/happ-routing-builder.page.component'
import { HostSelectInboundFeature } from '@features/ui/dashboard/hosts/host-select-inbound/host-select-inbound.feature'
import { PopoverWithInfoShared } from '@shared/ui/popovers/popover-with-info'
import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'

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

export const BaseHostForm = <T extends CreateHostCommand.Request | UpdateHostCommand.Request>(
    props: IProps<T>
) => {
    const {
        form,
        advancedOpened,
        handleSubmit,
        configProfiles,
        setAdvancedOpened,
        isSubmitting,
        handleCloneHost
    } = props

    const { t } = useTranslation()
    const [opened, { open, close }] = useDisclosure(false)

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

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <Group gap="xs" justify="space-between">
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
                            form.getValues().inbound?.configProfileInboundUuid ?? undefined
                        }
                        activeConfigProfileUuid={
                            form.getValues().inbound?.configProfileUuid ?? undefined
                        }
                        configProfiles={configProfiles}
                        onSaveInbound={saveInbound}
                    />

                    <Text c="dimmed" size="xs">
                        {t('base-host-form.select-one-inbound-to-apply-to-the-host')}
                    </Text>
                </Stack>

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
                            label={t('base-host-form.address')}
                            leftSection={
                                <PopoverWithInfoShared
                                    text={
                                        <>
                                            {t('base-host-form.address-description-line-1')}
                                            <br />
                                            {t('base-host-form.address-description-line-2')}
                                        </>
                                    }
                                />
                            }
                            {...form.getInputProps('address')}
                            placeholder={t('base-host-form.e-g-example-com')}
                            required
                            w="75%"
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
                                            {t('base-host-form.port-description-line-1')}
                                            <br />
                                            <br />
                                            {t('base-host-form.port-description-line-2')}
                                        </>
                                    }
                                />
                            }
                            max={65535}
                            min={1}
                            placeholder={t('base-host-form.e-g-443')}
                            required
                            w="20%"
                        />
                    </Group>

                    <Button
                        onClick={() => setAdvancedOpened(!advancedOpened)}
                        rightSection={
                            advancedOpened ? <PiCaretUp size="16px" /> : <PiCaretDown size="16px" />
                        }
                        variant="subtle"
                    >
                        {t('base-host-form.advanced-options')}
                    </Button>

                    <Collapse in={advancedOpened}>
                        <Stack gap="md">
                            <TextInput
                                key={form.key('sni')}
                                label="SNI"
                                leftSection={
                                    <PopoverWithInfoShared
                                        text={
                                            <>
                                                {t('base-host-form.sni-description-line-1')}
                                                <br />
                                                <br />
                                                {t('base-host-form.sni-description-line-2')}
                                            </>
                                        }
                                    />
                                }
                                placeholder={t('base-host-form.sni-e-g-example-com')}
                                {...form.getInputProps('sni')}
                            />

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
                                    placeholder={t('base-host-form.host-e-g-example-com')}
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
                                data={Object.values(SECURITY_LAYERS).map((securityLayer) => ({
                                    label: securityLayerLabels[securityLayer] || securityLayer,
                                    value: securityLayer
                                }))}
                                key={form.key('securityLayer')}
                                label={t('base-host-form.security-layer')}
                                leftSection={
                                    <Tooltip
                                        events={{ hover: true, focus: true, touch: false }}
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

                            <TextInput
                                description={t('base-host-form.server-description-description')}
                                key={form.key('serverDescription')}
                                label={
                                    <Group gap={4} justify="flex-start">
                                        <Text fw={600} size="sm">
                                            {t('base-host-form.server-description-header')}
                                        </Text>
                                        <HoverCard shadow="md" width={280} withArrow>
                                            <HoverCard.Target>
                                                <ActionIcon color="gray" size="xs" variant="subtle">
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
                                placeholder={t('base-host-form.server-description-placeholder')}
                                {...form.getInputProps('serverDescription')}
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
                                    data={Object.values(FINGERPRINTS).map((fingerprint) => ({
                                        label: fingerprint,
                                        value: fingerprint
                                    }))}
                                    key={form.key('fingerprint')}
                                    label={t('base-host-form.fingerprint')}
                                    placeholder={t('base-host-form.fingerprint-e-g-chrome')}
                                    {...form.getInputProps('fingerprint')}
                                    w="55%"
                                />

                                <Button
                                    color="pink"
                                    disabled={isXhttpExtraButtonDisabled()}
                                    leftSection={<PiPencilDuotone />}
                                    mt={'xs'}
                                    onClick={open}
                                    variant="light"
                                >
                                    {t('base-host-form.extra-xhttp')}
                                </Button>
                            </Group>
                        </Stack>
                    </Collapse>
                </Stack>
            </Stack>

            <Group gap="xs" justify="space-between" pt={15} w="100%">
                <ActionIcon.Group>
                    <DeleteHostFeature />
                </ActionIcon.Group>

                <Group gap="xs">
                    {handleCloneHost && (
                        <Button
                            color="blue"
                            leftSection={<PiCopyDuotone size="16px" />}
                            loading={isSubmitting}
                            onClick={handleCloneHost}
                            size="md"
                            variant="light"
                        >
                            {t('base-host-form.clone')}
                        </Button>
                    )}

                    <Button
                        color="blue"
                        disabled={!form.isValid() || !form.isDirty() || !form.isTouched()}
                        leftSection={<PiFloppyDiskDuotone size="16px" />}
                        loading={isSubmitting}
                        size="md"
                        type="submit"
                        variant="outline"
                    >
                        {t('base-host-form.save')}
                    </Button>
                </Group>
            </Group>

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
        </form>
    )
}
