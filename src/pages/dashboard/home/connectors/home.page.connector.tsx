import { useInterval } from '@mantine/hooks'
import { useEffect } from 'react'

import {
    useDashboardStoreActions,
    useDashboardStoreSystemInfo,
    useDSBandwidthStats
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { HomePage } from '@/pages/dashboard/home/components'
import { LoadingScreen } from '@/shared/ui/loading-screen'

export const HomePageConnector = () => {
    const actions = useDashboardStoreActions()
    const systemInfo = useDashboardStoreSystemInfo()
    const bandwidthStats = useDSBandwidthStats()
    useEffect(() => {
        ;(async () => {
            await actions.getSystemInfo()
            await actions.getBandwidthStats()
        })()
        return () => {
            actions.resetState()
        }
    }, [])

    useInterval(
        () => {
            actions.getSystemInfo()
            actions.getBandwidthStats()
        },
        3000,
        { autoInvoke: true }
    )

    if (!systemInfo || !bandwidthStats) {
        return <LoadingScreen />
    }

    return <HomePage bandwidthStats={bandwidthStats} systemInfo={systemInfo} />
}
