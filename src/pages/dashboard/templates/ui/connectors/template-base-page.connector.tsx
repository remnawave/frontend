import { SUBSCRIPTION_TEMPLATE_TYPE, TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { useNavigate, useParams } from 'react-router-dom'

import { useGetSubscriptionTemplates } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'
import { LoadingScreen } from '@shared/ui'

import { TemplateBasePageComponent } from '../components/template-base-page.component'

export function TemplateBasePageConnector() {
    const { type } = useParams()
    const navigate = useNavigate()

    const { data: templates, isLoading: isTemplatesLoading } = useGetSubscriptionTemplates({})

    if (isTemplatesLoading || !templates) {
        return <LoadingScreen text="Loading templates..." />
    }

    let title: string

    switch (type as TSubscriptionTemplateType) {
        case SUBSCRIPTION_TEMPLATE_TYPE.CLASH:
            title = 'Clash'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO:
            title = 'Mihomo'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX:
            title = 'Singbox'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.STASH:
            title = 'Stash'
            break
        case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON:
            title = 'Xray JSON'
            break
        default:
            navigate(ROUTES.DASHBOARD.HOME, { replace: true })
            return null
    }

    if (!type) {
        navigate(ROUTES.DASHBOARD.HOME, { replace: true })
        return null
    }

    return (
        <TemplateBasePageComponent
            templates={templates.templates.filter((template) => template.templateType === type)}
            title={title}
            type={type as TSubscriptionTemplateType}
        />
    )
}
