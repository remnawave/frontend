import { useGetNodes } from '@shared/api/hooks'

import NodesPageComponent from '../components/nodes-bandwidth-table.page.component'

export function NodesBandwidthTablePageConnector() {
    const { isLoading } = useGetNodes()

    return <NodesPageComponent isLoading={isLoading} />
}
