import { ActionIcon, Tooltip } from '@mantine/core'
import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-user-usage.feature.show-usage')}>
            <ActionIcon
                color="indigo"
                onClick={() => {
                    openModalWithData(MODALS.SHOW_NODE_USERS_USAGE_DRAWER, {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <PiChartBarDuotone size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
