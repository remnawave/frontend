import {
    PiClockCountdownDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetStatsCommand } from '@remnawave/backend-contract'

import { formatInt } from '@shared/utils/misc'

export const getOnlineMetrics = (
    onlineStats: GetStatsCommand.Response['response']['onlineStats']
) => {
    return [
        {
            value: formatInt(onlineStats.onlineNow) ?? 0,
            icon: PiPulseDuotone,
            title: 'Online now',
            color: 'teal'
        },
        {
            value: formatInt(onlineStats.lastDay) ?? 0,
            icon: PiClockCountdownDuotone,
            title: 'Online today',
            color: 'blue'
        },
        {
            value: formatInt(onlineStats.lastWeek) ?? 0,
            icon: PiUsersDuotone,
            title: 'Online this week',
            color: 'indigo'
        },
        {
            value: formatInt(onlineStats.neverOnline) ?? 0,
            icon: PiProhibitDuotone,
            title: 'Never online',
            color: 'red'
        }
    ]
}
