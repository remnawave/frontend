import { Badge, Drawer, Group, Tabs, Text } from '@mantine/core'
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

export const BulkUserActionsDrawerWidget = (props: IProps) => {
    const { resetRowSelection } = props
    const { t } = useTranslation()

    const isDrawerOpen = useBulkUsersActionsStoreIsDrawerOpen()
    const handlers = useBulkUsersActionsStoreActions()
    const [activeTab, setActiveTab] = useState<null | string>('update')

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
            <Tabs onChange={setActiveTab} value={activeTab}>
                <Tabs.List grow mb="md">
                    <Tabs.Tab leftSection={<PiPencil size="0.8rem" />} value="update">
                        {t('bulk-user-actions-drawer.widget.update')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<PiInfo size="0.8rem" />} value="actions">
                        {t('bulk-user-actions-drawer.widget.actions')}
                    </Tabs.Tab>
                    <Tabs.Tab color="red" leftSection={<PiWarning size="0.8rem" />} value="danger">
                        {t('bulk-user-actions-drawer.widget.danger')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="update">
                    <BulkUserActionsUpdateTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>

                <Tabs.Panel value="actions">
                    <BulkUserActionsActionsTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>

                <Tabs.Panel value="danger">
                    <BulkUserActionsDangerTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>
            </Tabs>
        </Drawer>
    )
}
