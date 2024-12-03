import { useInterval } from '@mantine/hooks'
import { useEffect } from 'react'

import {
    useStatisticsNodesStoreActions,
    useStatisticsNodesStoreNodesStats
} from '@entitites/dashboard/statistics-nodes/statistics-nodes-store/nodes-store'
import { LoadingScreen } from '@/shared/ui/loading-screen'

import { StatisticNodesPage } from '../components'

export const StatisticNodesConnector = () => {
    const actions = useStatisticsNodesStoreActions()

    const nodesStats = useStatisticsNodesStoreNodesStats()
    useEffect(() => {
        ;(async () => {
            await actions.getNodesStats()
        })()
        return () => {
            actions.resetState()
        }
    }, [])

    useInterval(
        () => {
            actions.getNodesStats()
        },
        5000,
        { autoInvoke: true }
    )

    if (!nodesStats) {
        return <LoadingScreen />
    }

    return <StatisticNodesPage nodesStats={nodesStats} />
}
