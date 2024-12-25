import {
    PiClockCountdownDuotone,
    PiClockUserDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'

import { formatInt } from '@shared/utils/misc'

export const getUsersMetrics = (users: GetStatsCommand.Response['response']['users']) => {
    return [
        {
            value: formatInt(users.totalUsers) ?? 0,
            icon: PiUsersDuotone,
            title: 'Total users',
            color: 'blue'
        },
        {
            value: formatInt(users.statusCounts.ACTIVE) ?? 0,
            title: 'Active users',
            icon: PiPulseDuotone,
            color: 'teal'
        },
        {
            value: formatInt(users.statusCounts.EXPIRED) ?? 0,
            icon: PiClockUserDuotone,
            title: 'Expired users',
            color: 'red'
        },
        {
            value: formatInt(users.statusCounts.LIMITED) ?? 0,
            icon: PiClockCountdownDuotone,
            title: 'Limited users',
            color: 'orange'
        },
        {
            value: formatInt(users.statusCounts.DISABLED) ?? 0,
            icon: PiProhibitDuotone,
            title: 'Disabled users',
            color: 'gray'
        }
    ]
}
