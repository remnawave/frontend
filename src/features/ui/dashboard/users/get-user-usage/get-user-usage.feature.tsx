import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'

import { UserUsageModalWidget } from '@widgets/dashboard/users/user-usage-modal/user-usage-modal.widget'

import { IProps } from './interfaces'

export function GetUserUsageFeature(props: IProps) {
    const { onClose, onOpen, opened, userUuid } = props
    const { t } = useTranslation()

    return (
        <>
            <Menu.Item
                leftSection={<PiChartBarDuotone color="var(--mantine-color-blue-5)" size="16px" />}
                onClick={onOpen}
            >
                {t('user-usage-modal.widget.traffic-statistics')}
            </Menu.Item>

            <UserUsageModalWidget onClose={onClose} opened={opened} userUuid={userUuid} />
        </>
    )
}
