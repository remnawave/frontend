import {
    ActionIcon,
    Button,
    Collapse,
    Group,
    NumberInput,
    Select,
    Stack,
    Switch,
    TextInput,
    Tooltip
} from '@mantine/core'
import {
    ALPN,
    CreateHostCommand,
    FINGERPRINTS,
    SECURITY_LAYERS,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { PiCaretDown, PiCaretUp, PiFloppyDiskDuotone, PiInfo } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { DeleteHostFeature } from '@features/ui/dashboard/hosts/delete-host'
import { RemarkInfoPopoverWidget } from '@widgets/dashboard/hosts/popovers'

import { IProps } from './interfaces'

export const BaseHostForm = <T extends CreateHostCommand.Request | UpdateHostCommand.Request>(
    props: IProps<T>
) => {
    const { form, advancedOpened, handleSubmit, host, inbounds, setAdvancedOpened, isSubmitting } =
        props

    const { t } = useTranslation()

    const securityLayerLabels = {
        [SECURITY_LAYERS.TLS]: t('base-host-form.tls-transport-layer-security'),
        [SECURITY_LAYERS.NONE]: t('base-host-form.none'),
        [SECURITY_LAYERS.DEFAULT]: t('base-host-form.inbounds-default')
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    key={form.key('remark')}
                    label={t('base-host-form.remark')}
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
                            label={t('base-host-form.address')}
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
                            max={65535}
                            min={1}
                            placeholder={t('base-host-form.e-g-443')}
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
                            label={t('base-host-form.inbound')}
                            {...form.getInputProps('inboundUuid')}
                            allowDeselect={false}
                            defaultValue={host?.inboundUuid ?? undefined}
                            placeholder={t('base-host-form.select-inbound')}
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
                        {t('base-host-form.advanced-options')}
                    </Button>

                    <Collapse in={advancedOpened}>
                        <Stack gap="md">
                            <TextInput
                                key={form.key('sni')}
                                label="SNI"
                                placeholder={t('base-host-form.sni-e-g-example-com')}
                                {...form.getInputProps('sni')}
                            />

                            <TextInput
                                key={form.key('host')}
                                label={t('base-host-form.host')}
                                placeholder={t('base-host-form.host-e-g-example-com')}
                                {...form.getInputProps('host')}
                            />

                            <TextInput
                                key={form.key('path')}
                                label={t('base-host-form.path')}
                                placeholder={t('base-host-form.path-e-g-ws')}
                                {...form.getInputProps('path')}
                            />

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
                                            <PiInfo size="1.25rem" />
                                        </span>
                                    </Tooltip>
                                }
                                {...form.getInputProps('securityLayer')}
                            />

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
                    {t('base-host-form.save')}
                </Button>
            </Group>
        </form>
    )
}
