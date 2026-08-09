import {
    Alert,
    Badge,
    Button,
    Divider,
    Group,
    Modal,
    MultiSelect,
    NumberInput,
    Select,
    Stack,
    Switch,
    TagsInput,
    Text,
    TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useEffect } from 'react'
import { TbAlertTriangle, TbCertificate, TbInfoCircle } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import {
    ACME_CERTIFICATE_SOURCE,
    ACME_CHALLENGE_TYPE,
    ACME_DIRECTORY_PRESETS,
    ACME_KEY_TYPES,
    ACME_PROVIDER,
    ACME_PROVIDER_REGISTRY,
    AcmeCertificateSchema,
    AcmeCredentialSchema
} from '@shared/api/contracts/acme.contract'
import { QueryKeys, useCreateAcmeCertificate, useUpdateAcmeCertificate } from '@shared/api/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Certificate = z.infer<typeof AcmeCertificateSchema>
type Credential = z.infer<typeof AcmeCredentialSchema>

const PROVIDER_LABELS: Record<string, string> = Object.fromEntries(
    ACME_PROVIDER_REGISTRY.map((info) => [info.provider, info.label])
)

interface IProps {
    certificate: Certificate | null
    credentials: Credential[]
    nodes: GetNodesCommand.Response['response']
    onClose: () => void
    opened: boolean
}

