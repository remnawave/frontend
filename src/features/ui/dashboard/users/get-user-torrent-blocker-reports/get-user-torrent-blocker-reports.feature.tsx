import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbFlame } from 'react-icons/tb'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

interface IProps {
    userUuid: string
}

export function GetUserTorrentBlockerReportsFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-user-torrent-blocker-reports.feature.blocker-reports')}>
            <ActionIcon
                color="indigo"
                onClick={() =>
                    openModalWithData(MODALS.USER_TORRENT_BLOCKER_REPORTS_DRAWER, { userUuid })
                }
                size="lg"
                variant="soft"
            >
                <TbFlame size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}
