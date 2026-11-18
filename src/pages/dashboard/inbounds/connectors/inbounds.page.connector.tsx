import {
    GetAllInboundsCommand,
    GetConfigProfilesCommand,
    GetInternalSquadsCommand,
    GetNodesCommand
} from '@remnawave/backend-contract'

import {
    useGetAllInbounds,
    useGetConfigProfiles,
    useGetInternalSquads,
    useGetNodes
} from '@shared/api/hooks'
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
    const { data: internalSquadsData, isLoading: isInternalSquadsLoading } = useGetInternalSquads(
        {}
    )
    const { data: nodes, isLoading: isNodesLoading } = useGetNodes({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })

    if (
        isInboundsLoading ||
        isConfigProfilesLoading ||
        isInternalSquadsLoading ||
        isNodesLoading ||
        !inboundsData ||
        !configProfilesData ||
        !internalSquadsData ||
        !nodes
    ) {
        return <LoadingScreen />
    }

    return (
        <InboundsPageComponent
            configProfiles={
                (configProfilesData as GetConfigProfilesCommand.Response['response']).configProfiles
            }
            inbounds={(inboundsData as GetAllInboundsCommand.Response['response']).inbounds}
            internalSquads={
                (internalSquadsData as GetInternalSquadsCommand.Response['response']).internalSquads
            }
            nodes={nodes as GetNodesCommand.Response['response']}
        />
    )
}
