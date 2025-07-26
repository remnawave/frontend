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
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import {
    PiCheck,
    PiCircle,
    PiCopy,
    PiCpu,
    PiPencilDuotone,
    PiTag,
    PiTrashDuotone
} from 'react-icons/pi'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbDownload, TbEye } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { motion } from 'framer-motion'

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
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 48em)')

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
            title: t('config-profiles-grid.widget.delete-config-profile'),
            children: (
                <Text size="sm">
                    {t(
                        'config-profiles-grid.widget.are-you-sure-you-want-to-delete-the-config-profile',
                        {
                            profileName
                        }
                    )}
                    <br />
                    {t('config-profiles-grid.widget.this-action-cannot-be-undone')}
                </Text>
            ),
            labels: {
                confirm: t('config-profiles-grid.widget.delete'),
                cancel: t('config-profiles-grid.widget.cancel')
            },
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
                            {t('config-profiles-grid.widget.no-config-profiles')}
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            {t(
                                'config-profiles-grid.widget.create-your-first-config-profile-to-get-started'
                            )}
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <Grid>
            {configProfiles.map((profile, index) => {
                const nodesCount = profile.nodes.length
                const inboundsCount = profile.inbounds.length
                const isActive = nodesCount > 0

                return (
                    <Grid.Col key={profile.uuid} span={{ base: 12, sm: 6, md: 6, lg: 6, xl: 3 }}>
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: 'easeOut'
                            }}
                            whileHover={{ y: -4 }}
                        >
                            <Card
                                h="100%"
                                p={isMobile ? 'md' : 'lg'}
                                radius="lg"
                                shadow="xs"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background:
                                        'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)',
                                    border: '1px solid rgba(148, 163, 184, 0.1)'
                                }}
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
                                        <Group
                                            gap="sm"
                                            style={{ flex: 1, minWidth: 0 }}
                                            wrap="nowrap"
                                        >
                                            <ThemeIcon
                                                color={isActive ? 'teal' : 'gray'}
                                                radius="md"
                                                size="md"
                                                variant={isActive ? 'light' : 'subtle'}
                                            >
                                                {isActive ? (
                                                    <XtlsLogo size={16} />
                                                ) : (
                                                    <PiCircle size={16} />
                                                )}
                                            </ThemeIcon>
                                            <Box>
                                                <Text
                                                    fw={600}
                                                    lineClamp={1}
                                                    size={isMobile ? 'sm' : 'md'}
                                                    style={{
                                                        color: 'white',
                                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                                                    }}
                                                    title={profile.name}
                                                >
                                                    {profile.name}
                                                </Text>
                                            </Box>
                                        </Group>

                                        <Group gap={4}>
                                            <CopyButton timeout={2000} value={profile.uuid}>
                                                {({ copied, copy }) => (
                                                    <Tooltip
                                                        label={copied ? 'Copied!' : 'Copy UUID'}
                                                    >
                                                        <ActionIcon
                                                            color={copied ? 'teal' : 'gray'}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                copy()
                                                            }}
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

                                            <Tooltip
                                                label={t(
                                                    'config-profiles-grid.widget.delete-profile'
                                                )}
                                            >
                                                <ActionIcon
                                                    color="red"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteProfile(
                                                            profile.uuid,
                                                            profile.name
                                                        )
                                                    }}
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
                                            <Tooltip
                                                label={t('config-profiles-grid.widget.inbounds')}
                                            >
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

                                            <Tooltip label={t('config-profiles-grid.widget.nodes')}>
                                                <Badge
                                                    color={isActive ? 'teal' : 'gray'}
                                                    leftSection={<PiCpu size={12} />}
                                                    onClick={() => {
                                                        setInternalData({
                                                            internalState: profile.nodes,
                                                            modalKey:
                                                                MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE
                                                        })
                                                        open(
                                                            MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE
                                                        )
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

                                    <Divider variant="dashed" />

                                    <Stack gap="xs">
                                        <Group grow>
                                            <Button
                                                color="blue"
                                                leftSection={<TbDownload size={16} />}
                                                onClick={(e) => {
                                                    e.stopPropagation()
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
                                                {t('config-profiles-grid.widget.download')}
                                            </Button>
                                            <Button
                                                color="teal"
                                                leftSection={<TbEye size={16} />}
                                                onClick={(e) => {
                                                    e.stopPropagation()
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
                                                {t('config-profiles-grid.widget.quick-view')}
                                            </Button>
                                        </Group>

                                        <Button
                                            fullWidth
                                            leftSection={<PiPencilDuotone size={16} />}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(
                                                    generatePath(
                                                        ROUTES.DASHBOARD.MANAGEMENT
                                                            .CONFIG_PROFILE_BY_UUID,
                                                        {
                                                            uuid: profile.uuid
                                                        }
                                                    )
                                                )
                                            }}
                                            size="xs"
                                            variant="default"
                                        >
                                            {t('config-profiles-grid.widget.edit-xray-config')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </motion.div>
                    </Grid.Col>
                )
            })}

            <ActiveNodesListModalWithStoreShared />
        </Grid>
    )
}
