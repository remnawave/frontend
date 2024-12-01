import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider
} from 'react-router-dom'

import { ConfigPageConnector } from '@pages/dashboard/config/ui/connectors/config.page.connector'
import { HostsPageConnector } from '@/pages/dashboard/hosts/ui/connectors/hosts.page.connector'
import { UsersPageConnector } from '@/pages/dashboard/users/ui/connectors/users.page.connector'
import { NodesPageConnector } from '@pages/dashboard/nodes/ui/connectors/nodes.page.connector'
import { HomePageConnectior } from '@pages/dashboard/home/connectors/home.page.connector'
import { AuthGuard } from '@/shared/hocs/guards/auth-guard'
import { DashboardLayout } from '@/app/layouts/dashboard'
import { LoginPage } from '@/pages/auth/login/login.page'
import { AuthLayout } from '@/app/layouts/auth'

import { ROUTES } from '../../shared/constants'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthGuard />}>
            <Route element={<Navigate replace to={ROUTES.DASHBOARD.ROOT} />} path="/" />
            <Route element={<AuthLayout />} path={ROUTES.AUTH.ROOT}>
                <Route element={<Navigate replace to={ROUTES.AUTH.LOGIN} />} index />
                <Route element={<LoginPage />} path={ROUTES.AUTH.LOGIN} />
            </Route>

            <Route element={<DashboardLayout />} path={ROUTES.DASHBOARD.ROOT}>
                <Route element={<Navigate replace to={ROUTES.DASHBOARD.HOME} />} index />
                <Route element={<HomePageConnectior />} path={ROUTES.DASHBOARD.HOME} />
                <Route element={<UsersPageConnector />} path={ROUTES.DASHBOARD.USERS} />
                <Route element={<HostsPageConnector />} path={ROUTES.DASHBOARD.HOSTS} />
                <Route element={<NodesPageConnector />} path={ROUTES.DASHBOARD.NODES} />
                <Route element={<ConfigPageConnector />} path={ROUTES.DASHBOARD.CONFIG} />
            </Route>
        </Route>
    )
)

export function Router() {
    return <RouterProvider router={router} />
}
