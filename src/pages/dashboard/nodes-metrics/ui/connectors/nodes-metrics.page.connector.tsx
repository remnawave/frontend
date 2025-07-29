import { useGetNodesMetrics } from '@shared/api/hooks'

import NodesMetricsPageComponent from '../components/nodes-metrics.page.component'

export function NodesMetricsPageConnector() {
    const { isLoading } = useGetNodesMetrics()

    return <NodesMetricsPageComponent isLoading={isLoading} />
}
