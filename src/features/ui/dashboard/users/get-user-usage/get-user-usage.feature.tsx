import { PiChartBarDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Menu } from '@mantine/core'

import { UserUsageModalWidget } from '@widgets/dashboard/users/user-usage-modal/user-usage-modal.widget'

import { IProps } from './interfaces'

export function GetUserUsageFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    return (
        <>
            <Menu.Item
                leftSection={<PiChartBarDuotone color="var(--mantine-color-blue-5)" size="16px" />}
                onClick={handlers.open}
            >
                {t('get-user-usage.feature.show-usage')}
            </Menu.Item>

            <UserUsageModalWidget onClose={handlers.close} opened={opened} userUuid={userUuid} />
        </>
    )
}
