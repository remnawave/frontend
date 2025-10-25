import {
    ActionIcon,
    Badge,
    Box,
    CopyButton,
    Drawer,
    Group,
    Paper,
    px,
    Stack,
    Tabs,
    Text,
    Tooltip,
    Transition
} from '@mantine/core'
import { TbFolder, TbSettings, TbWebhook } from 'react-icons/tb'
import { PiCheck, PiCopy, PiUsers } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { useGetSubscriptionTemplates } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { formatInt } from '@shared/utils/misc'

import { ExternalSquadsTemplatesTabWidget } from './external-squads-templates.tab.widget'
import { ExternalSquadsSettingsTabWidget } from './external-squads-settings.tab.widget'
import classes from './external-squads.module.css'

const TAB_TYPE = {
    settings: 'settings',
    templates: 'templates'
} as const

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE]

export const ExternalSquadsDrawer = () => {
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<TabType>('templates')

    const { isOpen, internalState: externalSquad } = useModalState(MODALS.EXTERNAL_SQUAD_DRAWER)
    const close = useModalClose(MODALS.EXTERNAL_SQUAD_DRAWER)

    const { isLoading: isTemplatesLoading } = useGetSubscriptionTemplates()

    const renderDrawerContent = () => {
        if (!externalSquad) return null

        const isActive = externalSquad.info.membersCount > 0

        return (
            <Stack gap="md" h="100%">
                <Paper
                    p="md"
                    shadow="sm"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)',
                        border: '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <Stack gap="md">
                        <Stack gap="md">
                            <Group gap="md" wrap="nowrap">
                                <Box className={classes.iconWrapper}>
                                    <ActionIcon
                                        bg={isActive ? '' : 'dark.6'}
                                        className={classes.icon}
                                        color={isActive ? 'teal' : 'gray'}
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
                                                {formatInt(externalSquad.info.membersCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>
                                        <CopyButton timeout={2000} value={externalSquad.uuid}>
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    size="lg"
                                                    style={{ flexShrink: 0 }}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="18px" />
                                                    ) : (
                                                        <PiCopy size="18px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    </Group>
                                </Stack>
                            </Group>
                        </Stack>
                    </Stack>
                </Paper>

                <Tabs
                    classNames={{
                        tab: classes.tab,
                        tabLabel: classes.tabLabel
                    }}
                    color="cyan"
                    defaultValue={TAB_TYPE.templates}
                    onChange={(value) => {
                        if (value) {
                            setActiveTab(value as TabType)
                        }
                    }}
                    style={{
                        width: '100%'
                    }}
                    value={activeTab}
                    variant="unstyled"
                >
                    <Tabs.List>
                        <Tabs.Tab
                            leftSection={<TbFolder size={px('1.2rem')} />}
                            value={TAB_TYPE.templates}
                        >
                            {t('external-squads.drawer.widget.templates')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<TbSettings size={px('1.2rem')} />}
                            value={TAB_TYPE.settings}
                        >
                            {t('external-squads.drawer.widget.settings')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.templates}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.templates}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsTemplatesTabWidget
                                        externalSquad={externalSquad}
                                        isOpen={isOpen}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.settings}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.settings}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsSettingsTabWidget
                                        externalSquad={externalSquad}
                                        isOpen={isOpen}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        )
    }

    const isLoading = isTemplatesLoading || !externalSquad

    return (
        <Drawer
            keepMounted={true}
            onClose={close}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="md"
            position="right"
            size="540px"
            title={t('external-squads.drawer.widget.edit-external-squad')}
        >
            {isLoading ? (
                <LoaderModalShared h="80vh" text="Loading..." w="100%" />
            ) : (
                renderDrawerContent()
            )}
        </Drawer>
    )
}
