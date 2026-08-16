import {
    useGetConfigProfiles,
    useGetNodePlugins,
    useGetNodes,
    useGetNodesTags,
    useGetNodeSecretKey,
    useGetNodeIntegrations
} from '@shared/api/hooks'

import NodesPageComponent from '../components/nodes.page.component'

export function NodesPageConnector() {
    const { data: nodes, isLoading } = useGetNodes()
    const { data: nodePlugins, isLoading: isNodePluginsLoading } = useGetNodePlugins()
    const { data: nodeIntegrations, isLoading: isNodeIntegrationsLoading } =
        useGetNodeIntegrations()
    const { isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    useGetNodeSecretKey()
    useGetNodePlugins()
    useGetNodesTags()

    return (
        <NodesPageComponent
            isLoading={
                isLoading ||
                isConfigProfilesLoading ||
                isNodePluginsLoading ||
                isNodeIntegrationsLoading ||
                !nodePlugins ||
                !nodeIntegrations
            }
            nodes={nodes}
            nodePlugins={nodePlugins}
            nodeIntegrations={nodeIntegrations}
        />
    )
}
