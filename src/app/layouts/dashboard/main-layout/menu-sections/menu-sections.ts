import {
    PiAirTrafficControlDuotone,
    PiArrowsInCardinalFill,
    PiBarcodeDuotone,
    PiChartLine,
    PiCpu,
    PiListChecks,
    PiStarDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import {
    TbChartArcs,
    TbCirclesRelation,
    TbDeviceAnalytics,
    TbFolder,
    TbReportAnalytics,
    TbRoute,
    TbWebhook
} from 'react-icons/tb'
import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'
import { HiChartPie, HiCurrencyDollar, HiServer } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { useHotkeys } from '@mantine/hooks'
import { useState } from 'react'

import { HappLogo } from '@pages/dashboard/utils/happ-routing-builder/ui/components/happ-routing-builder.page.component'
import { MihomoLogo, SingboxLogo, StashLogo, XrayLogo } from '@shared/ui/logos'
import { ROUTES } from '@shared/constants'
import { Logo } from '@shared/ui'

import { MenuItem } from './interfaces'

export const useMenuSections = (): MenuItem[] => {
    const { t } = useTranslation()
    const [showDevMenu, setShowDevMenu] = useState(false)

    useHotkeys([['mod+shift+J', () => setShowDevMenu((prev) => !prev)]])

    const menuSections: MenuItem[] = [
        {
            header: t('constants.overview'),
            id: 'overview',
            section: [
                {
                    name: t('constants.home'),
                    href: ROUTES.DASHBOARD.HOME,
                    icon: PiStarDuotone,
                    id: 'home'
                }
            ]
        },
        {
            header: t('constants.management'),
            id: 'management',
            section: [
                {
                    name: t('constants.users'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.USERS,
                    icon: PiUsersDuotone,
                    id: 'users'
                },
                {
                    name: t('constants.internal-squads'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.INTERNAL_SQUADS,
                    icon: TbCirclesRelation,
                    id: 'internal-squads'
                },
                {
                    name: t('constants.external-squads'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.EXTERNAL_SQUADS,
                    icon: TbWebhook,
                    id: 'external-squads'
                },
                {
                    name: t('constants.config-profiles'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES,
                    icon: XrayLogo,
                    id: 'config-profiles'
                },
                {
                    name: t('constants.hosts'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.HOSTS,
                    icon: PiListChecks,
                    id: 'hosts'
                },
                {
                    name: t('constants.nodes'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.NODES,
                    icon: PiCpu,
                    id: 'nodes',
                    dropdownItems: [
                        {
                            name: t('constants.management'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES,
                            icon: HiServer,
                            id: 'management'
                        },

                        {
                            name: t('constants.nodes-statistics'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_STATS,
                            icon: HiChartPie,
                            id: 'nodes-statistics'
                        },
                        {
                            name: t('constants.infra-billing'),
                            href: ROUTES.DASHBOARD.CRM.INFRA_BILLING,
                            icon: HiCurrencyDollar,
                            id: 'infra-billing'
                        },
                        {
                            name: t('constants.nodes-bandwidth-table'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_BANDWIDTH_TABLE,
                            icon: TbChartArcs,
                            id: 'nodes-bandwidth-table'
                        },
                        {
                            name: t('constants.nodes-metrics'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_METRICS,
                            icon: PiChartLine,
                            id: 'nodes-metrics'
                        }
                    ]
                },

                {
                    name: t('constants.remnawave-settings'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.REMNAWAVE_SETTINGS,
                    icon: Logo,
                    id: 'remnawave-settings'
                }
            ]
        },
        {
            header: t('constants.subscription'),
            id: 'subscription',
            section: [
                {
                    name: t('constants.subscription-settings'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.SUBSCRIPTION_SETTINGS,
                    icon: PiBarcodeDuotone,
                    id: 'subscription-settings'
                },
                {
                    name: t('constants.templates'),
                    href: ROUTES.DASHBOARD.TEMPLATES.ROOT,
                    icon: TbFolder,
                    id: 'templates',
                    dropdownItems: [
                        {
                            name: 'Xray JSON',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON
                            ),
                            icon: XrayLogo,
                            id: 'xray-json'
                        },
                        {
                            name: 'Mihomo',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO
                            ),
                            icon: MihomoLogo,
                            id: 'mihomo'
                        },
                        {
                            name: 'Stash',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.STASH
                            ),
                            icon: StashLogo,
                            id: 'stash'
                        },
                        {
                            name: 'Singbox',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX
                            ),
                            icon: SingboxLogo,
                            id: 'singbox'
                        },
                        {
                            name: 'Clash',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.CLASH
                            ),
                            icon: MihomoLogo,
                            id: 'clash'
                        }
                    ]
                },
                {
                    name: t('constants.response-rules'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.RESPONSE_RULES,
                    icon: TbRoute,
                    id: 'response-rules'
                }
            ]
        },
        {
            header: t('constants.tools'),
            id: 'tools',
            section: [
                {
                    name: t('constants.hwid-inspector'),
                    href: ROUTES.DASHBOARD.TOOLS.HWID_INSPECTOR,
                    icon: TbDeviceAnalytics,
                    id: 'hwid-inspector'
                },
                {
                    name: t('constants.srh-inspector'),
                    href: ROUTES.DASHBOARD.TOOLS.SRH_INSPECTOR,
                    icon: TbReportAnalytics,
                    id: 'srh-inspector'
                }
            ]
        },
        {
            header: t('constants.utils'),
            id: 'utils',
            section: [
                {
                    name: t('constants.happ-routing-builder'),
                    href: ROUTES.DASHBOARD.UTILS.HAPP_ROUTING_BUILDER,
                    icon: HappLogo,
                    id: 'happ-routing-builder'
                },
                {
                    name: 'Subscription Page',
                    href: ROUTES.DASHBOARD.UTILS.SUBSCRIPTION_PAGE_BUILDER,
                    icon: PiArrowsInCardinalFill,
                    id: 'subscription-page-builder'
                }
            ]
        }
    ]

    if (showDevMenu) {
        menuSections.unshift({
            header: 'Dev Menu',
            id: 'dev-menu',
            section: [
                {
                    name: 'Queues Viewer',
                    href: '/api/queues',
                    icon: PiAirTrafficControlDuotone,
                    id: 'queues-viewer',
                    newTab: true
                }
            ]
        })
    }

    return menuSections
}