export const AcmeCertificateModalWidget = (props: IProps) => {
    const { certificate, credentials, nodes, onClose, opened } = props

    const isEdit = certificate !== null

    // For an imported certificate everything about the material is read from the
    // PEM, so only the name, the bindings and the enabled flag are editable —
    // the backend rejects the rest anyway.
    const isImported = certificate?.source === ACME_CERTIFICATE_SOURCE.IMPORTED

    const createCertificate = useCreateAcmeCertificate({})
    const updateCertificate = useUpdateAcmeCertificate({})

    const form = useForm({
        initialValues: {
            challengeType: ACME_CHALLENGE_TYPE.DNS_01 as string,
            credentialUuid: '',
            directoryUrl: ACME_DIRECTORY_PRESETS[0].url as string,
            domains: [] as string[],
            eabHmacKey: '',
            eabKid: '',
            email: '',
            isEnabled: true,
            keyType: 'ECDSA_P256' as string,
            name: '',
            nodeUuids: [] as string[],
            renewBeforeDays: 30
        },
        validate: {
            credentialUuid: (value) => (isImported || value ? null : 'Pick a credential'),
            domains: (value) =>
                !isImported && value.length === 0 ? 'At least one domain is required' : null,
            email: (value) =>
                isImported || /^[^@\s]+@[^@\s]+$/.test(value) ? null : 'Enter a valid e-mail',
            name: (value) => (value.trim().length < 2 ? 'Name is too short' : null)
        }
    })

    useEffect(() => {
        if (!opened) {
            return
        }

        form.setValues({
            challengeType: certificate?.challengeType ?? ACME_CHALLENGE_TYPE.DNS_01,
            credentialUuid: certificate?.credentialUuid ?? credentials[0]?.uuid ?? '',
            directoryUrl: certificate?.directoryUrl ?? ACME_DIRECTORY_PRESETS[0].url,
            domains: certificate?.domains ?? [],
            eabHmacKey: '',
            eabKid: certificate?.eabKid ?? '',
            email: certificate?.email ?? '',
            isEnabled: certificate?.isEnabled ?? true,
            keyType: certificate?.keyType ?? 'ECDSA_P256',
            name: certificate?.name ?? '',
            nodeUuids: certificate?.nodes.map((binding) => binding.nodeUuid) ?? [],
            renewBeforeDays: certificate?.renewBeforeDays ?? 30
        })
        form.resetDirty()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, certificate?.uuid])

    const handleSubmit = form.onSubmit(async (values) => {
        // Existing tag selections are preserved; the modal binds whole nodes,
        // which is the common case (every TLS inbound of the node).
        const nodeBindings = values.nodeUuids.map((nodeUuid) => ({
            inboundTags:
                certificate?.nodes.find((binding) => binding.nodeUuid === nodeUuid)?.inboundTags ??
                [],
            nodeUuid
        }))

        if (isImported && certificate) {
            await updateCertificate.mutateAsync({
                variables: {
                    isEnabled: values.isEnabled,
                    name: values.name,
                    nodes: nodeBindings,
                    uuid: certificate.uuid
                }
            })
        } else {
            const body = {
                challengeType: values.challengeType as never,
                credentialUuid: values.credentialUuid,
                directoryUrl: values.directoryUrl,
                domains: values.domains,
                ...(values.eabKid ? { eabKid: values.eabKid } : {}),
                ...(values.eabHmacKey ? { eabHmacKey: values.eabHmacKey } : {}),
                email: values.email,
                isEnabled: values.isEnabled,
                keyType: values.keyType as never,
                name: values.name,
                nodes: nodeBindings,
                renewBeforeDays: values.renewBeforeDays
            }

            if (isEdit) {
                await updateCertificate.mutateAsync({
                    variables: { ...body, uuid: certificate.uuid }
                })
            } else {
                await createCertificate.mutateAsync({ variables: body })
            }
        }

        await queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCertificates.queryKey })
        await queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCredentials.queryKey })

        onClose()
    })

    const selectedCredential = credentials.find(
        (credential) => credential.uuid === form.values.credentialUuid
    )

    const isManual = selectedCredential?.provider === ACME_PROVIDER.MANUAL
    const isDnsPersist = form.values.challengeType === ACME_CHALLENGE_TYPE.DNS_PERSIST_01
    const isProductionDirectory = !ACME_DIRECTORY_PRESETS.find(
        (preset) => preset.url === form.values.directoryUrl
    )?.isStaging

    return (
        <Modal
            centered
            onClose={onClose}
            opened={opened}
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCertificate}
                    iconVariant="soft"
                    title={isEdit ? 'Edit certificate' : 'New certificate'}
                    titleOrder={5}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Name"
                        placeholder="edge-wildcard"
                        required
                        {...form.getInputProps('name')}
                    />

                    {isImported && (
                        <Alert color="grape" icon={<TbInfoCircle size={18} />} variant="light">
                            Imported certificate. Its domains, validity and key come from the
                            uploaded material — to change them, upload a new certificate. Here you
                            can rename it and change where it is delivered.
                        </Alert>
                    )}

                    {isImported && (
                        <Group gap="4">
                            {certificate.domains.map((domain) => (
                                <Badge key={domain} size="sm" variant="default">
                                    {domain}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    {!isImported && (
                        <>
                            <TagsInput
                                description='Wildcards are written as "*.example.com"'
                                label="Domains"
                                placeholder="example.com"
                                required
                                {...form.getInputProps('domains')}
                            />

                            <Select
                                data={credentials.map((credential) => ({
                                    label: `${credential.name} (${PROVIDER_LABELS[credential.provider] ?? credential.provider})`,
                                    value: credential.uuid
                                }))}
                                label="Credential"
                                required
                                {...form.getInputProps('credentialUuid')}
                            />

                            <Select
                                data={[
                                    { label: 'dns-01', value: ACME_CHALLENGE_TYPE.DNS_01 },
                                    {
                                        label: 'dns-persist-01',
                                        value: ACME_CHALLENGE_TYPE.DNS_PERSIST_01
                                    }
                                ]}
                                label="Challenge"
                                {...form.getInputProps('challengeType')}
                            />
                        </>
                    )}

                    {!isImported && isManual && !isDnsPersist && (
                        <Alert color="red" icon={<TbAlertTriangle size={18} />} variant="light">
                            A manual credential cannot answer dns-01: that challenge needs a fresh
                            record within minutes of every order. Use dns-persist-01, or a
                            credential that can publish records.
                        </Alert>
                    )}

                    {!isImported && isDnsPersist && isProductionDirectory && (
                        <Alert color="yellow" icon={<TbAlertTriangle size={18} />} variant="light">
                            dns-persist-01 is not enabled on production CAs yet. Rehearse it on a
                            staging directory; a production order will be refused by the CA.
                        </Alert>
                    )}

                    {!isImported && (
                        <>
                            <Select
                                data={ACME_DIRECTORY_PRESETS.map((preset) => ({
                                    label: preset.name,
                                    value: preset.url
                                }))}
                                description="Staging first: it does not spend the production rate limit"
                                label="Certificate authority"
                                searchable
                                {...form.getInputProps('directoryUrl')}
                            />

                            <TextInput
                                label="Account e-mail"
                                placeholder="acme@example.com"
                                required
                                {...form.getInputProps('email')}
                            />

                            <Select
                                data={ACME_KEY_TYPES.map((keyType) => ({
                                    label: keyType,
                                    value: keyType
                                }))}
                                label="Key type"
                                {...form.getInputProps('keyType')}
                            />

                            <NumberInput
                                description="How long before expiry renewal starts"
                                label="Renew before, days"
                                max={85}
                                min={1}
                                {...form.getInputProps('renewBeforeDays')}
                            />

                            <Divider
                                label="External account binding (optional)"
                                labelPosition="left"
                            />

                            <TextInput label="EAB key ID" {...form.getInputProps('eabKid')} />
                            <TextInput
                                description={
                                    isEdit ? 'Leave empty to keep the stored key' : undefined
                                }
                                label="EAB HMAC key"
                                {...form.getInputProps('eabHmacKey')}
                            />
                        </>
                    )}

                    <Divider label="Delivery" labelPosition="left" />

                    <MultiSelect
                        data={nodes.map((node) => ({ label: node.name, value: node.uuid }))}
                        label="Nodes"
                        placeholder="Pick the nodes that serve these names"
                        searchable
                        {...form.getInputProps('nodeUuids')}
                    />

                    <Text c="dimmed" size="xs">
                        The certificate is injected into each bound node's own config, never into
                        the shared config profile — nodes that are not bound never receive the
                        private key.
                    </Text>

                    <Switch
                        label="Enabled"
                        {...form.getInputProps('isEnabled', { type: 'checkbox' })}
                    />
                </Stack>

                <ModalFooter>
                    <Button onClick={onClose} variant="subtle">
                        Cancel
                    </Button>
                    <Button
                        loading={createCertificate.isPending || updateCertificate.isPending}
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
