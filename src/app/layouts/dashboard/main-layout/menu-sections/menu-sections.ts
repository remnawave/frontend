import {
    PiAirTrafficControlDuotone,
    PiArrowsInCardinalFill,
    PiBarcodeDuotone,
    PiBoundingBoxDuotone,
    PiBracketsCurly,
    PiCookie,
    PiCpu,
    PiGearDuotone,
    PiListChecks,
    PiStarDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { HappLogo } from '@pages/dashboard/utils/happ-routing-builder/ui/components/happ-routing-builder.page.component'
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
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES
                        },
                        {
                            name: t('constants.nodes-bandwidth-table'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_BANDWIDTH_TABLE
                        },
                        {
                            name: t('constants.nodes-statistics'),
                            href: ROUTES.DASHBOARD.MANAGEMENT.NODES_STATS
                        }
                    ]
                },
                {
                    name: t('constants.config'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG,
                    icon: PiGearDuotone
                },
                {
                    name: t('constants.inbounds'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.INBOUNDS,
                    icon: PiBoundingBoxDuotone
                },
                {
                    name: t('constants.subscription-settings'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.SUBSCRIPTION_SETTINGS,
                    icon: PiBarcodeDuotone
                },
                {
                    name: t('constants.api-tokens'),
                    href: ROUTES.DASHBOARD.MANAGEMENT.API_TOKENS,
                    icon: PiCookie
                }
            ]
        },
        {
            header: t('constants.templates'),
            section: [
                {
                    name: t('constants.subscription'),
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
                            name: 'Clash',
                            href: ROUTES.DASHBOARD.TEMPLATES.CLASH
                        },
                        {
                            name: 'Singbox',
                            href: ROUTES.DASHBOARD.TEMPLATES.SINGBOX
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
