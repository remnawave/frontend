import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    CopyButton,
    Group,
    Menu,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCopy, PiCpu, PiPencil, PiTag, PiTrashDuotone } from 'react-icons/pi'
import { TbChevronDown, TbDownload, TbEdit, TbEye } from 'react-icons/tb'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { motion } from 'framer-motion'
import clsx from 'clsx'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { formatInt } from '@shared/utils/misc'
import { XrayLogo } from '@shared/ui/logos'
import { ROUTES } from '@shared/constants'

import classes from './config-profile-card.module.css'

interface IProps {
    configProfile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    handleDeleteConfigProfile: (configProfileUuid: string) => void
    index: number
    isHighCount: boolean
}

export function ConfigProfileCardWidget(props: IProps) {
    const { configProfile, isHighCount, index, handleDeleteConfigProfile } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const { open, setInternalData } = useModalsStore()
    const navigate = useNavigate()

    const nodesCount = configProfile.nodes.length
    const inboundsCount = configProfile.inbounds.length
    const isActive = nodesCount > 0

    const handleEditConfigProfile = () => {
        navigate(
            generatePath(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILE_BY_UUID, {
                uuid: configProfile.uuid
            })
        )
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={clsx(classes.cardWrapper, {
                [classes.inactive]: !isActive
            })}
            initial={{ opacity: 0, y: isHighCount ? 0 : 20 }}
            key={configProfile.uuid}
            transition={{
                duration: 0.3,
                delay: isHighCount ? 0.1 : index * 0.05,
                ease: 'easeOut'
            }}
        >
            <Card className={classes.card} h="100%" p="xl" shadow="sm" withBorder>
                <Box
                    className={clsx({
                        [classes.topAccent]: isActive,
                        [classes.inactiveTopAccent]: !isActive
                    })}
                />

                <Box className={classes.glowEffect} />

                <Stack gap="lg" justify="space-between" style={{ flex: 1 }}>
                    <Stack gap="md">
                        <Group gap="md" wrap="nowrap">
                            <Box className={classes.iconWrapper}>
                                <ActionIcon
                                    bg={isActive ? '' : 'dark.6'}
                                    className={classes.icon}
                                    color={isActive ? 'teal' : 'gray'}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditConfigProfile()
                                    }}
                                    size="xl"
                                    variant={isActive ? 'light' : 'subtle'}
                                >
                                    <XrayLogo size={28} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={configProfile.name}
                                >
                                    {configProfile.name}
                                </Text>
                                <Group gap="xs" justify="left" wrap="nowrap">
                                    <Tooltip label={t('config-profiles-grid.widget.inbounds')}>
                                        <Badge
                                            color="blue"
                                            leftSection={<PiTag size={12} />}
                                            onClick={() => {
                                                setInternalData({
                                                    internalState: configProfile,
                                                    modalKey:
                                                        MODALS.CONFIG_PROFILE_SHOW_INBOUNDS_DRAWER
                                                })
                                                open(MODALS.CONFIG_PROFILE_SHOW_INBOUNDS_DRAWER)
                                            }}
                                            size="lg"
                                            style={{ cursor: 'pointer' }}
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
                                                    internalState: configProfile.nodes,
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
                        </Group>
                    </Stack>

                    <Group gap={0} wrap="nowrap">
                        <Button
                            className={classes.button}
                            fullWidth
                            leftSection={<TbEdit size={16} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleEditConfigProfile()
                            }}
                            size="sm"
                            variant="light"
                        >
                            {t('config-profiles-grid.widget.xray-config')}
                        </Button>
                        <Menu
                            key={configProfile.uuid}
                            onClose={() => handlers.close()}
                            onOpen={() => handlers.open()}
                            position="bottom-end"
                            radius="md"
                            trigger="click-hover"
                            withinPortal
                        >
                            <Menu.Target>
                                <ActionIcon
                                    className={classes.menuControl}
                                    size={36}
                                    variant="light"
                                >
                                    <TbChevronDown
                                        className={clsx(classes.menuControlIcon, {
                                            [classes.menuControlIconOpen]: opened,
                                            [classes.menuControlIconClosed]: !opened
                                        })}
                                        size={24}
                                    />
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
                                                        data={configProfile.config as object}
                                                        indent={4}
                                                        maxWidth="100%"
                                                        rootName=""
                                                        theme={githubDarkTheme}
                                                        viewOnly
                                                    />
                                                </Box>
                                            ),
                                            title: configProfile.name,
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
                                            configProfile.config,
                                            null,
                                            2
                                        )
                                        const blob = new Blob([jsonString], {
                                            type: 'application/json'
                                        })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement('a')
                                        a.href = url
                                        a.download = `${configProfile.name}.json`
                                        document.body.appendChild(a)
                                        a.click()
                                        document.body.removeChild(a)
                                        URL.revokeObjectURL(url)
                                    }}
                                >
                                    {t('config-profiles-grid.widget.download')}
                                </Menu.Item>

                                <CopyButton timeout={2000} value={configProfile.uuid}>
                                    {({ copied, copy }) => (
                                        <Menu.Item
                                            color={copied ? 'teal' : undefined}
                                            leftSection={
                                                copied ? (
                                                    <PiCheck size={18} />
                                                ) : (
                                                    <PiCopy size={18} />
                                                )
                                            }
                                            onClick={copy}
                                        >
                                            {t('common.copy-uuid')}
                                        </Menu.Item>
                                    )}
                                </CopyButton>

                                <Menu.Item
                                    leftSection={<PiPencil size={18} />}
                                    onClick={() => {
                                        setInternalData({
                                            internalState: {
                                                name: configProfile.name,
                                                uuid: configProfile.uuid
                                            },
                                            modalKey: MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                        })
                                        open(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)
                                    }}
                                >
                                    {t('common.rename')}
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    leftSection={<PiTrashDuotone size={18} />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteConfigProfile(configProfile.uuid)
                                    }}
                                >
                                    {t('config-profiles-grid.widget.delete-profile')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Stack>
            </Card>
        </motion.div>
    )
}
