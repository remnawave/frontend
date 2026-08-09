import { Button, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { TbKey } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import {
    ACME_PROVIDER,
    ACME_PROVIDER_REGISTRY,
    AcmeCredentialSchema
} from '@shared/api/contracts/acme.contract'
import { QueryKeys, useCreateAcmeCredential, useUpdateAcmeCredential } from '@shared/api/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Credential = z.infer<typeof AcmeCredentialSchema>

interface IProps {
    credential: Credential | null
    onClose: () => void
    opened: boolean
}

const PROVIDER_OPTIONS = ACME_PROVIDER_REGISTRY.map((info) => ({
    label: info.label,
    value: info.provider as string
}))

export const AcmeCredentialModalWidget = (props: IProps) => {
    const { credential, onClose, opened } = props

    const isEdit = credential !== null

    const createCredential = useCreateAcmeCredential({})
    const updateCredential = useUpdateAcmeCredential({})

    const form = useForm({
        initialValues: {
            config: {} as Record<string, string>,
            name: '',
            provider: ACME_PROVIDER.CLOUDFLARE as string
        },
        validate: {
            config: (value, values) => {
                const info = ACME_PROVIDER_REGISTRY.find(
                    (entry) => entry.provider === values.provider
                )

                for (const field of info?.fields ?? []) {
                    // On edit an empty secret means "keep what is stored".
                    if (field.required && !value[field.key] && !(isEdit && field.secret)) {
                        return `${field.label} is required`
                    }
                }

                return null
            },
            name: (value) => (value.trim().length < 2 ? 'Name is too short' : null)
        }
    })

    useEffect(() => {
        if (!opened) {
            return
        }

        form.setValues({
            config: { ...credential?.config },
            name: credential?.name ?? '',
            provider: credential?.provider ?? ACME_PROVIDER.CLOUDFLARE
        })
        form.resetDirty()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, credential?.uuid])

    const invalidate = async () => {
        await queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCredentials.queryKey })
    }

    const handleSubmit = form.onSubmit(async (values) => {
        // Empty values are dropped: for secrets on edit that means "keep stored".
        const config = Object.fromEntries(
            Object.entries(values.config).filter(([, value]) => value !== '')
        )

        if (isEdit) {
            await updateCredential.mutateAsync({
                variables: { config, name: values.name, uuid: credential.uuid }
            })
        } else {
            await createCredential.mutateAsync({
                variables: { config, name: values.name, provider: values.provider as never }
            })
        }

        await invalidate()
        onClose()
    })

    const providerInfo = ACME_PROVIDER_REGISTRY.find(
        (entry) => entry.provider === form.values.provider
    )

    return (
        <Modal
            centered
            onClose={onClose}
            opened={opened}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbKey}
                    iconVariant="soft"
                    title={isEdit ? 'Edit credential' : 'New credential'}
                    titleOrder={5}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Name"
                        placeholder="my-dns-credential"
                        required
                        {...form.getInputProps('name')}
                    />

                    <Select
                        data={PROVIDER_OPTIONS}
                        description={
                            isEdit
                                ? 'The provider cannot be changed: the stored secret belongs to it. Create another credential instead.'
                                : undefined
                        }
                        disabled={isEdit}
                        label="Provider"
                        searchable
                        {...form.getInputProps('provider')}
                    />

                    {providerInfo?.description && (
                        <Text c="dimmed" size="xs">
                            {providerInfo.description}
                        </Text>
                    )}

                    {providerInfo?.fields.map((field) => (
                        <TextInput
                            description={
                                isEdit && field.secret
                                    ? 'Leave empty to keep the stored value'
                                    : field.description
                            }
                            key={`${providerInfo.provider}-${field.key}`}
                            label={field.label}
                            placeholder={
                                isEdit && field.secret ? '••••••••' : (field.placeholder ?? '')
                            }
                            required={field.required && !(isEdit && field.secret)}
                            {...form.getInputProps(`config.${field.key}`)}
                        />
                    ))}

                    {form.errors.config && (
                        <Text c="red" size="xs">
                            {form.errors.config}
                        </Text>
                    )}
                </Stack>

                <ModalFooter>
                    <Button onClick={onClose} variant="subtle">
                        Cancel
                    </Button>
                    <Button
                        loading={createCredential.isPending || updateCredential.isPending}
                        type="submit"
                        variant="soft"
                    >
                        {isEdit ? 'Save' : 'Create'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}
