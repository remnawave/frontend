import { PiSignOutDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { Button, Menu } from '@mantine/core'

import { resetAllStores } from '@/shared/hocs/store-wrapper'
import { removeToken } from '@entitites/auth'
import { ROUTES } from '@/shared/constants'
import { useAuth } from '@/shared/hooks'

export const HeaderButtons = () => {
    const { setIsAuthenticated } = useAuth()

    const navigate = useNavigate()
    const handleLogout = () => {
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        navigate(ROUTES.AUTH.LOGIN)
    }

    return (
        <Menu>
            <Button leftSection={<PiSignOutDuotone size="1rem" />} onClick={handleLogout} size="md">
                Logout
            </Button>
        </Menu>
    )
}
