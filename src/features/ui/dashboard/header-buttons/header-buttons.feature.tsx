import { PiArrowsClockwise, PiSignOutDuotone } from 'react-icons/pi'
import { ActionIcon, Button, Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
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
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <LanguagePicker />

            <ActionIcon color="gray" onClick={handleRefresh} size="xl">
                <PiArrowsClockwise size="1.5rem" />
            </ActionIcon>

            <Button leftSection={<PiSignOutDuotone size="1rem" />} onClick={handleLogout} size="md">
                {t('header-buttons.feature.logout')}
            </Button>
        </Group>
    )
}
