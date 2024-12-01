import { useInterval } from '@mantine/hooks'
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
        // eslint-disable-next-line no-return-await
        ;(async () => await actions.getSystemInfo())()
    }, [])

    // useEffect(() => {
    //     actions.getSystemInfo()
    // }, [])

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
