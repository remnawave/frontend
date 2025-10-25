import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Menu.Item
            color="grape"
            leftSection={<PiChartBarDuotone size="16px" />}
            onClick={() => {
                openModalWithData(MODALS.SHOW_NODE_USERS_USAGE_DRAWER, {
                    nodeUuid
                })
            }}
        >
            {t('get-user-usage.feature.show-usage')}
        </Menu.Item>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
