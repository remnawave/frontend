import { useNavigate, useParams } from 'react-router-dom'

import { useGetNodePlugin } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { NodePluginEditorPageComponent } from '../components/node-plugin-editor-page.component'

export function NodePluginEditorPageConnector() {
    const { uuid } = useParams()
    const navigate = useNavigate()

    const { data: plugin, isLoading: isPluginLoading } = useGetNodePlugin({
        route: {
            uuid: uuid as string
        },
        rQueryParams: {
            enabled: !!uuid
        }
    })

    if (isPluginLoading || !plugin) {
        return <LoadingScreen text="Loading plugin..." />
    }

    if (!uuid) {
        navigate(ROUTES.DASHBOARD.HOME, { replace: true })
        return null
    }

    return <NodePluginEditorPageComponent plugin={plugin} />
}
