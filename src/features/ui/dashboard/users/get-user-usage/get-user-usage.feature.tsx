import { ActionIcon, Tooltip } from '@mantine/core'
import { PiChartBarDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { UserUsageModalWidget } from '@widgets/dashboard/users/user-usage-modal/user-usage-modal.widget'

import { IProps } from './interfaces'

export function GetUserUsageFeature(props: IProps) {
    const { onClose, onOpen, opened, userUuid } = props
    const { t } = useTranslation()

    return (
        <>
            <Tooltip label={t('user-usage-modal.widget.traffic-statistics')}>
                <ActionIcon color="indigo" onClick={onOpen} size="lg" variant="soft">
                    <PiChartBarDuotone size="24px" />
                </ActionIcon>
            </Tooltip>

            <UserUsageModalWidget onClose={onClose} opened={opened} userUuid={userUuid} />
        </>
    )
}
