import { useGetNodesStatisticsCommand } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import { StatisticNodesPage } from '../components'

export const StatisticNodesConnector = () => {
    const { data: nodesStats } = useGetNodesStatisticsCommand()

    if (!nodesStats) {
        return <LoadingScreen />
    }

    return <StatisticNodesPage nodesStats={nodesStats} />
}
