import { Badge, Button, Center, Group, Menu, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { TbCertificate, TbKey, TbPlugConnected, TbPlus } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import { ACME_PROVIDER_REGISTRY, AcmeCredentialSchema } from '@shared/api/contracts/acme.contract'
import { QueryKeys, useDeleteAcmeCredential, useTestAcmeCredential } from '@shared/api/hooks'
import { EntityCardShared } from '@shared/ui/entity-card'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'

import { AcmeCredentialModalWidget } from '../credential-modal/credential-modal.widget'

type Credential = z.infer<typeof AcmeCredentialSchema>

const PROVIDER_LABELS: Record<string, string> = Object.fromEntries(
    ACME_PROVIDER_REGISTRY.map((info) => [info.provider, info.label])
)

interface IProps {
    credentials: Credential[]
}

export const AcmeCredentialsGridWidget = ({ credentials }: IProps) => {
    const [editing, setEditing] = useState<Credential | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const testCredential = useTestAcmeCredential({})
    const deleteCredential = useDeleteAcmeCredential({})

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: QueryKeys.acme.getCredentials.queryKey })

    const handleTest = async (credential: Credential) => {
        const result = await testCredential.mutateAsync({ route: { uuid: credential.uuid } })

        notifications.show({
            color: result.isOk ? 'teal' : 'red',
            message: result.message,
            title: credential.name
        })
    }

    const handleDelete = (credential: Credential) => {
        modals.openConfirmModal({
            cancelProps: { variant: 'subtle' },
            centered: true,
            children: (
                <Text size="sm">
                    Delete credential <b>{credential.name}</b>? Certificates using it would no
                    longer be able to renew.
                </Text>
            ),
            confirmProps: { color: 'red', variant: 'soft' },
            labels: { cancel: 'Cancel', confirm: 'Delete' },
            onConfirm: async () => {
                await deleteCredential.mutateAsync({ route: { uuid: credential.uuid } })
                await invalidate()
            },
            title: 'Delete credential'
        })
    }

    const renderCard = (credential: Credential) => (
        <EntityCardShared.Root withTopAccent={credential.certificatesCount > 0}>
            <EntityCardShared.Header>
                <EntityCardShared.Icon
                    highlight={credential.certificatesCount > 0}
                    onClick={() => {
                        setEditing(credential)
                        setIsModalOpen(true)
                    }}
                >
                    <TbKey size={28} />
                </EntityCardShared.Icon>

                <EntityCardShared.Content
                    subtitle={credential.config.baseUrl}
                    title={credential.name}
                >
                    <Group gap="xs" wrap="wrap">
                        <Badge size="lg" variant="soft">
                            {PROVIDER_LABELS[credential.provider] ?? credential.provider}
                        </Badge>

                        <Badge
                            color={credential.hasSecret ? 'teal' : 'gray'}
                            size="lg"
                            variant="soft"
                        >
                            {credential.hasSecret ? 'secret stored' : 'no secret'}
                        </Badge>

                        <Tooltip label="Certificates using this credential">
                            <Badge
                                color={credential.certificatesCount > 0 ? 'blue' : 'gray'}
                                leftSection={<TbCertificate size={12} />}
                                size="lg"
                                variant="soft"
                            >
                                {credential.certificatesCount}
                            </Badge>
                        </Tooltip>
                    </Group>
                </EntityCardShared.Content>
            </EntityCardShared.Header>

            <EntityCardShared.Actions>
                <EntityCardShared.Button
                    leftSection={<PiPencil size={16} />}
                    onClick={() => {
                        setEditing(credential)
                        setIsModalOpen(true)
                    }}
                >
                    Edit
                </EntityCardShared.Button>

                <EntityCardShared.Menu>
                    <Menu.Item
                        leftSection={<TbPlugConnected size={18} />}
                        onClick={() => handleTest(credential)}
                    >
                        Test
                    </Menu.Item>

                    <Menu.Item
                        color="red"
                        leftSection={<PiTrashDuotone size={18} />}
                        onClick={() => handleDelete(credential)}
                    >
                        Delete
                    </Menu.Item>
                </EntityCardShared.Menu>
            </EntityCardShared.Actions>
        </EntityCardShared.Root>
    )

    return (
        <Stack gap="md">
            <Group justify="flex-end">
                <Button
                    leftSection={<TbPlus size={16} />}
                    onClick={() => {
                        setEditing(null)
                        setIsModalOpen(true)
                    }}
                >
                    Add credential
                </Button>
            </Group>

            {credentials.length === 0 && (
                <Center py="xl">
                    <Stack align="center" gap="lg">
                        <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                            <TbKey size={32} />
                        </ThemeIcon>

                        <Stack align="center" gap="xs">
                            <Text fw={600} size="lg" ta="center">
                                No credentials yet
                            </Text>
                            <Text c="dimmed" maw={400} size="sm" ta="center">
                                Credentials answer DNS challenges. They are reusable: many
                                certificates can share one.
                            </Text>
                        </Stack>
                    </Stack>
                </Center>
            )}

            {credentials.length > 0 && (
                <VirtualizedDndGrid
                    enableDnd={false}
                    items={credentials}
                    renderItem={renderCard}
                    useWindowScroll={true}
                />
            )}

            <AcmeCredentialModalWidget
                credential={editing}
                onClose={() => setIsModalOpen(false)}
                opened={isModalOpen}
            />
        </Stack>
    )
}
