import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbTimeline } from 'react-icons/tb'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

export function GetUserSubscriptionRequestHistoryFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()
    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-user-subscription-request-history.feature.request-history')}>
            <ActionIcon
                color="indigo"
                onClick={() =>
                    openModalWithData(MODALS.USER_SUBSCRIPTION_REQUESTS_DRAWER, { userUuid })
                }
                size="lg"
                variant="soft"
            >
                <TbTimeline size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}
