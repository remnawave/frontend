import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { TbRadar } from 'react-icons/tb'
import { Menu } from '@mantine/core'

import { UserActiveSessionDrawerWidget } from '@widgets/dashboard/users/user-active-sessions'

import { IProps } from './interfaces'

export function GetUserActiveSessionsFeature(props: IProps) {
    const { userUuid } = props
    const [activeSessionsModalOpened, activeSessionsModalHandlers] = useDisclosure(false)
    const { t } = useTranslation()

    return (
        <>
            <Menu.Item
                leftSection={<TbRadar size="16px" />}
                onClick={activeSessionsModalHandlers.open}
            >
                {t('get-user-usage.feature.active-sessions')}
            </Menu.Item>

            <UserActiveSessionDrawerWidget
                onClose={activeSessionsModalHandlers.close}
                opened={activeSessionsModalOpened}
                userUuid={userUuid}
            />
        </>
    )
}
