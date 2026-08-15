import {
    CheckIcon,
    ComboboxItem,
    Group,
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import {
    CreateNodeCommand,
    GetNodeIntegrationsCommand,
    GetNodePluginsCommand,
    GetNodeSecretKeyCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { HiOutlineServer } from 'react-icons/hi'
import {
    TbCertificate,
    TbMapPin,
    TbNetwork,
    TbPackage,
    TbPlugConnected,
    TbUserCheck,
    TbWorld
} from 'react-icons/tb'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { COUNTRIES } from './constants'
import integrationsClasses from './integrations-select.module.css'

interface IProps<T extends CreateNodeCommand.RequestBody | UpdateNodeCommand.RequestBody> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    nodeIntegrations: GetNodeIntegrationsCommand.Response['response']['nodeIntegrations']
    nodePlugins: GetNodePluginsCommand.Response['response']['nodePlugins']
    nodeUuid: string
    secretKey: GetNodeSecretKeyCommand.Response['response'] | undefined
}

export const NodeVitalsCard = <
    T extends CreateNodeCommand.RequestBody | UpdateNodeCommand.RequestBody
>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const {
        cardVariants,
        form,
        motionWrapper,
        nodeIntegrations,
        nodePlugins,
        secretKey,
        nodeUuid
    } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="blue"
                        IconComponent={HiOutlineServer}
                        iconVariant="soft"
                        subtitle={nodeUuid}
                        title={t('base-node-form.node-vitals')}
                        titleOrder={5}
                        withCopy
                    />
                </SectionCard.Section>
                <SectionCard.Section>
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
                                label="Node Port"
                                {...form.getInputProps('port')}
                                allowDecimal={false}
                                allowNegative={false}
                                clampBehavior="strict"
                                decimalScale={0}
                                hideControls
                                max={65535}
                                placeholder="2222"
                                required
                                styles={{
                                    label: { fontWeight: 500 },
                                    root: { flex: '1 1 25%' }
                                }}
                            />
                        </Group>

                        <CopyableFieldShared
                            label="Secret Key (SECRET_KEY)"
                            leftSection={<TbCertificate size={16} />}
                            size="sm"
                            value={`${secretKey?.secretKey.trimEnd() ?? 'Error loading...'}`}
                        />

                        <Select
                            key={form.key('activePluginUuid')}
                            label={t('node-vitals.card.plugin')}
                            {...form.getInputProps('activePluginUuid')}
                            allowDeselect
                            clearable
                            data={nodePlugins.map((nodePlugin) => ({
                                label: nodePlugin.name,
                                value: nodePlugin.uuid
                            }))}
                            description={t(
                                'node-vitals.card.review-documentation-for-more-information'
                            )}
                            leftSection={<TbPackage size={16} />}
                            nothingFoundMessage={t('node-vitals.card.nothing-found')}
                            placeholder={t('node-vitals.card.select-plugin')}
                            searchable
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <MultiSelect
                            key={form.key('integrationUuids')}
                            label={t('node-integrations.select.label')}
                            {...form.getInputProps('integrationUuids')}
                            clearable
                            data={nodeIntegrations.map((integration) => ({
                                label: integration.name,
                                value: integration.uuid,
                                description: integration.description
                            }))}
                            leftSection={<TbPlugConnected size={16} />}
                            nothingFoundMessage={t('common.nothing-found')}
                            placeholder={t('node-integrations.select.placeholder')}
                            classNames={{ option: integrationsClasses.option }}
                            scrollAreaProps={{ styles: { content: { minWidth: '100%' } } }}
                            renderOption={({ option, checked }) => {
                                const { description } = option as ComboboxItem & {
                                    description?: null | string
                                }

                                return (
                                    <Group gap="xs" miw={0} w="100%" wrap="nowrap">
                                        <CheckIcon
                                            size={12}
                                            style={{
                                                flexShrink: 0,
                                                opacity: checked ? 1 : 0.25
                                            }}
                                        />
                                        <Stack flex={1} gap={0} miw={0}>
                                            <Text size="sm" truncate="end">
                                                {option.label}
                                            </Text>
                                            {description && (
                                                <Text c="dimmed" size="xs" truncate="end">
                                                    {description}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Group>
                                )
                            }}
                            renderPill={({ option, value, onRemove }) => (
                                <TagInputPill onRemove={onRemove} value={option?.label ?? value} />
                            )}
                            searchable
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <TextInput
                            key={form.key('proxyUrl')}
                            label={t('node-vitals.card.proxy-url')}
                            {...form.getInputProps('proxyUrl')}
                            description={t('node-vitals.card.proxy-url-description')}
                            leftSection={<TbNetwork size={16} />}
                            placeholder="socks5://user:pass@address:port"
                        />
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
