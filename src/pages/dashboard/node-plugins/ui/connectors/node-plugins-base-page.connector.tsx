import { useGetNodePlugins } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { NodePluginsBasePageComponent } from '../components/node-plugins-base-page.component'

export function NodePluginsBasePageConnector() {
    const { data: plugins, isLoading: isPluginsLoading } = useGetNodePlugins({})

    if (isPluginsLoading || !plugins) {
        return <LoadingScreen text="Loading node plugins..." />
    }

    return <NodePluginsBasePageComponent plugins={plugins.nodePlugins} />
}
