import { SUBSCRIPTION_TEMPLATE_TYPE, TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetSubscriptionTemplate } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { TemplateEditorPageComponent } from '../components/template-editor-page.component.'

export function TemplateEditorPageConnector() {
    const { type, uuid } = useParams()
    const navigate = useNavigate()

    const { data: template, isLoading: isTemplateLoading } = useGetSubscriptionTemplate({
        route: {
            uuid: uuid as string
        },
        rQueryParams: {
            enabled: !!uuid
        }
    })

    if (isTemplateLoading || !template) {
        return <LoadingScreen text="Loading template..." />
    }

    let title: string
    let editorType: 'json' | 'yaml'

    switch (type as TSubscriptionTemplateType) {
        case SUBSCRIPTION_TEMPLATE_TYPE.CLASH:
            title = 'Clash'
            editorType = 'yaml'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO:
            title = 'Mihomo'
            editorType = 'yaml'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX:
            title = 'Singbox'
            editorType = 'json'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.STASH:
            title = 'Stash'
            editorType = 'yaml'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON:
            title = 'Xray JSON'
            editorType = 'json'
            break
        default:
            navigate(ROUTES.DASHBOARD.HOME, { replace: true })
            return null
    }

    if (!type) {
        navigate(ROUTES.DASHBOARD.HOME, { replace: true })
        return null
    }

    return <TemplateEditorPageComponent editorType={editorType} template={template} title={title} />
}
