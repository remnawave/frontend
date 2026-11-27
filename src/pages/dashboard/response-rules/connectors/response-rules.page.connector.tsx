import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import {
    useGetExternalSquads,
    useGetSubscriptionSettings,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ResponseRulesPageComponent } from '../components/response-rules.page.component'

export function ResponseRulesPageConnector() {
    const { data: subscriptionSettings, isLoading: isSubscriptionSettingsLoading } =
        useGetSubscriptionSettings()

    const { data: templates, isLoading: isTemplatesLoading } = useGetSubscriptionTemplates({})
    const { data: externalSquads, isLoading: isExternalSquadsLoading } = useGetExternalSquads()

    if (
        isSubscriptionSettingsLoading ||
        !subscriptionSettings ||
        isTemplatesLoading ||
        !templates ||
        isExternalSquadsLoading ||
        !externalSquads
    ) {
        return <LoadingScreen />
    }

    const groupedTemplates = templates.templates.reduce(
        (acc, template) => {
            if (!acc[template.templateType]) {
                acc[template.templateType] = []
            }
            acc[template.templateType].push(template.name)
            return acc
        },
        {} as Record<TSubscriptionTemplateType, string[]>
    )

    return (
        <ResponseRulesPageComponent
            externalSquads={externalSquads.externalSquads.map(({ name, uuid }) => ({ name, uuid }))}
            groupedTemplates={groupedTemplates}
            responseRules={subscriptionSettings.responseRules}
            subscriptionSettingsUuid={subscriptionSettings.uuid}
        />
    )
}
