import {
    Alert,
    Button,
    FileButton,
    Group,
    Modal,
    MultiSelect,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useEffect, useState } from 'react'
import { TbFileUpload, TbInfoCircle } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import { AcmeCertificateSchema } from '@shared/api/contracts/acme.contract'
import { QueryKeys, useImportAcmeCertificate, useReimportAcmeCertificate } from '@shared/api/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Certificate = z.infer<typeof AcmeCertificateSchema>

interface IProps {
    /** Set when replacing the material of an existing imported certificate. */
    certificate: Certificate | null
    nodes: GetNodesCommand.Response['response']
    onClose: () => void
    opened: boolean
}

export const AcmeImportCertificateModalWidget = (props: IProps) => {
    const { certificate, nodes, onClose, opened } = props

    const isReplace = certificate !== null

    const importCertificate = useImportAcmeCertificate({})
    const reimportCertificate = useReimportAcmeCertificate({})

    const [fileError, setFileError] = useState<null | string>(null)

    const form = useForm({
        initialValues: {
            fullchainPem: '',
            isEnabled: true,
            name: '',
            nodeUuids: [] as string[],
            privateKeyPem: ''
        },
        validate: {
            fullchainPem: (value) =>
                value.includes('-----BEGIN CERTIFICATE-----') ? null : 'Expected a PEM certificate',
            name: (value) => (isReplace || value.trim().length >= 2 ? null : 'Name is too short'),
            privateKeyPem: (value) =>
                value.includes('-----BEGIN') ? null : 'Expected a PEM private key'
        }
    })

    useEffect(() => {
        if (!opened) {
            return
        }

        setFileError(null)
        form.setValues({
            fullchainPem: '',
            isEnabled: certificate?.isEnabled ?? true,
            name: certificate?.name ?? '',
            nodeUuids: certificate?.nodes.map((binding) => binding.nodeUuid) ?? [],
            privateKeyPem: ''
        })
        form.resetDirty()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, certificate?.uuid])

    /** Files are read here and land in the same field as pasted text. */
    const readFileInto = (field: 'fullchainPem' | 'privateKeyPem') => async (file: File | null) => {
        if (!file) {
            return
        }

        try {
            form.setFieldValue(field, await file.text())
            setFileError(null)
        } catch (error) {
            setFileError(error instanceof Error ? error.message : 'Could not read the file')
        }
    }

    const handleSubmit = form.onSubmit(async (values) => {
        if (isReplace) {
            await reimportCertificate.mutateAsync({
                route: { uuid: certificate.uuid },
                variables: {
                    fullchainPem: values.fullchainPem,
                    privateKeyPem: values.privateKeyPem
                }
            })
        } else {
            await importCertificate.mutateAsync({
                variables: {
                    fullchainPem: values.fullchainPem,
                    isEnabled: values.isEnabled,
                    name: values.name,
                    nodes: values.nodeUuids.map((nodeUuid) => ({
                        inboundTags: [],
                        nodeUuid
                    })),
                    privateKeyPem: values.privateKeyPem
                }
            })
        }

        await queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCertificates.queryKey })

        onClose()
    })

    return (
        <Modal
            centered
            onClose={onClose}
            opened={opened}
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="grape"
                    IconComponent={TbFileUpload}
                    iconVariant="soft"
                    title={
                        isReplace ? `Replace material of ${certificate.name}` : 'Import certificate'
                    }
                    titleOrder={5}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <Alert color="gray" icon={<TbInfoCircle size={18} />} variant="light">
                        Domains, validity and key type are read from the certificate itself. The
                        panel never renews an imported certificate — when it is reissued elsewhere,
                        upload the new material here.
                    </Alert>

                    {!isReplace && (
                        <TextInput
                            label="Name"
                            placeholder="edge-wildcard"
                            required
                            {...form.getInputProps('name')}
                        />
                    )}

                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text fw={500} size="sm">
                                Certificate (fullchain)
                            </Text>

                            <FileButton
                                accept=".pem,.crt,.cer,.txt,application/x-pem-file"
                                onChange={readFileInto('fullchainPem')}
                            >
                                {(fileProps) => (
                                    <Button
                                        leftSection={<TbFileUpload size={16} />}
                                        size="xs"
                                        variant="default"
                                        {...fileProps}
                                    >
                                        From file
                                    </Button>
                                )}
                            </FileButton>
                        </Group>

                        <Textarea
                            autosize
                            description="Leaf certificate first, then the chain"
                            maxRows={10}
                            minRows={4}
                            placeholder="-----BEGIN CERTIFICATE-----"
                            {...form.getInputProps('fullchainPem')}
                        />
                    </Stack>

                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text fw={500} size="sm">
                                Private key
                            </Text>

                            <FileButton
                                accept=".pem,.key,.txt,application/x-pem-file"
                                onChange={readFileInto('privateKeyPem')}
                            >
                                {(fileProps) => (
                                    <Button
                                        leftSection={<TbFileUpload size={16} />}
                                        size="xs"
                                        variant="default"
                                        {...fileProps}
                                    >
                                        From file
                                    </Button>
                                )}
                            </FileButton>
                        </Group>

                        <Textarea
                            autosize
                            description="Must not be password-protected; it is checked against the certificate"
                            maxRows={10}
                            minRows={4}
                            placeholder="-----BEGIN PRIVATE KEY-----"
                            {...form.getInputProps('privateKeyPem')}
                        />
                    </Stack>

                    {fileError && (
                        <Text c="red" size="sm">
                            {fileError}
                        </Text>
                    )}

                    {!isReplace && (
                        <>
                            <MultiSelect
                                data={nodes.map((node) => ({ label: node.name, value: node.uuid }))}
                                label="Nodes"
                                placeholder="Pick the nodes that serve these names"
                                searchable
                                {...form.getInputProps('nodeUuids')}
                            />

                            <Switch
                                label="Enabled"
                                {...form.getInputProps('isEnabled', { type: 'checkbox' })}
                            />
                        </>
                    )}
                </Stack>

                <ModalFooter>
                    <Button onClick={onClose} variant="subtle">
                        Cancel
                    </Button>
                    <Button
                        loading={importCertificate.isPending || reimportCertificate.isPending}
                        type="submit"
                        variant="soft"
                    >
                        {isReplace ? 'Replace' : 'Import'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}
