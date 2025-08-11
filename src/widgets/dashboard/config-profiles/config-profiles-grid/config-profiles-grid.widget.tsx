import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Grid,
    Group,
    Menu,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCircle, PiCopy, PiCpu, PiPencil, PiTag, PiTrashDuotone } from 'react-icons/pi'
import { TbChevronDown, TbDownload, TbEdit, TbEye } from 'react-icons/tb'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
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

import classes from './ConfigProfilesGrid.module.css'
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

    const isHighCount = configProfiles.length > 6

    return (
        <Grid>
            {configProfiles.map((profile, index) => {
                const nodesCount = profile.nodes.length
                const inboundsCount = profile.inbounds.length
                const isActive = nodesCount > 0

                return (
                    <Grid.Col
                        key={profile.uuid}
                        span={{ base: 12, sm: 6, md: 6, lg: 4, xl: 3, '2xl': 2 }}
                    >
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: isHighCount ? 0 : 20 }}
                            transition={{
                                duration: 0.3,
                                delay: isHighCount ? 0.1 : index * 0.05,
                                ease: 'easeOut'
                            }}
                        >
                            <Card
                                className={classes.card}
                                h="100%"
                                p={isMobile ? 'md' : 'lg'}
                                radius="md"
                                shadow="xs"
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
                                    <Group gap="sm" justify="space-between" wrap="nowrap">
                                        <Group
                                            gap="sm"
                                            style={{ flex: 1, minWidth: 0 }}
                                            wrap="nowrap"
                                        >
                                            <ActionIcon
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
                                            </ActionIcon>

                                            <Text
                                                fw={600}
                                                lineClamp={1}
                                                size={isMobile ? 'sm' : 'md'}
                                                style={{
                                                    color: 'white',
                                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                                    flex: 1
                                                }}
                                                title={profile.name}
                                            >
                                                {profile.name}
                                            </Text>
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

                                    <Group gap={0} wrap="nowrap">
                                        <Button
                                            className={classes.button}
                                            leftSection={<TbEdit size={14} />}
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
                                            radius="md"
                                            size="xs"
                                            variant="light"
                                        >
                                            {t('config-profiles-grid.widget.xray-config')}
                                        </Button>
                                        <Menu radius="sm" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon
                                                    className={classes.menuControl}
                                                    radius="md"
                                                    size={30}
                                                    variant="light"
                                                >
                                                    <TbChevronDown size={24} />
                                                </ActionIcon>
                                            </Menu.Target>

                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    leftSection={<TbEye size={18} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        modals.open({
                                                            children: (
                                                                <Box>
                                                                    <JsonEditor
                                                                        collapse={3}
                                                                        data={
                                                                            profile.config as object
                                                                        }
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
                                                >
                                                    {t('config-profiles-grid.widget.quick-view')}
                                                </Menu.Item>
                                                <Menu.Item
                                                    leftSection={<TbDownload size={18} />}
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
                                                >
                                                    {t('config-profiles-grid.widget.download')}
                                                </Menu.Item>

                                                <CopyButton timeout={2000} value={profile.uuid}>
                                                    {({ copied, copy }) => (
                                                        <Menu.Item
                                                            color={copied ? 'teal' : undefined}
                                                            leftSection={
                                                                copied ? (
                                                                    <PiCheck size={14} />
                                                                ) : (
                                                                    <PiCopy size={14} />
                                                                )
                                                            }
                                                            onClick={copy}
                                                        >
                                                            {t(
                                                                'config-profiles-grid.widget.copy-uuid'
                                                            )}
                                                        </Menu.Item>
                                                    )}
                                                </CopyButton>

                                                <Menu.Item
                                                    leftSection={<PiPencil size={14} />}
                                                    onClick={() => {
                                                        setInternalData({
                                                            internalState: {
                                                                name: profile.name,
                                                                uuid: profile.uuid
                                                            },
                                                            modalKey:
                                                                MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                                        })
                                                        open(
                                                            MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                                        )
                                                    }}
                                                >
                                                    {t('config-profiles-grid.widget.rename')}
                                                </Menu.Item>

                                                <Menu.Item
                                                    color="red"
                                                    leftSection={<PiTrashDuotone size={14} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteProfile(
                                                            profile.uuid,
                                                            profile.name
                                                        )
                                                    }}
                                                >
                                                    {t(
                                                        'config-profiles-grid.widget.delete-profile'
                                                    )}
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
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
