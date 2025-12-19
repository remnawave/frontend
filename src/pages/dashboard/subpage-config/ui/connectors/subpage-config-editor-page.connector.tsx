import { useNavigate, useParams } from 'react-router-dom'

import { useGetSubscriptionPageConfig } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { SubpageConfigEditorPageComponent } from '../components/subpage-config-editor-page.component'

export function SubpageConfigEditorPageConnector() {
    const { uuid } = useParams()
    const navigate = useNavigate()

    const { data: config, isLoading: isConfigLoading } = useGetSubscriptionPageConfig({
        route: {
            uuid: uuid as string
        },
        rQueryParams: {
            enabled: !!uuid
        }
    })

    if (isConfigLoading || !config) {
        return <LoadingScreen text="Loading config..." />
    }

    if (!uuid) {
        navigate(ROUTES.DASHBOARD.HOME, { replace: true })
        return null
    }

    return <SubpageConfigEditorPageComponent config={config} />
}
