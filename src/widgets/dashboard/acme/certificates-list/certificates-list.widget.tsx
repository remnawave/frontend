import { Button, Center, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import { TbCertificate, TbFileUpload, TbPlus } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import { AcmeCertificateSchema, AcmeCredentialSchema } from '@shared/api/contracts/acme.contract'
import { QueryKeys, useDeleteAcmeCertificate, useIssueAcmeCertificate } from '@shared/api/hooks'

import { AcmeCertificateCardWidget } from '../certificate-card/certificate-card.widget'
import { AcmeCertificateDetailsDrawerWidget } from '../certificate-details-drawer/certificate-details-drawer.widget'
import { AcmeCertificateModalWidget } from '../certificate-modal/certificate-modal.widget'
import { AcmeImportCertificateModalWidget } from '../import-certificate-modal/import-certificate-modal.widget'

type Certificate = z.infer<typeof AcmeCertificateSchema>
type Credential = z.infer<typeof AcmeCredentialSchema>

interface IProps {
    certificates: Certificate[]
    credentials: Credential[]
    nodes: GetNodesCommand.Response['response']
}

export const AcmeCertificatesListWidget = (props: IProps) => {
    const { certificates, credentials, nodes } = props

    const [editing, setEditing] = useState<Certificate | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [details, setDetails] = useState<Certificate | null>(null)
    const [replacing, setReplacing] = useState<Certificate | null>(null)
    const [isImportOpen, setIsImportOpen] = useState(false)

    const issueCertificate = useIssueAcmeCertificate({})
    const deleteCertificate = useDeleteAcmeCertificate({})

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCertificates.queryKey })

    const handleIssue = async (certificate: Certificate) => {
        await issueCertificate.mutateAsync({ route: { uuid: certificate.uuid } })
        await invalidate()

        notifications.show({
            color: 'teal',
            message: 'Issuance queued',
            title: certificate.name
        })
    }

    const handleDelete = (certificate: Certificate) => {
        modals.openConfirmModal({
            cancelProps: { variant: 'subtle' },
            centered: true,
            children: (
                <Text size="sm">
                    Delete <b>{certificate.name}</b>? Nodes keep serving the certificate they
                    already have until they are restarted.
                </Text>
            ),
            confirmProps: { color: 'red', variant: 'soft' },
            labels: { cancel: 'Cancel', confirm: 'Delete' },
            onConfirm: async () => {
                await deleteCertificate.mutateAsync({ route: { uuid: certificate.uuid } })
                await invalidate()
            },
            title: 'Delete certificate'
        })
    }

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<TbFileUpload size={16} />}
                    onClick={() => {
                        setReplacing(null)
                        setIsImportOpen(true)
                    }}
                    variant="default"
                >
                    Import
                </Button>

                <Button
                    disabled={credentials.length === 0}
                    leftSection={<TbPlus size={16} />}
                    onClick={() => {
                        setEditing(null)
                        setIsModalOpen(true)
                    }}
                >
                    Add certificate
                </Button>
            </Group>

            {certificates.length === 0 && (
                <Center py="xl">
                    <Stack align="center" gap="lg">
                        <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                            <TbCertificate size={32} />
                        </ThemeIcon>

                        <Stack align="center" gap="xs">
                            <Text fw={600} size="lg" ta="center">
                                No certificates yet
                            </Text>
                            <Text c="dimmed" maw={400} size="sm" ta="center">
                                {credentials.length === 0
                                    ? 'Add a credential first — a certificate needs one to answer DNS challenges.'
                                    : 'Create a certificate, or import one issued elsewhere.'}
                            </Text>
                        </Stack>
                    </Stack>
                </Center>
            )}

            {certificates.length > 0 && (
                <Stack gap={0}>
                    {certificates.map((certificate) => (
                        <AcmeCertificateCardWidget
                            certificate={certificate}
                            key={certificate.uuid}
                            onDelete={handleDelete}
                            onDetails={setDetails}
                            onEdit={(cert) => {
                                setEditing(cert)
                                setIsModalOpen(true)
                            }}
                            onIssue={handleIssue}
                            onReplace={(cert) => {
                                setReplacing(cert)
                                setIsImportOpen(true)
                            }}
                        />
                    ))}
                </Stack>
            )}

            <AcmeCertificateModalWidget
                certificate={editing}
                credentials={credentials}
                nodes={nodes}
                onClose={() => setIsModalOpen(false)}
                opened={isModalOpen}
            />

            <AcmeImportCertificateModalWidget
                certificate={replacing}
                nodes={nodes}
                onClose={() => setIsImportOpen(false)}
                opened={isImportOpen}
            />

            <AcmeCertificateDetailsDrawerWidget
                certificate={details}
                onClose={() => setDetails(null)}
            />
        </Stack>
    )
}
