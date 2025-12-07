import { Badge, Box, Drawer, Group, Tabs, Text, Transition } from '@mantine/core'
import { PiInfo, PiPencil, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { BulkAllUserActionsActionsTabFeature } from '@features/ui/dashboard/users/bulk-all-user-actions-tabs/bulk-all-user-actions-tabs.actions.tab.feature'
import { BulkAllUserActionsUpdateTabFeature } from '@features/ui/dashboard/users/bulk-all-user-actions-tabs/bulk-all-user-actions-tabs.update.tab.feature'
import { BulkAllUserActionsDangerTabFeature } from '@features/ui/dashboard/users/bulk-all-user-actions-tabs/bulk-all-user-actions-tabs.danger.tab.feature'
import { QueryKeys } from '@shared/api/hooks'
import { sleep } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

import { IBulkAllDrawerProps } from './interfaces/props.interface'
import classes from './bulk-all-user-actions.module.css'

const TAB_TYPE = {
    updateAll: 'updateAll',
    actionsAll: 'actionsAll',
    dangerAll: 'dangerAll'
} as const

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE]

export const BulkAllUserActionsDrawerWidget = (props: IBulkAllDrawerProps) => {
    const { isDrawerOpen, handlers } = props
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<null | TabType>(TAB_TYPE.updateAll)

    const cleanUpDrawer = async () => {
        handlers.close()
        await sleep(100)

        await queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
        await queryClient.refetchQueries({ queryKey: QueryKeys.system._def })
    }

    return (
        <Drawer
            keepMounted={true}
            onClose={cleanUpDrawer}
            opened={isDrawerOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="md"
            title={
                <Group>
                    <Text fw={500}>
                        {t('bulk-all-user-actions-drawer.widget.bulk-all-user-actions')}
                    </Text>
                    <Badge color="blue" size="sm">
                        {t('bulk-all-user-actions-drawer.widget.all-users')}
                    </Badge>
                </Group>
            }
        >
            <Tabs
                classNames={{
                    tab: classes.tab,
                    tabLabel: classes.tabLabel
                }}
                color="cyan"
                onChange={(value) => setActiveTab(value as TabType)}
                value={activeTab}
                variant="unstyled"
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab leftSection={<PiPencil size="20px" />} value={TAB_TYPE.updateAll}>
                        {t('common.update')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<PiInfo size="20px" />} value={TAB_TYPE.actionsAll}>
                        {t('bulk-all-user-actions-drawer.widget.actions')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        leftSection={<PiWarning color="red" size="20px" />}
                        value={TAB_TYPE.dangerAll}
                    >
                        {t('bulk-all-user-actions-drawer.widget.danger')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={TAB_TYPE.updateAll}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.updateAll}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkAllUserActionsUpdateTabFeature cleanUpDrawer={cleanUpDrawer} />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TAB_TYPE.actionsAll}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.actionsAll}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkAllUserActionsActionsTabFeature
                                    cleanUpDrawer={cleanUpDrawer}
                                />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TAB_TYPE.dangerAll}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.dangerAll}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkAllUserActionsDangerTabFeature cleanUpDrawer={cleanUpDrawer} />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>
        </Drawer>
    )
}
