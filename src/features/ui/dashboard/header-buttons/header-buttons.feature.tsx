import { PiArrowsClockwise, PiSignOutDuotone } from 'react-icons/pi'
import { ActionIcon, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { resetAllStores } from '@shared/hocs/store-wrapper'
import { clearQueryClient } from '@shared/api'
import { removeToken } from '@entities/auth'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@shared/hooks'

export const HeaderButtons = () => {
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
                <PiArrowsClockwise size="24px" />
            </ActionIcon>

            <ActionIcon color="cyan" onClick={handleLogout} size="xl">
                <PiSignOutDuotone size="24px" />
            </ActionIcon>
        </Group>
    )
}
