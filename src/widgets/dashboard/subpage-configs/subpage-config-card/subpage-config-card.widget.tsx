import { ActionIcon, Box, Button, Card, CopyButton, Group, Menu, Stack, Text } from '@mantine/core'
import { GetSubscriptionPageConfigsCommand } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { TbChevronDown, TbEdit, TbFile } from 'react-icons/tb'
import { generatePath, useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { ROUTES } from '@shared/constants'

import classes from './subpage-config-card.module.css'

interface IProps {
    handleDeleteSubpageConfig: (subpageConfigUuid: string) => void

    isDragOverlay?: boolean
    subpageConfig: GetSubscriptionPageConfigsCommand.Response['response']['configs'][number]
}

export function SubpageConfigCardWidget(props: IProps) {
    const { subpageConfig, handleDeleteSubpageConfig, isDragOverlay = false } = props

    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    const [opened, handlers] = useDisclosure(false)

    const navigate = useNavigate()

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={subpageConfig.uuid}
            isDragOverlay={isDragOverlay}
        >
            <Card className={classes.card} h="100%" p="xl" shadow="sm" withBorder>
                <Box className={classes.topAccent} />
                <Box className={classes.glowEffect} />

                <Stack gap="lg" justify="space-between" style={{ flex: 1 }}>
                    <Stack gap="md">
                        <Group gap="md" wrap="nowrap">
                            <Box className={classes.iconWrapper}>
                                <ActionIcon
                                    className={classes.icon}
                                    color={subpageConfig.name === 'Default' ? 'teal' : 'cyan'}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(
                                            generatePath(
                                                ROUTES.DASHBOARD.SUBPAGE_CONFIGS
                                                    .SUBPAGE_CONFIG_BY_UUID,
                                                {
                                                    uuid: subpageConfig.uuid
                                                }
                                            )
                                        )
                                    }}
                                    size="xl"
                                    variant="light"
                                >
                                    <TbFile size={24} />
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={1}
                                    size="lg"
                                    title={subpageConfig.name}
                                >
                                    {subpageConfig.name}
                                </Text>
                                <Text
                                    c="dimmed"
                                    className={classes.subtitle}
                                    lineClamp={1}
                                    size="xs"
                                >
                                    Subpage Config
                                </Text>
                            </Stack>
                        </Group>
                    </Stack>

                    <Group gap={0} wrap="nowrap">
                        <Button
                            className={classes.button}
                            color="teal"
                            fullWidth
                            leftSection={<TbEdit size={16} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(
                                    generatePath(
                                        ROUTES.DASHBOARD.SUBPAGE_CONFIGS.SUBPAGE_CONFIG_BY_UUID,
                                        {
                                            uuid: subpageConfig.uuid
                                        }
                                    )
                                )
                            }}
                            size="sm"
                            variant="light"
                        >
                            {t('common.edit')}
                        </Button>
                        <Menu
                            key={subpageConfig.uuid}
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
                                    color="teal"
                                    size="36"
                                    variant="light"
                                >
                                    <TbChevronDown
                                        className={clsx(classes.menuControlIcon, {
                                            [classes.menuControlIconOpen]: opened,
                                            [classes.menuControlIconClosed]: !opened
                                        })}
                                        size={20}
                                    />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <CopyButton timeout={2000} value={subpageConfig.uuid}>
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
                                    disabled={subpageConfig.name === 'Default'}
                                    leftSection={<PiPencil size={18} />}
                                    onClick={() => {
                                        openModalWithData(
                                            MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL,
                                            {
                                                name: subpageConfig.name,
                                                uuid: subpageConfig.uuid
                                            }
                                        )
                                    }}
                                >
                                    {t('common.rename')}
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    disabled={subpageConfig.name === 'Default'}
                                    leftSection={<PiTrashDuotone size={18} />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteSubpageConfig(subpageConfig.uuid)
                                    }}
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
