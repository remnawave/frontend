import {
    CreateNodeCommand,
    GetNodePluginsCommand,
    GetPubKeyCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import {
    TbCertificate,
    TbCpu,
    TbMapPin,
    TbPackage,
    TbUserCheck,
    TbWorld
} from 'react-icons/tb'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { Group, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { HiOutlineServer } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { NODE_CORE, NODE_CORE_LABELS } from '@shared/constants/veil'
import { SectionCard } from '@shared/ui/section-card'

import { COUNTRIES } from './constants'

const NODE_CORE_OPTIONS = [
    { value: NODE_CORE.XRAY, label: NODE_CORE_LABELS.XRAY },
    { value: NODE_CORE.VEIL, label: NODE_CORE_LABELS.VEIL }
]

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    nodePlugins: GetNodePluginsCommand.Response['response']['nodePlugins']
    pubKey: GetPubKeyCommand.Response['response'] | undefined
}

export const NodeVitalsCard = <T extends CreateNodeCommand.Request | UpdateNodeCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, form, motionWrapper, nodePlugins, pubKey } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="blue"
                        IconComponent={HiOutlineServer}
                        iconVariant="soft"
                        title={t('base-node-form.node-vitals')}
                        titleOrder={5}
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

                        <Select
                            allowDeselect={false}
                            data={NODE_CORE_OPTIONS}
                            description="Veil ships an opaque server.yaml from the panel; pre-alpha"
                            key={form.key('core' as never)}
                            label="Proxy core"
                            leftSection={<TbCpu size={16} />}
                            required
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                            {...form.getInputProps('core' as never)}
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
                            value={`${pubKey?.pubKey.trimEnd() ?? 'Error loading...'}`}
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
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
