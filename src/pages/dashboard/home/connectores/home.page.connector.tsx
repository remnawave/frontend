import { useEffect } from 'react'

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

        const intervalTime = setInterval(() => {
            actions.getSystemInfo()
        }, 5000)

        return () => clearInterval(intervalTime)
    }, [])

    useEffect(() => {
        ;(async () => {})()
    }, [systemInfo])

    if (!systemInfo) {
        return <LoadingScreen />
    }

    return <HomePage systemInfo={systemInfo} />
}
