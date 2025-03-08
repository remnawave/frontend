import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider
} from 'react-router-dom'
import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'

import { TemplateBasePageConnector } from '@pages/dashboard/templates/ui/connectors/template-base-page.connector'
import { NodesBandwidthTablePageConnector } from '@pages/dashboard/nodes-bandwidth-table/ui/connectors'
import { StatisticNodesConnector } from '@pages/dashboard/statistic-nodes/connectors'
import { ApiTokensPageConnector } from '@pages/dashboard/api-tokens/ui/connectors'
import { ConfigPageConnector } from '@pages/dashboard/config/ui/connectors'
import { HostsPageConnector } from '@pages/dashboard/hosts/ui/connectors'
import { UsersPageConnector } from '@pages/dashboard/users/ui/connectors'
import { NodesPageConnector } from '@pages/dashboard/nodes/ui/connectors'
import { HomePageConnector } from '@pages/dashboard/home/connectors'
import { NotFoundPageComponent } from '@pages/errors/4xx-error'
import { ErrorBoundaryHoc } from '@shared/hocs/error-boundary'
import { ErrorPageComponent } from '@pages/errors/5xx-error'
import { AuthGuard } from '@shared/hocs/guards/auth-guard'
import { LoginPage } from '@pages/auth/login'

import { DashboardLayout } from '../layouts/dashboard'
import { ROUTES } from '../../shared/constants'
import { AuthLayout } from '../layouts/auth'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<ErrorBoundaryHoc fallback={<ErrorPageComponent />} />}>
            <Route element={<AuthGuard />}>
                <Route element={<Navigate replace to={ROUTES.DASHBOARD.ROOT} />} path="/" />
                <Route element={<AuthLayout />} path={ROUTES.AUTH.ROOT}>
                    <Route element={<Navigate replace to={ROUTES.AUTH.LOGIN} />} index />
                    <Route element={<LoginPage />} path={ROUTES.AUTH.LOGIN} />
                </Route>

                <Route element={<DashboardLayout />} path={ROUTES.DASHBOARD.ROOT}>
                    <Route element={<Navigate replace to={ROUTES.DASHBOARD.HOME} />} index />
                    <Route element={<HomePageConnector />} path={ROUTES.DASHBOARD.HOME} />
                    <Route element={<UsersPageConnector />} path={ROUTES.DASHBOARD.USERS} />
                    <Route element={<HostsPageConnector />} path={ROUTES.DASHBOARD.HOSTS} />
                    <Route element={<NodesPageConnector />} path={ROUTES.DASHBOARD.NODES} />
                    <Route
                        element={<NodesBandwidthTablePageConnector />}
                        path={ROUTES.DASHBOARD.NODES_BANDWIDTH_TABLE}
                    />
                    <Route element={<ConfigPageConnector />} path={ROUTES.DASHBOARD.CONFIG} />
                    <Route
                        element={<ApiTokensPageConnector />}
                        path={ROUTES.DASHBOARD.API_TOKENS}
                    />
                    <Route
                        element={<StatisticNodesConnector />}
                        path={ROUTES.DASHBOARD.NODES_STATS}
                    />
                    {/* Subscription templates */}
                    <Route
                        element={
                            <TemplateBasePageConnector
                                language="yaml"
                                templateType={SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO}
                                title="Mihomo"
                            />
                        }
                        path={ROUTES.DASHBOARD.TEMPLATES.MIHOMO}
                    />
                    <Route
                        element={
                            <TemplateBasePageConnector
                                language="yaml"
                                templateType={SUBSCRIPTION_TEMPLATE_TYPE.STASH}
                                title="Stash"
                            />
                        }
                        path={ROUTES.DASHBOARD.TEMPLATES.STASH}
                    />
                    <Route
                        element={
                            <TemplateBasePageConnector
                                language="json"
                                templateType={SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX}
                                title="Singbox"
                            />
                        }
                        path={ROUTES.DASHBOARD.TEMPLATES.SINGBOX}
                    />
                    <Route
                        element={
                            <TemplateBasePageConnector
                                language="json"
                                templateType={SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX_LEGACY}
                                title="Singbox legacy"
                            />
                        }
                        path={ROUTES.DASHBOARD.TEMPLATES.SINGBOX_LEGACY}
                    />
                </Route>

                <Route element={<NotFoundPageComponent />} path="*" />
            </Route>
        </Route>
    )
)

export function Router() {
    return <RouterProvider router={router} />
}
