import {
    PiAirTrafficControlDuotone,
    PiArrowsInCardinalFill,
    PiBarcodeDuotone,
    PiBracketsCurly,
    PiChartLine,
    PiCookie,
    PiCpu,
    PiListChecks,
    PiStarDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { HiChartPie, HiCurrencyDollar, HiServer } from 'react-icons/hi'
import { TbCirclesRelation } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { HappLogo } from '@pages/dashboard/utils/happ-routing-builder/ui/components/happ-routing-builder.page.component'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'
import { ROUTES } from '@shared/constants'

import { MenuItem } from './interfaces'

export const useMenuSections = (): MenuItem[] => {
    const { t } = useTranslation()

    return [
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
                    name: t('constants.config-profiles'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES,
                    icon: XtlsLogo
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
                            icon: PiChartLine
                        }
                    ]
                },

                {
                    name: t('constants.api-tokens'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.API_TOKENS,
                    icon: PiCookie
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
                    icon: PiBracketsCurly,
                    dropdownItems: [
                        {
                            name: 'Xray JSON',
                            href: ROUTES.DASHBOARD.TEMPLATES.XRAY_JSON
                        },
                        {
                            name: 'Mihomo',
                            href: ROUTES.DASHBOARD.TEMPLATES.MIHOMO
                        },
                        {
                            name: 'Stash',
                            href: ROUTES.DASHBOARD.TEMPLATES.STASH
                        },
                        {
                            name: 'Singbox',
                            href: ROUTES.DASHBOARD.TEMPLATES.SINGBOX
                        },
                        {
                            name: 'Clash',
                            href: ROUTES.DASHBOARD.TEMPLATES.CLASH
                        },
                        {
                            name: 'Singbox legacy',
                            href: ROUTES.DASHBOARD.TEMPLATES.SINGBOX_LEGACY
                        }
                    ]
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
        },
        {
            header: 'Superadmin',
            section: [
                {
                    name: 'Queues',
                    // TODO: remove this after testing
                    href: '/api/queues',
                    icon: PiAirTrafficControlDuotone,
                    newTab: true
                }
            ]
        }
    ]
}
