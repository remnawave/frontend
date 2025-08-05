import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { Menu } from '@mantine/core'
import { memo } from 'react'

import { NodeUsersUsageDrawer } from '@widgets/dashboard/nodes/node-users-usage-drawer'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    return (
        <>
            <Menu.Item
                color="grape"
                leftSection={<PiChartBarDuotone size="16px" />}
                onClick={handlers.open}
            >
                {t('get-user-usage.feature.show-usage')}
            </Menu.Item>
            <NodeUsersUsageDrawer nodeUuid={nodeUuid} onClose={handlers.close} opened={opened} />
        </>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
