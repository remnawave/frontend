import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider
} from 'react-router-dom'
import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'

import { SubscriptionPageBuilderConnector } from '@pages/dashboard/utils/subscription-page-builder/ui/connectors/subscription-page-builder.page.connector'
import { HappRoutingBuilderPageConnector } from '@pages/dashboard/utils/happ-routing-builder/ui/connectors/happ-routing-builder.page.connector'
import { ConfigProfileByUuidPageConnector } from '@pages/dashboard/config-profiles/connectors/config-profile-by-uuid.page.connector'
import { InternalSquadsPageConnector } from '@pages/dashboard/internal-squads/connectors/internal-squads.page.connector'
import { InfraBillingPageConnector } from '@pages/dashboard/crm/infra-billing/connectors/infra-billing.page.connector'
import { TemplateBasePageConnector } from '@pages/dashboard/templates/ui/connectors/template-base-page.connector'
import { NodesBandwidthTablePageConnector } from '@pages/dashboard/nodes-bandwidth-table/ui/connectors'
import { SubscriptionSettingsConnector } from '@pages/dashboard/subscription-settings/connectors'
import { HwidInspectorPageConnector } from '@pages/dashboard/hwid-inspector/ui/connectors'
import { ConfigProfilesPageConnector } from '@pages/dashboard/config-profiles/connectors'
import { NodesMetricsPageConnector } from '@pages/dashboard/nodes-metrics/ui/connectors'
import { StatisticNodesConnector } from '@pages/dashboard/statistic-nodes/connectors'
import { Oauth2CallbackPage } from '@pages/auth/oauth2-callback/oauth2-callback.page'
import { ApiTokensPageConnector } from '@pages/dashboard/api-tokens/ui/connectors'
import { ProxyDefensePageConnector } from '@pages/dashboard/proxy-defense'
import { HostsPageConnector } from '@pages/dashboard/hosts/ui/connectors'
import { UsersPageConnector } from '@pages/dashboard/users/ui/connectors'
import { NodesPageConnector } from '@pages/dashboard/nodes/ui/connectors'
import { HomePageConnector } from '@pages/dashboard/home/connectors'
import { NotFoundPageComponent } from '@pages/errors/4xx-error'
import { ErrorBoundaryHoc } from '@shared/hocs/error-boundary'
import { ErrorPageComponent } from '@pages/errors/5xx-error'
import { AuthGuard } from '@shared/hocs/guards/auth-guard'
import { LoginPage } from '@pages/auth/login'

import { MainLayout } from '../layouts/dashboard/main-layout/main.layout'
import { ROUTES } from '../../shared/constants'
import { AuthLayout } from '../layouts/auth'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<ErrorBoundaryHoc fallback={<ErrorPageComponent />} />}>
            <Route element={<AuthLayout />} path={ROUTES.OAUTH2.ROOT}>
                <Route element={<Oauth2CallbackPage />} path={ROUTES.OAUTH2.ROOT} />
            </Route>
            <Route element={<AuthGuard />}>
                <Route element={<Navigate replace to={ROUTES.DASHBOARD.ROOT} />} path="/" />
                <Route element={<AuthLayout />} path={ROUTES.AUTH.ROOT}>
                    <Route element={<Navigate replace to={ROUTES.AUTH.LOGIN} />} index />
                    <Route element={<LoginPage />} path={ROUTES.AUTH.LOGIN} />
                </Route>

                <Route element={<MainLayout />} path={ROUTES.DASHBOARD.ROOT}>
                    <Route element={<Navigate replace to={ROUTES.DASHBOARD.HOME} />} index />
                    <Route element={<HomePageConnector />} path={ROUTES.DASHBOARD.HOME} />

                    <Route path={ROUTES.DASHBOARD.MANAGEMENT.ROOT}>
                        <Route
                            element={<Navigate replace to={ROUTES.DASHBOARD.MANAGEMENT.USERS} />}
                            index
                        />
                        <Route
                            element={<UsersPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.USERS}
                        />
                        <Route
                            element={<HostsPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.HOSTS}
                        />
                        <Route
                            element={<NodesPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.NODES}
                        />
                        <Route
                            element={<NodesBandwidthTablePageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.NODES_BANDWIDTH_TABLE}
                        />
                        <Route
                            element={<StatisticNodesConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.NODES_STATS}
                        />
                        <Route
                            element={<ApiTokensPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.API_TOKENS}
                        />
                        <Route
                            element={<SubscriptionSettingsConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.SUBSCRIPTION_SETTINGS}
                        />
                        <Route
                            element={<ConfigProfilesPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES}
                        />
                        <Route
                            element={<ConfigProfileByUuidPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILE_BY_UUID}
                        />
                        <Route
                            element={<InternalSquadsPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.INTERNAL_SQUADS}
                        />
                        <Route
                            element={<NodesMetricsPageConnector />}
                            path={ROUTES.DASHBOARD.MANAGEMENT.NODES_METRICS}
                        />
                    </Route>

                    <Route path={ROUTES.DASHBOARD.TOOLS.ROOT}>
                        <Route
                            element={<HwidInspectorPageConnector />}
                            path={ROUTES.DASHBOARD.TOOLS.HWID_INSPECTOR}
                        />
                    </Route>

                    <Route path={ROUTES.DASHBOARD.TEMPLATES.ROOT}>
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
                        <Route
                            element={
                                <TemplateBasePageConnector
                                    language="json"
                                    templateType={SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON}
                                    title="Xray JSON"
                                />
                            }
                            path={ROUTES.DASHBOARD.TEMPLATES.XRAY_JSON}
                        />
                        <Route
                            element={
                                <TemplateBasePageConnector
                                    language="yaml"
                                    templateType={SUBSCRIPTION_TEMPLATE_TYPE.CLASH}
                                    title="Clash"
                                />
                            }
                            path={ROUTES.DASHBOARD.TEMPLATES.CLASH}
                        />
                    </Route>

                    <Route path={ROUTES.DASHBOARD.CRM.ROOT}>
                        <Route
                            element={<InfraBillingPageConnector />}
                            path={ROUTES.DASHBOARD.CRM.INFRA_BILLING}
                        />
                    </Route>

                    <Route path={ROUTES.DASHBOARD.UTILS.ROOT}>
                        <Route
                            element={
                                <Navigate
                                    replace
                                    to={ROUTES.DASHBOARD.UTILS.HAPP_ROUTING_BUILDER}
                                />
                            }
                            index
                        />
                        <Route
                            element={<HappRoutingBuilderPageConnector />}
                            path={ROUTES.DASHBOARD.UTILS.HAPP_ROUTING_BUILDER}
                        />
                        <Route
                            element={<SubscriptionPageBuilderConnector />}
                            path={ROUTES.DASHBOARD.UTILS.SUBSCRIPTION_PAGE_BUILDER}
                        />
                    </Route>

                    {/* Easter Egg Routes */}
                    <Route
                        element={<ProxyDefensePageConnector />}
                        path={ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE}
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
