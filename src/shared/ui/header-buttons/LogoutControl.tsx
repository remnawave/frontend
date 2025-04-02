import { useNavigate } from 'react-router-dom'
import { PiSignOut } from 'react-icons/pi'
import { rem } from '@mantine/core'

import { resetAllStores } from '@shared/hocs/store-wrapper'
import { clearQueryClient } from '@shared/api'
import { removeToken } from '@entities/auth'
import { ROUTES } from '@shared/constants'
import { useAuth } from '@shared/hooks'

import classes from './LogoutControl.module.css'
import { HeaderControl } from './HeaderControl'

export function LogoutControl() {
    const { setIsAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        clearQueryClient()
        navigate(ROUTES.AUTH.LOGIN)
    }

    return (
        <HeaderControl className={classes.logout} onClick={handleLogout}>
            <PiSignOut style={{ width: rem(22), height: rem(22) }} />
        </HeaderControl>
    )
}
