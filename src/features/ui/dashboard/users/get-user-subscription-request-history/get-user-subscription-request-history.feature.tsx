import { TbRewindBackward50 } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

export function GetUserSubscriptionRequestHistoryFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()
    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Menu.Item
            leftSection={<TbRewindBackward50 size="16px" />}
            onClick={() =>
                openModalWithData(MODALS.USER_SUBSCRIPTION_REQUESTS_DRAWER, { userUuid })
            }
        >
            {t('get-user-subscription-request-history.feature.request-history')}
        </Menu.Item>
    )
}
