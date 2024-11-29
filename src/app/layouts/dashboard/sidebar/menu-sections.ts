import { ElementType } from 'react'

import { ROUTES } from '@shared/constants'
import { PiBookmarksDuotone, PiStarDuotone, PiUsersDuotone } from 'react-icons/pi'
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
            { name: 'Hosts', href: ROUTES.DASHBOARD.HOSTS, icon: PiBookmarksDuotone }
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
