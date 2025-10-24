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
import {
    TbChevronDown,
    TbCirclesRelation,
    TbServerCog,
    TbUsersMinus,
    TbUsersPlus
} from 'react-icons/tb'
import { PiCheck, PiCopy, PiPencil, PiTag, PiTrashDuotone, PiUsers } from 'react-icons/pi'
import { GetInternalSquadsCommand } from '@remnawave/backend-contract'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { formatInt } from '@shared/utils/misc'

import classes from './internal-squad-card.module.css'

interface IProps {
    handleAddToUsers: (internalSquadUuid: string, internalSquadName: string) => void
    handleDeleteInternalSquad: (internalSquadUuid: string, internalSquadName: string) => void
    handleRemoveFromUsers: (internalSquadUuid: string, internalSquadName: string) => void
    index: number
    internalSquad: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    isHighCount: boolean
}

export function InternalSquadCardWidget(props: IProps) {
    const {
        handleAddToUsers,
        handleDeleteInternalSquad,
        handleRemoveFromUsers,
        index,
        internalSquad,
        isHighCount
    } = props

    const { t } = useTranslation()
    const [opened, handlers] = useDisclosure(false)
    const { open, setInternalData } = useModalsStore()

    const { membersCount } = internalSquad.info
    const { inboundsCount } = internalSquad.info
    const isActive = membersCount > 0

    const handleOpenInbounds = () => {
        setInternalData({
            internalState: internalSquad,
            modalKey: MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
        })
        open(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
    }

    const handleOpenAccessibleNodes = () => {
        setInternalData({
            internalState: {
                squadUuid: internalSquad.uuid
            },
            modalKey: MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER
        })
        open(MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER)
    }

    const handleRename = () => {
        setInternalData({
            internalState: {
                name: internalSquad.name,
                uuid: internalSquad.uuid
            },
            modalKey: MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
        })
        open(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={clsx(classes.cardWrapper, {
                [classes.inactive]: !isActive
            })}
            initial={{ opacity: 0, y: isHighCount ? 0 : 20 }}
            key={internalSquad.uuid}
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
                                    onClick={handleOpenInbounds}
                                    size="xl"
                                    variant={isActive ? 'light' : 'subtle'}
                                >
                                    <TbCirclesRelation size={28} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={internalSquad.name}
                                >
                                    {internalSquad.name}
                                </Text>
                                <Group gap="xs" justify="left" wrap="nowrap">
                                    <Tooltip label={t('internal-squads-grid.widget.inbounds')}>
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

                                    <Tooltip label={t('internal-squads-grid.widget.users')}>
                                        <Badge
                                            color={isActive ? 'teal' : 'gray'}
                                            leftSection={<PiUsers size={12} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {formatInt(membersCount, {
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
                            leftSection={<PiTag size={16} />}
                            onClick={handleOpenInbounds}
                            size="sm"
                            variant="light"
                        >
                            {t('common.edit')}
                        </Button>
                        <Menu
                            key={internalSquad.uuid}
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
                                    color="teal"
                                    leftSection={<TbUsersPlus size={18} />}
                                    onClick={() =>
                                        handleAddToUsers(internalSquad.uuid, internalSquad.name)
                                    }
                                >
                                    {t('internal-squads-grid.widget.add-users')}
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    disabled={membersCount === 0}
                                    leftSection={<TbUsersMinus size={18} />}
                                    onClick={() =>
                                        handleRemoveFromUsers(
                                            internalSquad.uuid,
                                            internalSquad.name
                                        )
                                    }
                                >
                                    {t('internal-squads-grid.widget.remove-users')}
                                </Menu.Item>

                                <Menu.Item
                                    leftSection={<TbServerCog size={18} />}
                                    onClick={handleOpenAccessibleNodes}
                                >
                                    {t('view-user-modal.widget.view-accessible-nodes')}
                                </Menu.Item>

                                <CopyButton timeout={2000} value={internalSquad.uuid}>
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
                                    onClick={handleRename}
                                >
                                    {t('common.rename')}
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    leftSection={<PiTrashDuotone size={18} />}
                                    onClick={() =>
                                        handleDeleteInternalSquad(
                                            internalSquad.uuid,
                                            internalSquad.name
                                        )
                                    }
                                >
                                    {t('internal-squads-grid.widget.delete-squad')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Stack>
            </Card>
        </motion.div>
    )
}
