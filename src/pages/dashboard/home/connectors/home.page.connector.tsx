import { useGetBandwidthStats, useGetSystemStats } from '@shared/api/hooks'
import { HomePage } from '@pages/dashboard/home/components'
import { LoadingScreen } from '@shared/ui/loading-screen'

export const HomePageConnector = () => {
    const { data: systemInfo } = useGetSystemStats()
    const { data: bandwidthStats } = useGetBandwidthStats()

    if (!systemInfo || !bandwidthStats) {
        return <LoadingScreen />
    }

    return <HomePage bandwidthStats={bandwidthStats} systemInfo={systemInfo} />
}
