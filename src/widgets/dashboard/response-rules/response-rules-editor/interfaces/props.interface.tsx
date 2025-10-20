import {
    GetSubscriptionSettingsCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'

export interface IProps {
    groupedTemplates: Record<TSubscriptionTemplateType, string[]>
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    subscriptionSettingsUuid: string
}
