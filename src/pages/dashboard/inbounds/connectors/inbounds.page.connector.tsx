import { useGetAllInbounds, useGetConfigProfiles, useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { sToMs } from '@shared/utils/time-utils'

import { InboundsPageComponent } from '../components/inbounds.page.component'

export function InboundsPageConnector() {
    const { data: inboundsData, isLoading: isInboundsLoading } = useGetAllInbounds({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })
    const { data: configProfilesData, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    const { data: nodes, isLoading: isNodesLoading } = useGetNodes({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })

    if (
        isInboundsLoading ||
        isConfigProfilesLoading ||
        isNodesLoading ||
        !inboundsData ||
        !configProfilesData ||
        !nodes
    ) {
        return <LoadingScreen />
    }

    return (
        <InboundsPageComponent
            configProfiles={configProfilesData.configProfiles}
            inbounds={inboundsData.inbounds}
            nodes={nodes}
        />
    )
}
