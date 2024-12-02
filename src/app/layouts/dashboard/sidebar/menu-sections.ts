import {
    PiBookmarksDuotone,
    PiComputerTowerDuotone,
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
            { name: 'Config', href: ROUTES.DASHBOARD.CONFIG, icon: PiGearDuotone }
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

    // {
    //   header: 'Apps',
    //   section: [
    //     {
    //       name: 'Kanban',
    //       href: paths.dashboard.apps.kanban,
    //       icon: PiKanbanDuotone,
    //     },
    //   ],
    // },

    // {
    //   header: 'Management',
    //   section: [
    //     {
    //       name: 'Customers',
    //       icon: PiUsersDuotone,
    //       href: paths.dashboard.management.customers.root,
    //       dropdownItems: [
    //         {
    //           name: 'List',
    //           href: paths.dashboard.management.customers.list,
    //         },
    //       ],
    //     },
    //   ],
    // },

    // {
    //   header: 'Widgets',
    //   section: [
    //     {
    //       name: 'Charts',
    //       href: paths.dashboard.widgets.charts,
    //       icon: PiChartLineUpDuotone,
    //     },
    //     {
    //       name: 'Metrics',
    //       href: paths.dashboard.widgets.metrics,
    //       icon: PiSquaresFourDuotone,
    //     },
    //     {
    //       name: 'Tables',
    //       href: paths.dashboard.widgets.tables,
    //       icon: PiTableDuotone,
    //     },
    //   ],
    // },

    // {
    //   header: 'Authentication',
    //   section: [
    //     {
    //       name: 'Register',
    //       href: paths.auth.register,
    //       icon: PiUserPlusDuotone,
    //     },
    //     {
    //       name: 'Login',
    //       href: paths.auth.login,
    //       icon: PiShieldCheckDuotone,
    //     },
    //     {
    //       name: 'Forgot Password',
    //       href: paths.auth.forgotPassword,
    //       icon: PiLockKeyDuotone,
    //     },
    //     {
    //       name: 'OTP',
    //       href: paths.auth.otp,
    //       icon: PiChatCenteredDotsDuotone,
    //     },
    //   ],
    // },
]
