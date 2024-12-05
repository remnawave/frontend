import {
    PiBookmarksDuotone,
    PiComputerTowerDuotone,
    PiCookie,
    PiGearDuotone,
    PiStarDuotone,
    PiUsersDuotone
} from 'react-icons/pi'

import { ROUTES } from '@shared/constants'

import { MenuItem } from './interfaces'

export const menu: MenuItem[] = [
    {
        header: 'Overview',
        section: [
            {
                name: 'Home',
                href: ROUTES.DASHBOARD.HOME,
                icon: PiStarDuotone
            }
        ]
    },
    {
        header: 'Management',
        section: [
            { name: 'Users', href: ROUTES.DASHBOARD.USERS, icon: PiUsersDuotone },
            { name: 'Hosts', href: ROUTES.DASHBOARD.HOSTS, icon: PiBookmarksDuotone },
            { name: 'Nodes', href: ROUTES.DASHBOARD.NODES, icon: PiComputerTowerDuotone },
            { name: 'Config', href: ROUTES.DASHBOARD.CONFIG, icon: PiGearDuotone },
            { name: 'API Keys', href: ROUTES.DASHBOARD.CONFIG, icon: PiCookie }
        ]
    },
    {
        header: 'Statistics',
        section: [
            {
                name: 'Nodes',
                href: ROUTES.DASHBOARD.NODES_STATS,
                icon: PiComputerTowerDuotone
            }
        ]
    }
]
