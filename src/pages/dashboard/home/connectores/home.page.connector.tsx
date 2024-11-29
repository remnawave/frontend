import { useEffect } from 'react'

import { useInterval } from '@mantine/hooks'
import {
    useDashboardStoreActions,
    useDashboardStoreSystemInfo
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { HomePage } from '@/pages/dashboard/home/components'
import { LoadingScreen } from '@/shared/ui/loading-screen'

export const HomePageConnectior = () => {
    const actions = useDashboardStoreActions()
    const systemInfo = useDashboardStoreSystemInfo()

    useEffect(() => {
        ;(async () => await actions.getSystemInfo())()
    }, [])

    useInterval(
        () => {
            actions.getSystemInfo()
        },
        5000,
        { autoInvoke: true }
    )

    if (!systemInfo) {
        return <LoadingScreen />
    }

    return <HomePage systemInfo={systemInfo} />
}
