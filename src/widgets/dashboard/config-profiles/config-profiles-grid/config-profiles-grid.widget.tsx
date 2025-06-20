import {
    ActionIcon,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    CopyButton,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import {
    PiCheck,
    PiCopy,
    PiCpu,
    PiDownload,
    PiEye,
    PiPencilDuotone,
    PiTag,
    PiTrashDuotone
} from 'react-icons/pi'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
import { modals } from '@mantine/modals'

import { ActiveNodesListModalWithStoreShared } from '@shared/ui/config-profiles/active-nodes-list-modal-with-store/active-nodes-list-with-store.modal.shared'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useDeleteConfigProfile } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export function ConfigProfilesGridWidget(props: IProps) {
    const { configProfiles } = props

    const { open, setInternalData } = useModalsStore()
    const navigate = useNavigate()

    const { mutate: deleteConfigProfile } = useDeleteConfigProfile({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys['config-profiles'].getConfigProfiles.queryKey
                })
            }
        }
    })

    const handleDeleteProfile = (profileUuid: string, profileName: string) => {
        modals.openConfirmModal({
            title: 'Delete Config Profile',
            children: (
                <Text size="sm">
                    Are you sure you want to delete the config profile "{profileName}"? This action
                    cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteConfigProfile({
                    route: {
                        uuid: profileUuid
                    }
                })
            }
        })
    }

    if (!configProfiles || configProfiles.length === 0) {
        return (
            <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                    <XtlsLogo size={48} style={{ opacity: 0.5 }} />
                    <div>
                        <Title c="dimmed" order={4} ta="center">
                            No Config Profiles
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            Create your first config profile to get started
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <Grid>
            {configProfiles.map((profile) => {
                const nodesCount = profile.nodes.length
                const inboundsCount = profile.inbounds.length

                return (
                    <Grid.Col key={profile.uuid} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            h="100%"
                            padding="md"
                            radius="md"
                            shadow="sm"
                            style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            withBorder
                        >
                            <Stack gap="md" style={{ flex: 1 }}>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group gap="xs" miw={0} style={{ flex: 1 }} wrap="nowrap">
                                        <XtlsLogo size={20} />
                                        <Text fw={600} lineClamp={2} size="md" title={profile.name}>
                                            {profile.name}
                                        </Text>
                                    </Group>

                                    <CopyButton timeout={2000} value={profile.uuid}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    size="md"
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size={18} />
                                                    ) : (
                                                        <PiCopy size={18} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>

                                    <Tooltip label={'Delete'}>
                                        <ActionIcon
                                            color="red"
                                            onClick={() =>
                                                handleDeleteProfile(profile.uuid, profile.name)
                                            }
                                            size="md"
                                            variant="subtle"
                                        >
                                            <PiTrashDuotone size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>

                                <Group gap="xs">
                                    <Tooltip label="Total inbounds in profile" position="bottom">
                                        <Badge
                                            color="blue"
                                            leftSection={<PiTag size={14} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {inboundsCount}
                                        </Badge>
                                    </Tooltip>

                                    <Tooltip label="Active nodes" position="bottom">
                                        <Badge
                                            color={nodesCount > 0 ? 'teal' : 'red'}
                                            leftSection={<PiCpu size={14} />}
                                            onClick={() => {
                                                setInternalData({
                                                    internalState: profile.nodes,
                                                    modalKey:
                                                        MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE
                                                })
                                                open(MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE)
                                            }}
                                            size="lg"
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            variant="light"
                                        >
                                            {nodesCount}
                                        </Badge>
                                    </Tooltip>
                                </Group>

                                <Group justify="center">
                                    <ButtonGroup>
                                        <Button
                                            color="gray"
                                            onClick={() => {
                                                const jsonString = JSON.stringify(
                                                    profile.config,
                                                    null,
                                                    2
                                                )
                                                const blob = new Blob([jsonString], {
                                                    type: 'application/json'
                                                })
                                                const url = URL.createObjectURL(blob)
                                                const a = document.createElement('a')
                                                a.href = url
                                                a.download = `${profile.name}.json`
                                                document.body.appendChild(a)
                                                a.click()
                                                document.body.removeChild(a)
                                                URL.revokeObjectURL(url)
                                            }}
                                            size="sm"
                                            variant="default"
                                        >
                                            <PiDownload size={18} />
                                        </Button>

                                        <Button
                                            color="gray"
                                            onClick={() => {
                                                modals.open({
                                                    children: (
                                                        <Box>
                                                            <JsonEditor
                                                                collapse={3}
                                                                data={profile.config as object}
                                                                indent={4}
                                                                maxWidth="100%"
                                                                rootName=""
                                                                theme={githubDarkTheme}
                                                                viewOnly
                                                            />
                                                        </Box>
                                                    ),
                                                    title: profile.name,
                                                    size: 'xl'
                                                })
                                            }}
                                            size="sm"
                                            variant="default"
                                        >
                                            <PiEye size={18} />
                                        </Button>

                                        <Button
                                            leftSection={<PiPencilDuotone size={16} />}
                                            onClick={() =>
                                                navigate(
                                                    generatePath(
                                                        ROUTES.DASHBOARD.MANAGEMENT
                                                            .CONFIG_PROFILE_BY_UUID,
                                                        {
                                                            uuid: profile.uuid
                                                        }
                                                    )
                                                )
                                            }
                                            size="sm"
                                            variant="light"
                                        >
                                            Edit XRay Config
                                        </Button>
                                    </ButtonGroup>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                )
            })}

            <ActiveNodesListModalWithStoreShared />
        </Grid>
    )
}
