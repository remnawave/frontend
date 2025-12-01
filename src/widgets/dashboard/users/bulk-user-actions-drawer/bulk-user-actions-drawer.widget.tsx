import { Badge, Box, Drawer, Group, Tabs, Text, Transition } from '@mantine/core'
import { PiInfo, PiPencil, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import {
    useBulkUsersActionsStoreActions,
    useBulkUsersActionsStoreIsDrawerOpen
} from '@entities/dashboard/users/bulk-users-actions-store'
import { BulkUserActionsActionsTabFeature } from '@features/ui/dashboard/users/bulk-user-actions-tabs/bulk-user-actions.actions.tab.feature'
import { BulkUserActionsUpdateTabFeature } from '@features/ui/dashboard/users/bulk-user-actions-tabs/bulk-user-actions.update.tab.feature'
import { BulkUserActionsDangerTabFeature } from '@features/ui/dashboard/users/bulk-user-actions-tabs/bulk-user-actions.danger.tab.feature'
import { QueryKeys } from '@shared/api/hooks'
import { sleep } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces/props.interface'
import classes from './bulk-user-actions.module.css'

const TAB_TYPE = {
    update: 'update',
    actions: 'actions',
    danger: 'danger'
} as const

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE]

export const BulkUserActionsDrawerWidget = (props: IProps) => {
    const { resetRowSelection } = props
    const { t } = useTranslation()

    const isDrawerOpen = useBulkUsersActionsStoreIsDrawerOpen()
    const handlers = useBulkUsersActionsStoreActions()
    const [activeTab, setActiveTab] = useState<null | TabType>(TAB_TYPE.update)

    const uuidsLength = handlers.getUuidLength()

    const cleanUpDrawer = async () => {
        handlers.setIsDrawerOpen(false)
        await sleep(100)

        resetRowSelection()

        await queryClient.refetchQueries({ queryKey: QueryKeys.users.getAllUsers._def })
        await queryClient.refetchQueries({ queryKey: QueryKeys.system._def })
    }

    if (uuidsLength === 0) {
        return null
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
                    <Text fw={500}>{t('bulk-user-actions-drawer.widget.bulk-user-actions')}</Text>
                    <Badge color="blue" size="sm">
                        {uuidsLength} {t('bulk-user-actions-drawer.widget.users')}
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
                    <Tabs.Tab leftSection={<PiPencil size="20px" />} value={TAB_TYPE.update}>
                        {t('common.update')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<PiInfo size="20px" />} value={TAB_TYPE.actions}>
                        {t('bulk-user-actions-drawer.widget.actions')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        leftSection={<PiWarning color="red" size="20px" />}
                        value={TAB_TYPE.danger}
                    >
                        {t('bulk-user-actions-drawer.widget.danger')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={TAB_TYPE.update}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.update}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkUserActionsUpdateTabFeature cleanUpDrawer={cleanUpDrawer} />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TAB_TYPE.actions}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.actions}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkUserActionsActionsTabFeature cleanUpDrawer={cleanUpDrawer} />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value={TAB_TYPE.danger}>
                    <Transition
                        duration={200}
                        mounted={activeTab === TAB_TYPE.danger}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <Box style={styles}>
                                <BulkUserActionsDangerTabFeature cleanUpDrawer={cleanUpDrawer} />
                            </Box>
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>
        </Drawer>
    )
}
