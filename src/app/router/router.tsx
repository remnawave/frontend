import { NodesPageConnector } from '@pages/dashboard/nodes/ui/connectors/nodes.page.connector'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider
} from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/auth'
import { DashboardLayout } from '@/app/layouts/dashboard'
import { LoginPage } from '@/pages/auth/login/login.page'
import { HomePageConnectior } from '@/pages/dashboard/home/connectores/home.page.connector'
import { HostsPageConnector } from '@/pages/dashboard/hosts/ui/connectors/hosts.page.connector'
import { UsersPageConnector } from '@/pages/dashboard/users/ui/connectors/users.page.connector'
import { AuthGuard } from '@/shared/hocs/guards/auth-guard'
import { ROUTES } from '../../shared/constants'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthGuard />}>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD.ROOT} replace />} />
            <Route path={ROUTES.AUTH.ROOT} element={<AuthLayout />}>
                <Route index element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
                <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
            </Route>

            <Route path={ROUTES.DASHBOARD.ROOT} element={<DashboardLayout />}>
                <Route index element={<Navigate to={ROUTES.DASHBOARD.HOME} replace />} />
                <Route path={ROUTES.DASHBOARD.HOME} element={<HomePageConnectior />} />
                <Route path={ROUTES.DASHBOARD.USERS} element={<UsersPageConnector />} />
                <Route path={ROUTES.DASHBOARD.HOSTS} element={<HostsPageConnector />} />
                <Route path={ROUTES.DASHBOARD.NODES} element={<NodesPageConnector />} />
            </Route>
        </Route>
    )
)

export function Router() {
    return <RouterProvider router={router} />
}
