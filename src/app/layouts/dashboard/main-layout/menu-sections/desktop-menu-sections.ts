import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HiChartPie, HiServer } from 'react-icons/hi'
import { PiArrowsInCardinalFill, PiChartLine, PiListChecks, PiUsers } from 'react-icons/pi'
import {
    TbApi,
    TbLink,
    TbCirclesRelation,
    TbCreditCard,
    TbDeviceAnalytics,
    TbFlame,
    TbFolder,
    TbHexagon,
    TbPackage,
    TbRadar2,
    TbReportAnalytics,
    TbRoute,
    TbStar,
    TbTools,
    TbWebhook
} from 'react-icons/tb'

import { ROUTES } from '@shared/constants'
import { Logo } from '@shared/ui'
import { MihomoLogo, SingboxLogo, StashLogo, XrayLogo } from '@shared/ui/logos'

import { MenuItem } from './interfaces'

export const useDesktopMenuSections = (): MenuItem[] => {
    const { t } = useTranslation()

    return useMemo<MenuItem[]>(
        () => [
            {
                header: t('constants.home'),
                id: 'home',
                icon: TbStar,
                section: [
                    {
                        name: t('constants.home'),
                        href: ROUTES.DASHBOARD.HOME,
                        icon: TbStar,
                        id: 'home'
                    }
                ]
            },
            {
                header: t('constants.users'),
                id: 'users',
                icon: PiUsers,
                section: [
                    {
                        name: t('constants.users'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.USERS,
                        icon: PiUsers,
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
                    }
                ]
            },
            {
                header: t('constants.nodes'),
                id: 'nodes',
                icon: HiServer,
                section: [
                    {
                        name: t('constants.nodes'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.NODES,
                        icon: HiServer,
                        id: 'nodes-management'
                    },
                    {
                        name: `${t('constants.node-plugins')} β`,
                        href: ROUTES.DASHBOARD.MANAGEMENT.NODE_PLUGINS.ROOT,
                        icon: TbPackage,
                        id: 'node-plugins'
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
                        icon: TbCreditCard,
                        id: 'infra-billing'
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
                header: t('constants.config-profiles'),
                id: 'profiles',
                icon: XrayLogo,
                section: [
                    {
                        name: t('constants.config-profiles'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES,
                        icon: XrayLogo,
                        id: 'config-profiles'
                    }
                ]
            },
            {
                header: t('constants.subscription'),
                id: 'subscription',
                icon: TbHexagon,
                section: [
                    {
                        name: t('constants.hosts'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.HOSTS,
                        icon: PiListChecks,
                        id: 'hosts'
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
                        name: t('constants.subscription-settings'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.SUBSCRIPTION_SETTINGS,
                        icon: TbHexagon,
                        id: 'subscription-settings'
                    },
                    {
                        name: t('constants.response-rules'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.RESPONSE_RULES,
                        icon: TbRoute,
                        id: 'response-rules'
                    },
                    {
                        name: 'Subscription Page',
                        href: ROUTES.DASHBOARD.SUBPAGE_CONFIGS.ROOT,
                        icon: PiArrowsInCardinalFill,
                        id: 'subscription-page'
                    }
                ]
            },
            {
                header: t('constants.tools'),
                id: 'tools',
                icon: TbTools,
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
                    },
                    {
                        name: t('constants.tb-reports'),
                        href: ROUTES.DASHBOARD.TOOLS.TORRENT_BLOCKER_REPORTS,
                        icon: TbFlame,
                        id: 'torrent-blocker-reports'
                    },
                    {
                        name: t('constants.sessions-explorer'),
                        href: ROUTES.DASHBOARD.TOOLS.SESSIONS_EXPLORER,
                        icon: TbRadar2,
                        id: 'sessions-explorer'
                    },
                    {
                        name: t('constants.http-stats'),
                        href: ROUTES.DASHBOARD.TOOLS.HTTP_STATS,
                        icon: TbApi,
                        id: 'http-stats'
                    },
                    {
                        name: t('constants.quick-open'),
                        href: ROUTES.DASHBOARD.TOOLS.QUICK_OPEN,
                        icon: TbLink,
                        id: 'quick-open'
                    }
                ]
            },
            {
                header: t('constants.subscription-settings'),
                id: 'settings',
                icon: Logo,
                section: [
                    {
                        name: t('constants.remnawave-settings'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.REMNAWAVE_SETTINGS,
                        icon: Logo,
                        id: 'remnawave-settings'
                    }
                ]
            }
        ],
        [t]
    )
}
