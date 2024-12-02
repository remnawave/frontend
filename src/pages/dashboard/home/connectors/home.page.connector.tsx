import { useInterval } from '@mantine/hooks'
import { useEffect } from 'react'

import {
    useDashboardStoreActions,
    useDashboardStoreSystemInfo
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { HomePage } from '@/pages/dashboard/home/components'
import { LoadingScreen } from '@/shared/ui/loading-screen'

export const HomePageConnector = () => {
    const actions = useDashboardStoreActions()
    const systemInfo = useDashboardStoreSystemInfo()

    useEffect(() => {
        ;(async () => {
            await actions.getSystemInfo()
        })()
        return () => {
            actions.resetState()
        }
    }, [])

    useInterval(
        () => {
            actions.getSystemInfo()
        },
        3000,
        { autoInvoke: true }
    )

    if (!systemInfo) {
        return <LoadingScreen />
    }

    return <HomePage systemInfo={systemInfo} />
}
