import {
    Anchor,
    Button,
    Code,
    Divider,
    Group,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { TbCertificate, TbId, TbMapPin, TbWorld } from 'react-icons/tb'
import { CreateNodeCommand } from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { PiArrowRight } from 'react-icons/pi'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { COUNTRIES } from '@shared/ui/forms/nodes/base-node-form/constants'

import { CopyDockerComposeWidget } from './copy-docker-compose.widget'

interface IProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturnType<CreateNodeCommand.Request, any>
    onNext: () => void
    port: number
    pubKey: string | undefined
}

export const CreateNodeStep1Connection = ({ form, onNext, pubKey, port }: IProps) => {
    const { t } = useTranslation()

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
                        href="https://remna.st/docs/install/remnawave-node"
                        inherit
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
                        value={`${pubKey?.trimEnd()}`}
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
                            label="Node Port (NODE_PORT)"
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
                            {t('create-node-modal.widget.next')}
                        </Button>
                    </Group>
                </Stack>
            </Stack>
        </form>
    )
}
