import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Divider,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import {
    PiCheck,
    PiCircle,
    PiCopy,
    PiCpu,
    PiPencilDuotone,
    PiPulse,
    PiTag,
    PiTrashDuotone
} from 'react-icons/pi'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbDownload, TbEye } from 'react-icons/tb'
import { modals } from '@mantine/modals'

import { ActiveNodesListModalWithStoreShared } from '@shared/ui/config-profiles/active-nodes-list-modal-with-store/active-nodes-list-with-store.modal.shared'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useDeleteConfigProfile } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'
import { formatInt } from '@shared/utils/misc'
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
                const isActive = nodesCount > 0

                return (
                    <Grid.Col key={profile.uuid} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            h="100%"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                            padding="lg"
                            radius="md"
                            shadow="sm"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            withBorder
                        >
                            <Box
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    backgroundColor: isActive
                                        ? 'var(--mantine-color-teal-5)'
                                        : 'var(--mantine-color-gray-5)'
                                }}
                            />

                            <Stack gap="md" style={{ flex: 1 }}>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group gap="sm" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                                        <ActionIcon
                                            color={isActive ? 'teal' : 'gray'}
                                            radius="md"
                                            size="sm"
                                            variant="light"
                                        >
                                            {isActive ? (
                                                <PiPulse size={14} />
                                            ) : (
                                                <PiCircle size={14} />
                                            )}
                                        </ActionIcon>
                                        <XtlsLogo size={20} />
                                        <Text
                                            fw={600}
                                            lineClamp={1}
                                            size="md"
                                            style={{ flex: 1, minWidth: 0 }}
                                            title={profile.name}
                                            truncate
                                        >
                                            {profile.name}
                                        </Text>
                                    </Group>

                                    <Group gap={4}>
                                        <CopyButton timeout={2000} value={profile.uuid}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                        size="sm"
                                                        variant="subtle"
                                                    >
                                                        {copied ? (
                                                            <PiCheck size={14} />
                                                        ) : (
                                                            <PiCopy size={14} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>

                                        <Tooltip label="Delete profile">
                                            <ActionIcon
                                                color="red"
                                                onClick={() =>
                                                    handleDeleteProfile(profile.uuid, profile.name)
                                                }
                                                size="sm"
                                                variant="subtle"
                                            >
                                                <PiTrashDuotone size={14} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Group>

                                <Stack gap="sm">
                                    <Group gap="xs" justify="center">
                                        <Tooltip label="Inbounds">
                                            <Badge
                                                color="blue"
                                                leftSection={<PiTag size={12} />}
                                                size="lg"
                                                variant="light"
                                            >
                                                {formatInt(inboundsCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>

                                        <Tooltip label="Nodes">
                                            <Badge
                                                color={isActive ? 'teal' : 'gray'}
                                                leftSection={<PiCpu size={12} />}
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
                                                {formatInt(nodesCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>
                                    </Group>
                                </Stack>

                                <Divider />

                                <Stack gap="xs">
                                    <Group grow>
                                        <Button
                                            color="blue"
                                            leftSection={<TbDownload size={16} />}
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
                                            size="xs"
                                            variant="light"
                                        >
                                            Download
                                        </Button>
                                        <Button
                                            color="teal"
                                            leftSection={<TbEye size={16} />}
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
                                            size="xs"
                                            variant="light"
                                        >
                                            Quick view
                                        </Button>
                                    </Group>

                                    <Button
                                        fullWidth
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
                                        size="xs"
                                        variant="default"
                                    >
                                        Edit Xray Config
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid.Col>
                )
            })}

            <ActiveNodesListModalWithStoreShared />
        </Grid>
    )
}
