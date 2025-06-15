import { useGetBandwidthStats, useGetRemnawaveHealth, useGetSystemStats } from '@shared/api/hooks'
import { HomePage } from '@pages/dashboard/home/components'
import { LoadingScreen } from '@shared/ui/loading-screen'

export const HomePageConnector = () => {
    const { data: systemInfo } = useGetSystemStats()
    const { data: bandwidthStats } = useGetBandwidthStats()
    const { data: remnawaveHealth } = useGetRemnawaveHealth()

    if (!systemInfo || !bandwidthStats || !remnawaveHealth) {
        return <LoadingScreen />
    }

    return (
        <HomePage
            bandwidthStats={bandwidthStats}
            remnawaveHealth={remnawaveHealth}
            systemInfo={systemInfo}
        />
    )
}
