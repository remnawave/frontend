import { ActionIcon, Box, Button, Card, CopyButton, Group, Menu, Stack, Text } from '@mantine/core'
import { GetSubscriptionTemplatesCommand } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbChevronDown, TbEdit } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { ROUTES } from '@shared/constants'

import classes from './templates-card.module.css'

interface IProps {
    handleDeleteTemplate: (templateUuid: string) => void
    index: number
    isHighCount: boolean
    template: GetSubscriptionTemplatesCommand.Response['response']['templates'][number]
    templateTitle: string
    themeLogo: ReactNode
}

export function TemplatesCardWidget(props: IProps) {
    const { index, isHighCount, template, templateTitle, themeLogo, handleDeleteTemplate } = props

    const { t } = useTranslation()

    const { open, setInternalData } = useModalsStore()
    const [opened, handlers] = useDisclosure(false)

    const navigate = useNavigate()

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={classes.cardWrapper}
            initial={{ opacity: 0, y: isHighCount ? 0 : 20 }}
            key={template.uuid}
            transition={{
                duration: 0.3,
                delay: isHighCount ? 0.1 : index * 0.05,
                ease: 'easeOut'
            }}
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
                                    color={template.name === 'Default' ? 'teal' : 'cyan'}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(
                                            generatePath(
                                                ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR,
                                                {
                                                    type: template.templateType,
                                                    uuid: template.uuid
                                                }
                                            )
                                        )
                                    }}
                                    size="xl"
                                    variant="light"
                                >
                                    {themeLogo}
                                </ActionIcon>
                            </Box>

                            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    className={classes.title}
                                    ff="monospace"
                                    fw={700}
                                    lineClamp={2}
                                    size="lg"
                                    title={template.name}
                                >
                                    {template.name}
                                </Text>
                                <Text
                                    c="dimmed"
                                    className={classes.subtitle}
                                    lineClamp={1}
                                    size="xs"
                                >
                                    {templateTitle}
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
                                    generatePath(ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR, {
                                        type: template.templateType,
                                        uuid: template.uuid
                                    })
                                )
                            }}
                            size="sm"
                            variant="light"
                        >
                            {t('templates-card.widget.edit')}
                        </Button>
                        <Menu
                            key={template.uuid}
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
                                <CopyButton timeout={2000} value={template.uuid}>
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
                                            {t('templates-card.widget.copy-uuid')}
                                        </Menu.Item>
                                    )}
                                </CopyButton>

                                <Menu.Item
                                    disabled={template.name === 'Default'}
                                    leftSection={<PiPencil size={18} />}
                                    onClick={() => {
                                        setInternalData({
                                            internalState: {
                                                name: template.name,
                                                uuid: template.uuid
                                            },
                                            modalKey: MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL
                                        })
                                        open(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)
                                    }}
                                >
                                    {t('templates-card.widget.rename')}
                                </Menu.Item>

                                <Menu.Item
                                    color="red"
                                    disabled={template.name === 'Default'}
                                    leftSection={<PiTrashDuotone size={18} />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteTemplate(template.uuid)
                                    }}
                                >
                                    {t('templates-card.widget.delete')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Stack>
            </Card>
        </motion.div>
    )
}
