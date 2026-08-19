import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Badge,
    Box,
    Card,
    CopyButton,
    Drawer,
    Group,
    px,
    Stack,
    Tabs,
    Text,
    Tooltip,
    Transition
} from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiIdentificationBadge, PiListChecks, PiUsers } from 'react-icons/pi'
import {
    TbFolder,
    TbListLetters,
    TbPalette,
    TbPrescription,
    TbSettings,
    TbWebhook
} from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    useGetExternalSquad,
    useGetSubpageConfigs,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { OPEN_ENTITY } from '@shared/constants'
import { CopyEntityLinkButton } from '@shared/ui'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { formatInt } from '@shared/utils/misc'

import classes from './external-squads.module.css'
import {
    ExternalSquadsHostOverridesTabWidget,
    ExternalSquadsHwidSettingsTabWidget,
    ExternalSquadsSettingsTabWidget,
    ExternalSquadsSubpageConfigTabWidget,
    ExternalSquadsTemplatesTabWidget
} from './tabs'
import { ExternalSquadsCustomRemarksTabWidget } from './tabs/external-squads-custom-remarks.widget'
import { ExternalSquadsResponseHeadersTabWidget } from './tabs/external-squads-response-headers.widget'

const TAB_TYPE = {
    settings: 'settings',
    templates: 'templates',
    hosts: 'hosts',
    responseHeaders: 'responseHeaders',
    hwidSettings: 'hwidSettings',
    customRemarks: 'customRemarks',
    subpageConfig: 'subpageConfig'
} as const

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE]

interface IProps {
    uuid: string
}

export const ExternalSquadsDrawer = NiceModal.create((props: IProps) => {
    const { uuid } = props

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<TabType>('templates')

    const { isLoading: isTemplatesLoading } = useGetSubscriptionTemplates()
    const { isLoading: isSubpageConfigsLoading } = useGetSubpageConfigs()

    const { data: externalSquad, isLoading: isExternalSquadLoading } = useGetExternalSquad({
        route: {
            uuid: uuid
        },
        rQueryParams: {
            staleTime: 0
        }
    })

    const renderDrawerContent = () => {
        if (!externalSquad) return null

        const isActive = externalSquad.info.membersCount > 0

        return (
            <Stack gap="md" h="100%">
                <Card p="md" withBorder>
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
                </Card>

                <Tabs
                    color="cyan"
                    defaultValue={TAB_TYPE.templates}
                    keepMountedMode="display-none"
                    onChange={(value) => {
                        if (value) {
                            setActiveTab(value as TabType)
                        }
                    }}
                    value={activeTab}
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
                        <Tabs.Tab
                            leftSection={<PiListChecks size={px('1.2rem')} />}
                            value={TAB_TYPE.hosts}
                        >
                            {t('constants.hosts')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<TbPrescription size={px('1.2rem')} />}
                            value={TAB_TYPE.responseHeaders}
                        >
                            {t('external-squads-response-headers.widget.response-headers')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<PiIdentificationBadge size={px('1.2rem')} />}
                            value={TAB_TYPE.hwidSettings}
                        >
                            HWID
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<TbListLetters size={px('1.2rem')} />}
                            value={TAB_TYPE.customRemarks}
                        >
                            {t('external-squads.drawer.widget.remarks')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={<TbPalette size={px('1.2rem')} />}
                            value={TAB_TYPE.subpageConfig}
                        >
                            {t('constants.subscription-page')}
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
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.hosts}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.hosts}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsHostOverridesTabWidget
                                        externalSquad={externalSquad}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.responseHeaders}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.responseHeaders}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsResponseHeadersTabWidget
                                        externalSquad={externalSquad}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.hwidSettings}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.hwidSettings}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsHwidSettingsTabWidget
                                        externalSquad={externalSquad}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.customRemarks}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.customRemarks}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsCustomRemarksTabWidget
                                        externalSquad={externalSquad}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>

                    <Tabs.Panel pt="xl" value={TAB_TYPE.subpageConfig}>
                        <Transition
                            duration={200}
                            mounted={activeTab === TAB_TYPE.subpageConfig}
                            timingFunction="linear"
                            transition="fade"
                        >
                            {(styles) => (
                                <Stack gap="lg" style={styles}>
                                    <ExternalSquadsSubpageConfigTabWidget
                                        externalSquad={externalSquad}
                                    />
                                </Stack>
                            )}
                        </Transition>
                    </Tabs.Panel>
                </Tabs>
            </Stack>
        )
    }

    const isLoading = isTemplatesLoading || isExternalSquadLoading || isSubpageConfigsLoading

    return (
        <Drawer
            {...modalProps}
            padding="md"
            position="right"
            size="600px"
            title={
                <Group gap="xs" wrap="nowrap">
                    {t('external-squads.drawer.widget.edit-external-squad')}

                    <CopyEntityLinkButton entity={OPEN_ENTITY.EXTERNAL_SQUAD} id={uuid} />
                </Group>
            }
        >
            <Transition
                duration={300}
                mounted={!isLoading}
                timingFunction="ease-in-out"
                transition="fade"
            >
                {(styles) => <Box style={styles}>{renderDrawerContent()}</Box>}
            </Transition>

            {isLoading && <LoaderModalShared h="80vh" text="Loading..." w="100%" />}
        </Drawer>
    )
})
