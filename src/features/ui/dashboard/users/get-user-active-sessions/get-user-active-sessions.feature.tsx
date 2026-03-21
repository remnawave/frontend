import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { TbRadar } from 'react-icons/tb'

import { UserActiveSessionDrawerWidget } from '@widgets/dashboard/users/user-active-sessions'

import { IProps } from './interfaces'

export function GetUserActiveSessionsFeature(props: IProps) {
    const { userUuid } = props
    const [activeSessionsModalOpened, activeSessionsModalHandlers] = useDisclosure(false)
    const { t } = useTranslation()

    return (
        <>
            <Tooltip label={t('get-user-usage.feature.active-sessions')}>
                <ActionIcon
                    color="indigo"
                    onClick={activeSessionsModalHandlers.open}
                    size="lg"
                    variant="soft"
                >
                    <TbRadar size="22px" />
                </ActionIcon>
            </Tooltip>

            <UserActiveSessionDrawerWidget
                onClose={activeSessionsModalHandlers.close}
                opened={activeSessionsModalOpened}
                userUuid={userUuid}
            />
        </>
    )
}
