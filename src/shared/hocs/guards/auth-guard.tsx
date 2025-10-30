import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

import { useUpdatesStoreActions } from '@entities/dashboard/updates-store'
import { LoadingScreen } from '@shared/ui/loading-screen'
import { useGetAuthStatus } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants/routes'
import { useAuth } from '@shared/hooks'

export function AuthGuard() {
    const location = useLocation()

    const { isAuthenticated, isInitialized } = useAuth()

    const { isLoading } = useGetAuthStatus({})
    const updatesStoreActions = useUpdatesStoreActions()

    useLayoutEffect(() => {
        updatesStoreActions.getRemnawaveInfo()
    }, [])

    if (!isInitialized || isLoading) {
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
