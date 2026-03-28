import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbDevices } from 'react-icons/tb'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

export function GetHwidUserDevicesFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-hwid-user-devices.feature.hwid-devices')}>
            <ActionIcon
                color="indigo"
                onClick={() => openModalWithData(MODALS.USER_HWID_DEVICES_DRAWER, { userUuid })}
                size="lg"
                variant="soft"
            >
                <TbDevices size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}
