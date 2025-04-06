import { Badge, Drawer, Group, Tabs, Text } from '@mantine/core'
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

export const BulkAllUserActionsDrawerWidget = (props: IBulkAllDrawerProps) => {
    const { isDrawerOpen, handlers } = props
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<null | string>('updateAll')

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
            <Tabs onChange={setActiveTab} value={activeTab}>
                <Tabs.List grow mb="md">
                    <Tabs.Tab leftSection={<PiPencil size="0.8rem" />} value="updateAll">
                        {t('bulk-all-user-actions-drawer.widget.update')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<PiInfo size="0.8rem" />} value="actionsAll">
                        {t('bulk-all-user-actions-drawer.widget.actions')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        color="red"
                        leftSection={<PiWarning size="0.8rem" />}
                        value="dangerAll"
                    >
                        {t('bulk-all-user-actions-drawer.widget.danger')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="updateAll">
                    <BulkAllUserActionsUpdateTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>

                <Tabs.Panel value="actionsAll">
                    <BulkAllUserActionsActionsTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>

                <Tabs.Panel value="dangerAll">
                    <BulkAllUserActionsDangerTabFeature cleanUpDrawer={cleanUpDrawer} />
                </Tabs.Panel>
            </Tabs>
        </Drawer>
    )
}
