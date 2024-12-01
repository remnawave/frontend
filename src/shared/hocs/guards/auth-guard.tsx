import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LoadingScreen } from '@shared/ui/loading-screen'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks'

export function AuthGuard() {
    const location = useLocation()

    const { isAuthenticated, isInitialized } = useAuth()

    if (!isInitialized) {
        return <LoadingScreen />
    }

    if (!isAuthenticated) {
        if (location.pathname.includes(ROUTES.AUTH.ROOT)) {
            return <Outlet />
        }
        return <Navigate replace to={ROUTES.AUTH.LOGIN} />
    }

    if (isAuthenticated) {
        if (location.pathname.includes(ROUTES.DASHBOARD.ROOT)) {
            return <Outlet />
        }
        return <Navigate replace to={ROUTES.DASHBOARD.ROOT} />
    }

    return <Outlet />
}
