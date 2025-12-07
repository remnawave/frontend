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
import clsx from 'clsx'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { formatInt } from '@shared/utils/misc'

import classes from './external-squad-card.module.css'

interface IProps {
    externalSquad: GetExternalSquadsCommand.Response['response']['externalSquads'][number]
    handleAddToUsers: (externalSquadUuid: string) => void
    handleDeleteExternalSquad: (externalSquadUuid: string) => void
    handleRemoveFromUsers: (externalSquadUuid: string) => void
    isDragOverlay?: boolean
}

export function ExternalSquadCardWidget(props: IProps) {
    const {
        handleAddToUsers,
        handleDeleteExternalSquad,
        handleRemoveFromUsers,
        externalSquad,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()
    const [opened, handlers] = useDisclosure(false)

    // const { open: openModal, setInternalData } = useModalsStore()

    const openModalWithData = useModalsStoreOpenWithData()

    const handleOpenEditModal = () => {
        // setInternalData({
        //     internalState: externalSquad.uuid,
        //     modalKey: MODALS.EXTERNAL_SQUAD_DRAWER
        // })
        // openModal(MODALS.EXTERNAL_SQUAD_DRAWER)
        openModalWithData(MODALS.EXTERNAL_SQUAD_DRAWER, externalSquad.uuid)
    }

    const handleRename = () => {
        openModalWithData(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL, {
            name: externalSquad.name,
            uuid: externalSquad.uuid
        })
    }

    const { membersCount } = externalSquad.info
    const isActive = membersCount > 0

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={externalSquad.uuid}
            isDragOverlay={isDragOverlay}
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
                                    onClick={handleOpenEditModal}
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
                                    lineClamp={1}
                                    size="lg"
                                    title={externalSquad.name}
                                >
                                    {externalSquad.name}
                                </Text>
                                <Group gap="xs" wrap="nowrap">
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
                            onClick={handleOpenEditModal}
                            size="sm"
                            variant="light"
                        >
                            {t('common.edit')}
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
                                    onClick={() => handleDeleteExternalSquad(externalSquad.uuid)}
                                >
                                    {t('common.delete')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Stack>
            </Card>
        </WithDndSortable>
    )
}
