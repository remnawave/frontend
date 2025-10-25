import { CreateNodeCommand, GetPubKeyCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { Fieldset, Group, NumberInput, Select, Stack, TextInput, Title } from '@mantine/core'
import { TbCertificate, TbMapPin, TbUserCheck, TbWorld } from 'react-icons/tb'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { UseFormReturnType } from '@mantine/form'
import { HiOutlineServer } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'

import { COUNTRIES } from './constants'

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>

    pubKey: GetPubKeyCommand.Response['response'] | undefined
}

export const NodeVitalsCard = <T extends CreateNodeCommand.Request | UpdateNodeCommand.Request>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, form, motionWrapper, pubKey } = props

    const MotionWrapper = motionWrapper

    return (
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
                    <CopyableFieldShared
                        label="SSL_CERT"
                        leftSection={<TbCertificate size={16} />}
                        size="sm"
                        value={`${pubKey?.pubKey.trimEnd() ?? 'Error loading...'}`}
                    />

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
    )
}
