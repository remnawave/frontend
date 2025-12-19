import { useTranslation } from 'react-i18next'
import { TbDevices } from 'react-icons/tb'
import { Menu } from '@mantine/core'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

export function GetHwidUserDevicesFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Menu.Item
            leftSection={<TbDevices color="var(--mantine-color-indigo-5)" size="16px" />}
            onClick={() => openModalWithData(MODALS.USER_HWID_DEVICES_DRAWER, { userUuid })}
        >
            {t('get-hwid-user-devices.feature.hwid-devices')}
        </Menu.Item>
    )
}
