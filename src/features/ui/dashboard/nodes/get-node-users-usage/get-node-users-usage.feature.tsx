import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'
import { memo } from 'react'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const { open: openModal, setInternalData } = useModalsStore()

    return (
        <Menu.Item
            color="grape"
            leftSection={<PiChartBarDuotone size="16px" />}
            onClick={() => {
                setInternalData({
                    internalState: {
                        nodeUuid
                    },
                    modalKey: MODALS.SHOW_NODE_USERS_USAGE_DRAWER
                })
                openModal(MODALS.SHOW_NODE_USERS_USAGE_DRAWER)
            }}
        >
            {t('get-user-usage.feature.show-usage')}
        </Menu.Item>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
