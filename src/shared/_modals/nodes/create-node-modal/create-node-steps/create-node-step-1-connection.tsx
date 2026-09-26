import {
    Anchor,
    Button,
    Code,
    Divider,
    Group,
    NumberInput,
    Popover,
    Select,
    Stack,
    TagsInput,
    Text,
    TextInput,
    UnstyledButton
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { CreateNodeCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiArrowRight, PiTagDuotone } from 'react-icons/pi'
import {
    TbCertificate,
    TbChevronDown,
    TbId,
    TbMapPin,
    TbPackage,
    TbSettings,
    TbWorld
} from 'react-icons/tb'

import { useGetNodePlugins, useGetNodesTags } from '@shared/api/hooks'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { COUNTRIES } from '@shared/ui/forms/nodes/base-node-form/constants'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { CopyDockerComposeWidget } from './copy-docker-compose.widget'

interface IProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturnType<CreateNodeCommand.RequestBody, any>
    onNext: () => void
    port: number
    secretKey: string | undefined
}

export const CreateNodeStep1Connection = ({ form, onNext, secretKey, port }: IProps) => {
    const { t } = useTranslation()

    const { data: nodePlugins } = useGetNodePlugins()
    const { data: nodesTags } = useGetNodesTags()

    const [additionalOpened, setAdditionalOpened] = useState(false)

    const handleNext = async () => {
        const nameErrors = form.validateField('name')
        const countryCodeErrors = form.validateField('countryCode')
        const addressErrors = form.validateField('address')
        const portErrors = form.validateField('port')

        if (
            nameErrors.hasError ||
            countryCodeErrors.hasError ||
            addressErrors.hasError ||
            portErrors.hasError
        ) {
            return
        }

        onNext()
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleNext()
            }}
        >
            <Stack gap="xs" mih={400}>
                <Text c="dimmed" size="sm">
                    {t('create-node-step-1-connection.copy-the')}{' '}
                    <Code c="white" color="gray.8">
                        docker-compose.yml
                    </Code>{' '}
                    {t('create-node-step-1-connection.content-for-the-remnawave-node-below')}{' '}
                    <Anchor
                        fw="700"
                        href="https://docs.rw/docs/install/remnawave-node"
                        inherit
                        rel="noopener noreferrer"
                        target="_blank"
                        underline="hover"
                    >
                        {t('create-node-step-1-connection.learn-more')}
                    </Anchor>
                </Text>

                <Divider />
                <Stack gap="xs">
                    <CopyableFieldShared
                        label="Secret Key (SECRET_KEY)"
                        leftSection={<TbCertificate size={16} />}
                        size="sm"
                        value={secretKey ?? ''}
                    />

                    <TextInput
                        key={form.key('name')}
                        label={t('base-node-form.internal-name')}
                        leftSection={<TbId size={16} />}
                        placeholder={t('base-node-form.internal-name-placeholder')}
                        required
                        size="sm"
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                        {...form.getInputProps('name')}
                    />

                    <Select
                        key={form.key('countryCode')}
                        label={t('base-node-form.country')}
                        {...form.getInputProps('countryCode')}
                        data={COUNTRIES}
                        leftSection={<TbMapPin size={16} />}
                        placeholder={t('base-node-form.select-country')}
                        searchable
                        size="sm"
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                    />

                    <Group align="flex-start" gap="xs" w="100%">
                        <TextInput
                            key={form.key('address')}
                            label={t('create-node-step-1-connection.domain-or-ip')}
                            {...form.getInputProps('address')}
                            leftSection={<TbWorld size={16} />}
                            placeholder="192.168.1.1"
                            required
                            size="sm"
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                            w="70%"
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
                            size="sm"
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                            w="25%"
                        />
                    </Group>

                    <Popover
                        closeOnClickOutside={false}
                        onChange={setAdditionalOpened}
                        opened={additionalOpened}
                        position="bottom"
                        shadow="md"
                        width={340}
                        withArrow
                    >
                        <Divider
                            label={
                                <Popover.Target>
                                    <UnstyledButton
                                        c="dimmed"
                                        onClick={() => setAdditionalOpened((opened) => !opened)}
                                        px={4}
                                        type="button"
                                    >
                                        <Group gap={6}>
                                            <TbSettings size={16} />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'create-node-step-1-connection.additional-options'
                                                )}
                                            </Text>
                                            <TbChevronDown
                                                size={14}
                                                style={{
                                                    transform: additionalOpened
                                                        ? 'rotate(180deg)'
                                                        : undefined,
                                                    transition: 'transform 200ms ease'
                                                }}
                                            />
                                        </Group>
                                    </UnstyledButton>
                                </Popover.Target>
                            }
                            labelPosition="center"
                        />

                        <Popover.Dropdown>
                            <Stack gap="sm">
                                <SelectInfraProviderShared
                                    selectedInfraProviderUuid={form.getValues().providerUuid}
                                    setSelectedInfraProviderUuid={(providerUuid) => {
                                        form.setValues({ providerUuid })
                                        form.setTouched({ providerUuid: true })
                                        form.setDirty({ providerUuid: true })
                                    }}
                                />

                                <Select
                                    key={form.key('activePluginUuid')}
                                    label={t('node-vitals.card.plugin')}
                                    {...form.getInputProps('activePluginUuid')}
                                    allowDeselect
                                    clearable
                                    data={(nodePlugins?.nodePlugins ?? []).map((nodePlugin) => ({
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
                                    size="sm"
                                    styles={{
                                        label: { fontWeight: 500 }
                                    }}
                                />

                                <TagsInput
                                    clearable
                                    data={nodesTags?.tags || []}
                                    key={form.key('tags')}
                                    label={t('common.field.tags')}
                                    leftSection={<PiTagDuotone size="16px" />}
                                    maxTags={10}
                                    placeholder="Enter tags (comma, space, semicolon)"
                                    size="sm"
                                    splitChars={[',', ' ', ';']}
                                    {...form.getInputProps('tags')}
                                    error={
                                        Object.keys(form.errors)
                                            .filter((key) => key.startsWith('tags.'))
                                            .map((key) => form.errors[key])
                                            .join(', ') || form.getInputProps('tags').error
                                    }
                                    renderPill={({ value, onRemove }) => (
                                        <TagInputPill onRemove={onRemove} value={value} />
                                    )}
                                    styles={{
                                        label: { fontWeight: 500 }
                                    }}
                                />
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Stack>

                <Stack gap="xs" mt="auto">
                    <CopyDockerComposeWidget port={port} />

                    <Group justify="flex-end" mt="auto">
                        <Button
                            color="teal"
                            rightSection={<PiArrowRight size={18} />}
                            size="md"
                            type="submit"
                        >
                            {t('common.action.next')}
                        </Button>
                    </Group>
                </Stack>
            </Stack>
        </form>
    )
}
