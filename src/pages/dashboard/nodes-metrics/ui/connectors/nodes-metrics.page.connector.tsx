import { useGetConfigProfiles, useGetNodesMetrics } from '@shared/api/hooks'

import NodesMetricsPageComponent from '../components/nodes-metrics.page.component'

export function NodesMetricsPageConnector() {
    const { isLoading } = useGetNodesMetrics()
    const { isLoading: isConfigProfilesLoading } = useGetConfigProfiles({})

    return <NodesMetricsPageComponent isLoading={isLoading || isConfigProfilesLoading} />
}
