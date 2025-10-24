import {
    PiAirTrafficControlDuotone,
    PiArrowsInCardinalFill,
    PiBarcodeDuotone,
    PiChartLine,
    PiCookie,
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
            section: [
                {
                    name: t('constants.home'),
                    href: ROUTES.DASHBOARD.HOME,
                    icon: PiStarDuotone
                }
            ]
        },
        {
            header: t('constants.management'),
            section: [
                {
                    name: t('constants.users'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.USERS,
                    icon: PiUsersDuotone
                },
                {
                    name: t('constants.internal-squads'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.INTERNAL_SQUADS,
                    icon: TbCirclesRelation
                },
                {
                    name: t('constants.external-squads'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.EXTERNAL_SQUADS,
                    icon: TbWebhook
                },
                {
                    name: t('constants.config-profiles'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES,
                    icon: XrayLogo
                },
                {
                    name: t('constants.hosts'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.HOSTS,
                    icon: PiListChecks
                },
                {
                    name: t('constants.nodes'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.NODES,
                    icon: PiCpu,
                    dropdownItems: [
                        {
                            name: t('constants.management'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES,
                            icon: HiServer
                        },

                        {
                            name: t('constants.nodes-statistics'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_STATS,
                            icon: HiChartPie
                        },
                        {
                            name: t('constants.infra-billing'),
                            href: ROUTES.DASHBOARD.CRM.INFRA_BILLING,
                            icon: HiCurrencyDollar
                        },
                        {
                            name: t('constants.nodes-bandwidth-table'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_BANDWIDTH_TABLE,
                            icon: TbChartArcs
                        },
                        {
                            name: t('constants.nodes-metrics'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_METRICS,
                            icon: PiChartLine
                        }
                    ]
                },

                {
                    name: t('constants.api-tokens'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.API_TOKENS,
                    icon: PiCookie
                },
                {
                    name: t('constants.remnawave-settings'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.REMNAWAVE_SETTINGS,
                    icon: Logo
                }
            ]
        },
        {
            header: 'Remnawave',
            section: [
                {
                    name: 'Dashboard',
                    href: ROUTES.DASHBOARD.HOME,
                    icon: Logo
                }
            ]
        },
        {
            header: t('constants.tools'),
            section: [
                {
                    name: t('constants.hwid-inspector'),
                    href: ROUTES.DASHBOARD.TOOLS.HWID_INSPECTOR,
                    icon: TbDeviceAnalytics
                },
                {
                    name: t('constants.srh-inspector'),
                    href: ROUTES.DASHBOARD.TOOLS.SRH_INSPECTOR,
                    icon: TbReportAnalytics
                }
            ]
        },
        {
            header: t('constants.subscription'),
            section: [
                {
                    name: t('constants.subscription-settings'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.SUBSCRIPTION_SETTINGS,
                    icon: PiBarcodeDuotone
                },
                {
                    name: t('constants.templates'),
                    href: ROUTES.DASHBOARD.TEMPLATES.ROOT,
                    icon: TbFolder,
                    dropdownItems: [
                        {
                            name: 'Xray JSON',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON
                            ),
                            icon: XrayLogo
                        },
                        {
                            name: 'Mihomo',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO
                            ),
                            icon: MihomoLogo
                        },
                        {
                            name: 'Stash',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.STASH
                            ),
                            icon: StashLogo
                        },
                        {
                            name: 'Singbox',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX
                            ),
                            icon: SingboxLogo
                        },
                        {
                            name: 'Clash',
                            href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                ':type',
                                SUBSCRIPTION_TEMPLATE_TYPE.CLASH
                            ),
                            icon: MihomoLogo
                        }
                    ]
                },
                {
                    name: t('constants.response-rules'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.RESPONSE_RULES,
                    icon: TbRoute
                }
            ]
        },
        {
            header: t('constants.utils'),
            section: [
                {
                    name: t('constants.happ-routing-builder'),
                    href: ROUTES.DASHBOARD.UTILS.HAPP_ROUTING_BUILDER,
                    icon: HappLogo
                },
                {
                    name: 'Subscription Page',
                    href: ROUTES.DASHBOARD.UTILS.SUBSCRIPTION_PAGE_BUILDER,
                    icon: PiArrowsInCardinalFill
                }
            ]
        }
    ]

    if (showDevMenu) {
        menuSections.unshift({
            header: 'Dev Menu',
            section: [
                {
                    name: 'Queues Viewer',
                    href: '/api/queues',
                    icon: PiAirTrafficControlDuotone,
                    newTab: true
                }
            ]
        })
    }

    return menuSections
}
