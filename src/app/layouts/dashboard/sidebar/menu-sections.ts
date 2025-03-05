import {
    PiAirTrafficControlDuotone,
    PiBookmarksDuotone,
    PiComputerTowerDuotone,
    PiCookie,
    PiGearDuotone,
    PiStarDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

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
                { name: t('constants.users'), href: ROUTES.DASHBOARD.USERS, icon: PiUsersDuotone },
                {
                    name: t('constants.hosts'),
                    href: ROUTES.DASHBOARD.HOSTS,
                    icon: PiBookmarksDuotone
                },
                {
                    name: t('constants.nodes'),
                    href: ROUTES.DASHBOARD.NODES,
                    icon: PiComputerTowerDuotone,
                    dropdownItems: [
                        { name: t('constants.management'), href: ROUTES.DASHBOARD.NODES },
                        {
                            name: t('constants.nodes-bandwidth-table'),
                            href: ROUTES.DASHBOARD.NODES_BANDWIDTH_TABLE
                        }
                    ]
                },
                { name: t('constants.config'), href: ROUTES.DASHBOARD.CONFIG, icon: PiGearDuotone },
                {
                    name: t('constants.api-tokens'),
                    href: ROUTES.DASHBOARD.API_TOKENS,
                    icon: PiCookie
                }
            ]
        },
        {
            header: t('constants.statistics'),
            section: [
                {
                    name: t('constants.nodes-statistics'),
                    href: ROUTES.DASHBOARD.NODES_STATS,
                    icon: PiComputerTowerDuotone
                }
            ]
        },
        {
            header: 'Superadmin',
            section: [
                {
                    name: 'Queues',
                    href: '/api/queues',
                    icon: PiAirTrafficControlDuotone
                }
            ]
        }
    ]
}
