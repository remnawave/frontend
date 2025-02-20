import { PiArrowsClockwise, PiSignOutDuotone } from 'react-icons/pi'
import { ActionIcon, Button, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { resetAllStores } from '@shared/hocs/store-wrapper'
import { clearQueryClient } from '@shared/api'
import { removeToken } from '@entities/auth'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@shared/hooks'

export const HeaderButtons = () => {
    const { t } = useTranslation()

    const { setIsAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        clearQueryClient()
        navigate(ROUTES.AUTH.LOGIN)
    }

    const handleRefresh = () => {
        resetAllStores()
        clearQueryClient()
        navigate(0)
    }

    return (
        <Menu>
            <ActionIcon color="gray" onClick={handleRefresh} size="xl">
                <PiArrowsClockwise size="1.5rem" />
            </ActionIcon>

            <Button leftSection={<PiSignOutDuotone size="1rem" />} onClick={handleLogout} size="md">
                {t('header-buttons.feature.logout')}
            </Button>
        </Menu>
    )
}
