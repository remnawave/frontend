import { useTranslation } from 'react-i18next'
import { TbFlame } from 'react-icons/tb'
import { Menu } from '@mantine/core'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

interface IProps {
    userUuid: string
}

export function GetUserTorrentBlockerReportsFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Menu.Item
            leftSection={<TbFlame color="var(--mantine-color-red-5)" size="16px" />}
            onClick={() =>
                openModalWithData(MODALS.USER_TORRENT_BLOCKER_REPORTS_DRAWER, { userUuid })
            }
        >
            {t('get-user-torrent-blocker-reports.feature.blocker-reports')}
        </Menu.Item>
    )
}
