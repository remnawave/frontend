import { PiChartBarDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'

import { NodeUsersUsageDrawer } from '@widgets/dashboard/nodes/node-users-usage-drawer/node-users-usage-drawer.widget'

import { IProps } from './interfaces'

export function GetNodeUsersUsageFeature(props: IProps) {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    return (
        <>
            <Menu.Item
                color="grape"
                leftSection={<PiChartBarDuotone size="1rem" />}
                onClick={handlers.open}
            >
                {t('get-user-usage.feature.show-usage')}
            </Menu.Item>
            <NodeUsersUsageDrawer nodeUuid={nodeUuid} onClose={handlers.close} opened={opened} />
        </>
    )
}
