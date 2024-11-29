import { Button, Menu } from '@mantine/core'
import { removeToken } from '@entitites/auth'
import { PiSignOutDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { resetAllStores } from '@/shared/hocs/store-wrapper'
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
            <Button size="md" leftSection={<PiSignOutDuotone size="1rem" />} onClick={handleLogout}>
                Logout
            </Button>
        </Menu>
    )
}
