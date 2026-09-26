import { rem } from '@mantine/core'
import { PiSignOut } from 'react-icons/pi'
import { useNavigate } from 'react-router'

import { clearQueryClient } from '@shared/api'
import { ROUTES } from '@shared/constants'
import { logoutEvents } from '@shared/emitters'
import { resetAllStores } from '@shared/hocs/store-wrapper'
import { useAuth } from '@shared/hooks'

import { removeToken } from '@entities/auth'

import { HeaderControl } from './HeaderControl'
import classes from './LogoutControl.module.css'

export function LogoutControl() {
    const { setIsAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutEvents.emit()
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
