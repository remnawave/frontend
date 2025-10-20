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
import { PiCheck, PiCopy, PiPencil, PiTag, PiTrashDuotone, PiUsers } from 'react-icons/pi'
import { TbChevronDown, TbUsersMinus, TbUsersPlus, TbWebhook } from 'react-icons/tb'
import { GetExternalSquadsCommand } from '@remnawave/backend-contract'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { formatInt } from '@shared/utils/misc'

import classes from './external-squad-card.module.css'

interface IProps {
    externalSquad: GetExternalSquadsCommand.Response['response']['externalSquads'][number]
    handleAddToUsers: (externalSquadUuid: string) => void
    handleDeleteExternalSquad: (externalSquadUuid: string) => void
    handleRemoveFromUsers: (externalSquadUuid: string) => void
    index: number
    isHighCount: boolean
}

export function ExternalSquadCardWidget(props: IProps) {
    const {
        handleAddToUsers,
        handleDeleteExternalSquad,
        handleRemoveFromUsers,
        index,
        externalSquad,
        isHighCount
    } = props

    const { t } = useTranslation()
    const [opened, handlers] = useDisclosure(false)
    const { open, setInternalData } = useModalsStore()

    const { membersCount } = externalSquad.info
    const isActive = membersCount > 0

    const handleOpenInbounds = () => {
        setInternalData({
            internalState: externalSquad,
            modalKey: MODALS.EXTERNAL_SQUAD_DRAWER
        })
        open(MODALS.EXTERNAL_SQUAD_DRAWER)
    }

    const handleRename = () => {
        setInternalData({
            internalState: {
                name: externalSquad.name,
                uuid: externalSquad.uuid
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
            key={externalSquad.uuid}
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
                                    <TbWebhook size={28} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={externalSquad.name}
                                >
                                    {externalSquad.name}
                                </Text>
                                <Group gap="xs" justify="left" wrap="nowrap">
                                    <Tooltip label={t('external-squad-card.widget.users')}>
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
                            {t('external-squad-card.widget.edit')}
                        </Button>
                        <Menu
                            key={externalSquad.uuid}
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
                                    onClick={() => handleAddToUsers(externalSquad.uuid)}
                                >
                                    {t('external-squad-card.widget.add-users')}
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    disabled={membersCount === 0}
                                    leftSection={<TbUsersMinus size={18} />}
                                    onClick={() => handleRemoveFromUsers(externalSquad.uuid)}
                                >
                                    {t('external-squad-card.widget.remove-users')}
                                </Menu.Item>

                                <CopyButton timeout={2000} value={externalSquad.uuid}>
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
                                            {t('external-squad-card.widget.copy-uuid')}
                                        </Menu.Item>
                                    )}
                                </CopyButton>

                                <Menu.Item
                                    leftSection={<PiPencil size={18} />}
                                    onClick={handleRename}
                                >
                                    {t('external-squad-card.widget.rename')}
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    leftSection={<PiTrashDuotone size={18} />}
                                    onClick={() => handleDeleteExternalSquad(externalSquad.uuid)}
                                >
                                    {t('external-squad-card.widget.delete')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Stack>
            </Card>
        </motion.div>
    )
}
